
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ChatMessage } from '@/components/ChatMessage';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ChatHeader } from '@/components/ChatHeader';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';
import { ResponsiveLayout } from '@/components/ResponsiveLayout';
import { NetworkStatusIndicator } from '@/components/NetworkStatusIndicator';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';
import { PremiumGate } from '@/components/PremiumGate';

const Coach = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    setMessages
  } = useChatMessages();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDetectingIntent, setIsDetectingIntent] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isDetectingIntent || isGeneratingResponse) return;
    
    const message = inputValue.trim();
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Simulate message sending - this would be replaced with actual chat logic
      console.log('Sending message:', message);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const suggestedPrompts = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      text: "Help me reflect on my recent experiences",
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      text: "I'm feeling overwhelmed lately",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Help me build better habits",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    }
  ];

  const isChatLoading = false; // Replace with actual loading state

  if (isChatLoading) {
    return (
      <ResponsiveLayout title="AI Coach" subtitle="Your personal growth companion">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <div className="text-lg text-gray-300 font-medium">Initializing your coach...</div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="AI Coach" subtitle="Your personal growth companion" hideBottomNav>
      <NetworkStatusIndicator />
      
      <PremiumGate 
        feature="AI Coach" 
        description="Get personalized guidance, reflective questions, and emotional support from your AI coach."
        className="mb-6"
      >
        <div className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8">
              {/* Enhanced Welcome Section */}
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-breathe app-card-organic" 
                   style={{ background: 'var(--app-accent-primary)' }}>
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-hero">
                  Hello {user?.email?.split('@')[0] || 'there'}! ✨
                </h2>
                <p className="text-subhero max-w-2xl">
                  I'm your AI coach, here to support your personal growth journey. Share what's on your mind, and I'll help you explore your thoughts and feelings.
                </p>
              </div>

              {/* Enhanced Suggested Prompts */}
              <ButtonErrorBoundary fallbackMessage="Suggested prompts are not available">
                <div className="w-full max-w-2xl space-y-4">
                  <h3 className="text-white font-medium text-lg gradient-text">Try asking me about:</h3>
                  <div className="space-y-3">
                    {suggestedPrompts.map((prompt, index) => (
                      <Card 
                        key={index}
                        className="app-card-organic cursor-pointer card-hover"
                        onClick={() => setInputValue(prompt.text)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                                 style={{ background: prompt.gradient }}>
                              {prompt.icon}
                            </div>
                            <span className="text-gray-200 font-medium">{prompt.text}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ButtonErrorBoundary>
            </div>
          ) : (
            <>
              <ChatHeader />
              <MessageList
                messages={messages}
                isDetectingIntent={isDetectingIntent}
                isGeneratingResponse={isGeneratingResponse}
                messagesEndRef={messagesEndRef}
              />
            </>
          )}

          {/* Enhanced Chat Input */}
          <ButtonErrorBoundary fallbackMessage="Chat input is not available">
            <div className="border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-4">
              <div className="flex gap-3 items-end max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind..."
                    className="min-h-[44px] max-h-32 resize-none bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl pr-12"
                    disabled={isDetectingIntent || isGeneratingResponse}
                  />
                  {(isDetectingIntent || isGeneratingResponse || isTyping) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isDetectingIntent || isGeneratingResponse}
                  className="btn-organic h-12 px-6 glow-primary"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </ButtonErrorBoundary>
        </div>
      </PremiumGate>
    </ResponsiveLayout>
  );
};

export default Coach;
