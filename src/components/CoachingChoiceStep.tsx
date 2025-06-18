
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoachingChoiceStepProps {
  isVisible: boolean;
  onChatWithCoach: () => void;
  onFinalizeEntry: () => void;
}

export const CoachingChoiceStep: React.FC<CoachingChoiceStepProps> = ({
  isVisible,
  onChatWithCoach,
  onFinalizeEntry
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
    >
      <Card className="bg-gray-800 border-gray-700 w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white text-lg">
            How would you like to go deeper?
          </CardTitle>
          <p className="text-gray-400 text-sm">Choose how to continue your reflection journey</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={onChatWithCoach}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white justify-start text-left"
          >
            <MessageCircle className="w-6 h-6 mr-4 shrink-0" />
            <div>
              <div className="font-semibold">Chat with Coach</div>
              <div className="text-xs text-blue-100 opacity-90">
                Discuss your thoughts with AI coaching
              </div>
            </div>
          </Button>
          
          <Button
            onClick={onFinalizeEntry}
            variant="outline"
            className="w-full h-16 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white justify-start text-left"
          >
            <Save className="w-6 h-6 mr-4 shrink-0" />
            <div>
              <div className="font-semibold">Finalize Entry</div>
              <div className="text-xs text-gray-400">
                Save your entry and continue
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
