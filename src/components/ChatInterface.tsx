import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus, Paperclip, Smile, Loader2 } from 'lucide-react'; // Added Loader2
import { Button } from '@/components/ui/button';
import { ActivitySelector } from './ActivitySelector';
import { ChatMessage } from './ChatMessage';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useConversationalAI } from '@/hooks/useConversationalAI';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // Added Avatar for header
import { Textarea } from '@/components/ui/textarea'; // Added Textarea

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  activityType?: string;
  timestamp: Date;
  isJournalEntry?: boolean;
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
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  
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

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      activityType: selectedActivity || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText;
    setInputText('');
    textAreaRef.current?.focus(); // Keep focus after send

    // Detect intent using AI
    const intentResult = await detectIntent(currentInput, selectedActivity, conversationHistory);
    console.log('Intent detection result:', intentResult);

    if (intentResult?.intent === 'journal' && intentResult.confidence > 0.7) {
      // Handle as journal entry
      newMessage.isJournalEntry = true;
      setMessages(prev => prev.map(msg => msg.id === newMessage.id ? newMessage : msg));

      // Create journal entry
      createEntry({
        content: currentInput,
        title: selectedActivity ? `${selectedActivity} entry` : undefined,
      });

      // Generate immediate coaching response for the journal entry
      const aiResponse = await generateResponse(currentInput, conversationHistory, true);
      
      if (aiResponse) {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: aiResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationHistory(prev => [...prev, 
          { role: 'user', content: currentInput },
          { role: 'assistant', content: aiResponse }
        ]);
      }
    } else {
      // Handle as conversation
      const updatedHistory = [...conversationHistory, { role: 'user' as const, content: currentInput }];
      // Do not set conversation history here, set it after getting response
      // setConversationHistory(updatedHistory); 

      const aiResponse = await generateResponse(currentInput, updatedHistory, false); // Pass updatedHistory directly
      
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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };


  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-[#171c26] border-b border-gray-800 shadow-sm">
        {/* ... keep existing header code ... */}
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
        {/* ... keep existing input area code ... */}
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
          {/* ... keep existing control code ... */}
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

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-400 hover:bg-blue-950 h-10 w-10 rounded-full shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        
          {inputText.trim() || selectedActivity ? (
            <Button
              onClick={handleSend}
              disabled={isDetectingIntent || isGeneratingResponse || (!inputText.trim() && !selectedActivity)}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 rounded-full shrink-0 shadow-sm disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={toggleRecording}
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shrink-0 transition-colors shadow-sm",
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-[#232b3a] hover:bg-[#2b3750] text-gray-300"
              )}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
