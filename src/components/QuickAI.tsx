
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumGate } from '@/components/PremiumGate';
import { useNavigate } from 'react-router-dom';

export const QuickAI: React.FC = () => {
  const { isPremium, isBeta } = useSubscription();
  const navigate = useNavigate();

  const handleTalkToCoach = () => {
    navigate('/coach');
  };

  if (!isPremium && !isBeta) {
    return (
      <PremiumGate
        feature="AI Coach"
        description="Get personalized AI guidance and support for your journaling journey."
        className="my-6"
      />
    );
  }

  return (
    <div className="text-center p-4 bg-gray-900/50 rounded-lg border border-gray-700 my-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Crown className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">AI Coach Available</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">Your AI assistant is here to help you unpack your thoughts.</p>
      <Button 
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        onClick={handleTalkToCoach}
      >
        Talk to Coach
      </Button>
    </div>
  );
};
