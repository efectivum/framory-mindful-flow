
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp, Heart } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({ onNext }) => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Smart Journaling",
      description: "AI-powered insights from your thoughts and reflections"
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Habit Tracking",
      description: "Build lasting habits with streak tracking and reminders"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      title: "Growth Analytics",
      description: "Visualize your progress with detailed charts and trends"
    },
    {
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      title: "Personalized Coaching",
      description: "Get AI-powered guidance tailored to your journey"
    }
  ];

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Growth Journey</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Discover the power of intentional reflection, habit building, and personal growth. 
          Let's get you started with everything you need to thrive.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-4 h-full">
              <div className="flex items-start space-x-3">
                {feature.icon}
                <div className="text-left">
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button onClick={onNext} size="lg" className="w-full md:w-auto">
          Let's Get Started
        </Button>
      </motion.div>
    </div>
  );
};
