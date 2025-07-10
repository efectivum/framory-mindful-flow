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
    <Card className="app-card-organic animate-fade-in border-purple-500/20 mb-6">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mx-auto mb-4 flex items-center justify-center animate-breathe shadow-xl shadow-purple-500/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">
            {getCoachTitle()}
          </h3>
          <p className="text-gray-400 leading-relaxed">
            {getCoachPrompt()}
          </p>
        </div>
        
        <Button
          onClick={() => navigate('/coach')}
          className="btn-organic glow-primary w-full max-w-sm h-14 text-lg font-medium"
          size="lg"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Start conversation
        </Button>
      </CardContent>
    </Card>
  );
};