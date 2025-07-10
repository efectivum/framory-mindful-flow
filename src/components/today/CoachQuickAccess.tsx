import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { MessageSquare, Sparkles } from 'lucide-react';

export const CoachQuickAccess: React.FC = () => {
  const navigate = useNavigate();
  const { mode } = useTimeOfDay();

  const getCoachPrompt = () => {
    switch (mode) {
      case 'morning':
        return "I'm here if you need to talk through what's on your mind";
      case 'midday':
        return "How's your day going? Any thoughts you'd like to explore?";
      case 'evening':
        return "Want to reflect on your day together?";
      default:
        return "I'm here to listen and support you";
    }
  };

  const getCoachTitle = () => {
    switch (mode) {
      case 'morning':
        return "Need support this morning?";
      case 'midday':
        return "Check in with your coach";
      case 'evening':
        return "Reflect on your day";
      default:
        return "Your AI Coach is here";
    }
  };

  return (
    <Card className="app-card-organic animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">
              {getCoachTitle()}
            </h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              {getCoachPrompt()}
            </p>
            
            <Button
              onClick={() => navigate('/coach')}
              className="btn-organic glow-primary"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start conversation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};