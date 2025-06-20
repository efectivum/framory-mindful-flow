
import React, { useState } from 'react';
import { Message } from '@/types/chat';
import { CoachHabitSuggestion } from './CoachHabitSuggestion';
import { CoachingFeedbackDialog } from './CoachingFeedbackDialog';
import { Button } from './ui/button';
import { ThumbsUp, MessageSquare } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onFeedback?: (data: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const isBot = message.type === 'bot';
  const hasCoachingMetadata = message.coachingMetadata?.canRequestFeedback;

  const handleFeedbackSubmit = (feedbackData: {
    satisfaction: number;
    interventionType: string;
    successMetric: string;
    notes?: string;
  }) => {
    if (onFeedback) {
      onFeedback({
        ...feedbackData,
        interventionType: message.coachingMetadata?.interventionType || feedbackData.interventionType,
      });
    }
    setShowFeedbackDialog(false);
  };

  const handleHabitCreated = () => {
    console.log('Habit created successfully');
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isBot
            ? 'bg-gray-100 text-gray-800'
            : 'bg-blue-600 text-white'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Habit Suggestion */}
        {message.habitSuggestion && (
          <div className="mt-3">
            <CoachHabitSuggestion 
              suggestion={message.habitSuggestion} 
              onHabitCreated={handleHabitCreated}
            />
          </div>
        )}

        {/* Coaching Feedback Button */}
        {isBot && hasCoachingMetadata && onFeedback && (
          <div className="mt-3 flex justify-start">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFeedbackDialog(true)}
              className="text-xs text-gray-600 hover:text-gray-800 p-1 h-auto"
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Rate this coaching
            </Button>
          </div>
        )}

        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {/* Feedback Dialog */}
      {showFeedbackDialog && message.coachingMetadata && (
        <CoachingFeedbackDialog
          isOpen={showFeedbackDialog}
          onClose={() => setShowFeedbackDialog(false)}
          onSubmitFeedback={handleFeedbackSubmit}
          interventionType={message.coachingMetadata.interventionType}
          coachingContent={message.content}
        />
      )}
    </div>
  );
};
