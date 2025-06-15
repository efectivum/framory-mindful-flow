import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Paperclip, Smile, Loader2 } from 'lucide-react'; // Removed Mic
import { Button } from '@/components/ui/button';
import { ActivitySelector } from './ActivitySelector';
import { ChatMessage } from './ChatMessage';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar for header
import { Textarea } from '@/components/ui/textarea'; // Added Textarea
import { VoiceButton } from './VoiceButton';
import { useToast } from '@/hooks/use-toast';
// Added Textarea

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
  isJournalEntry?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm here to help you with your personal growth journey. You can chat with me about anything or log activities using the + button. What would you like to do today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const { createEntry } = useJournalEntries();
  const { detectIntent, generateResponse, isDetectingIntent, isGeneratingResponse } = useConversationalAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Only allow image or PDF for now
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast({
        title: "Unsupported file",
        description: "Only images and PDFs are supported in this preview.",
        variant: "destructive"
      });
      return;
    }
    setFileAttachment(file);
    textAreaRef.current?.focus();
  };

  const handleSend = async () => {
    if (!inputText.trim() && !fileAttachment) return;
    // Convert attachment to preview URL for now (use actual external upload for production)
    let attachmentUrl: string | undefined = undefined;
    let attachmentType: string | undefined = undefined;
    if (fileAttachment) {
      attachmentUrl = URL.createObjectURL(fileAttachment);
      attachmentType = fileAttachment.type;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
      ...(attachmentUrl ? { attachmentUrl, attachmentType } : {}),
    };

    setMessages(prev => [...prev, newMessage]);
    // Reset input state
    setInputText('');
    setFileAttachment(null);
    textAreaRef.current?.focus();

    // If just file attachment, skip AI
    if (attachmentUrl && !inputText.trim()) return;

    // Detect intent using AI
    const intentResult = await detectIntent(inputText, selectedActivity, conversationHistory);
    console.log('Intent detection result:', intentResult);

    if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
      // Handle as journal entry
      newMessage.isJournalEntry = true;
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? newMessage : msg));

      // Create journal entry
      createEntry({
        content: inputText,
        title: selectedActivity ? `${selectedActivity} entry` : undefined,
      });

      // Generate immediate coaching response for the journal entry
      const aiResponse = await generateResponse(inputText, conversationHistory, true);
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationHistory(prev => [...prev, 
          { role: 'user', content: inputText },
          { role: 'assistant', content: aiResponse }
        ]);
      }
    } else {
      // Handle as conversation
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: inputText }];
      // Do not set conversation history here, set it after getting response
      // setConversationHistory(updatedHistory); 

      const aiResponse = await generateResponse(inputText, updatedHistory, false); // Pass updatedHistory directly
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationHistory([...updatedHistory, { role: 'assistant', content: aiResponse }]);
      } else {
        // Fallback response
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        // Optionally, don't add this failed exchange to history or add a specific marker
      }
    }

    setSelectedActivity(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    setShowActivitySelector(false);
    textAreaRef.current?.focus();
  };

  const handleVoiceTranscription = (transcribedText: string) => {
    setInputText(transcribedText);
    textAreaRef.current?.focus();
  };


  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-[#171c26] border-b border-gray-800 shadow-sm">
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
            AI
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-gray-100 font-semibold text-base">Framory Assistant</h1>
          <p className="text-green-400 text-xs font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#202734]">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Loading indicators */}
        {(isDetectingIntent || isGeneratingResponse) && (
           <div className="flex items-center gap-3 self-start py-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">AI</AvatarFallback>
            </Avatar>
            <div className="bg-[#161c26] text-gray-200 px-4 py-2.5 rounded-xl rounded-bl-md border border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-400">
                  {isDetectingIntent ? 'Understanding...' : (isGeneratingResponse ? 'Thinking...' : 'Processing...')}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#161c26] border-t border-gray-800 p-3 md:p-4 pb-6">
        {selectedActivity && (
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block px-3 py-1 bg-blue-900 text-blue-300 text-xs rounded-full border border-blue-700">
              Logging as: {selectedActivity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedActivity(null)}
              className="text-gray-400 hover:text-gray-200 text-xs h-auto py-0.5 px-1.5"
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <label className="relative">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={isDetectingIntent || isGeneratingResponse}
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-blue-400 hover:bg-blue-950 h-10 w-10 rounded-full shrink-0"
              type="button"
              tabIndex={-1}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </label>

          {fileAttachment && (
            <div className="flex items-center gap-2 ml-2">
              {fileAttachment.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(fileAttachment)}
                  alt="preview"
                  className="w-12 h-12 rounded border border-gray-700 object-contain"
                />
              ) : (
                <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-200 text-xs">
                  {fileAttachment.name}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFileAttachment(null)}
                className="text-gray-400 hover:text-red-400"
                tabIndex={-1}
                type="button"
              >
                ✕
              </Button>
            </div>
          )}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActivitySelector(!showActivitySelector)}
              className={cn(
                "text-gray-400 hover:text-blue-300 hover:bg-blue-900 h-10 w-10 shrink-0 rounded-full",
                showActivitySelector && "text-blue-400 bg-blue-950"
              )}
            >
              <Plus className="w-5 h-5" />
            </Button>
            <ActivitySelector
              isOpen={showActivitySelector}
              onSelect={handleActivitySelect}
              onClose={() => setShowActivitySelector(false)}
            />
          </div>

          <Textarea
            ref={textAreaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.rows = 1;
              const newRows = Math.min(Math.ceil(e.target.scrollHeight / 24), 5);
              e.target.rows = newRows;
            }}
            onKeyPress={handleKeyPress}
            placeholder={selectedActivity ? `Log your ${selectedActivity} experience...` : "Type your message..."}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-xl border-gray-700 bg-[#232b3a] focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3.5 text-sm text-gray-100 placeholder:text-gray-400"
            rows={1}
            disabled={isDetectingIntent || isGeneratingResponse}
          />
          <VoiceButton
            onTranscription={handleVoiceTranscription}
            disabled={isDetectingIntent || isGeneratingResponse}
            className="ml-1"
          />

          <Button
            onClick={handleSend}
            disabled={isDetectingIntent || isGeneratingResponse || (!inputText.trim() && !fileAttachment)}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 rounded-full shrink-0 shadow-sm disabled:opacity-60"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
