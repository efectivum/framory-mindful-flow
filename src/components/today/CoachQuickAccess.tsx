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
    <Card className="card-serene animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="icon-container flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-semibold mb-2">
              {getCoachTitle()}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {getCoachPrompt()}
            </p>
            
            <Button
              onClick={() => navigate('/coach')}
              className="btn-serene"
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
