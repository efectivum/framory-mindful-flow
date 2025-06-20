
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Sparkles, Target, BookOpen } from 'lucide-react';

interface OnboardingCompleteProps {
  onComplete: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({ onComplete }) => {
  const nextSteps = [
    {
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      title: "Write regularly",
      description: "Aim for daily entries to build the habit"
    },
    {
      icon: <Target className="w-5 h-5 text-green-500" />,
      title: "Track your habits",
      description: "Check off completed habits to build streaks"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      title: "Review insights",
      description: "Check your dashboard for progress and patterns"
    }
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">You're All Set! 🎉</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
          Welcome to your personal growth journey. You now have all the tools you need to 
          track progress, build habits, and gain insights.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h3 className="font-semibold mb-4">Quick Tips to Get Started:</h3>
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center space-x-3 text-left">
                  {step.icon}
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button onClick={onComplete} size="lg" className="w-full md:w-auto">
          Start My Journey
        </Button>
      </motion.div>
    </div>
  );
};
