
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  BarChart3, 
  Brain, 
  MessageCircle, 
  Calendar,
  Settings
} from 'lucide-react';

interface OnboardingTourProps {
  onNext: () => void;
}

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
    title: "Dashboard",
    description: "Track your progress with beautiful charts and insights",
    location: "Main page - your central hub"
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-500" />,
    title: "AI Insights",
    description: "Get personalized insights from your journal entries",
    location: "Available with Premium"
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-green-500" />,
    title: "AI Coach", 
    description: "Receive personalized guidance and motivation",
    location: "Coach tab in navigation"
  },
  {
    icon: <Calendar className="w-8 h-8 text-orange-500" />,
    title: "Habit Calendar",
    description: "Visual tracking of your habit streaks and patterns",
    location: "Goals section"
  },
  {
    icon: <Settings className="w-8 h-8 text-gray-500" />,
    title: "Customization",
    description: "Personalize notifications, themes, and preferences",
    location: "Profile settings"
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onNext }) => {
  const [currentFeature, setCurrentFeature] = useState(0);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Compass className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Explore Your Features</h2>
        <p className="text-muted-foreground">
          Here's what you can do to maximize your growth journey
        </p>
      </motion.div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`p-4 cursor-pointer transition-all duration-200 ${
                currentFeature === index 
                  ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setCurrentFeature(index)}
            >
              <div className="flex items-start space-x-4">
                {feature.icon}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    {feature.title === "AI Insights" && (
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-2">{feature.description}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    📍 {feature.location}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button onClick={onNext} size="lg">
          I'm Ready to Start!
        </Button>
      </div>
    </div>
  );
};
