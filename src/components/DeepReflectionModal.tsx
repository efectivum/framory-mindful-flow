
import { useState } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InlineLoading } from '@/components/ui/inline-loading';
import { useToast } from '@/hooks/use-toast';
import { useDeepReflection } from '@/hooks/useDeepReflection';
import { JournalEntry } from '@/hooks/useJournalEntries';
import { useNavigate } from 'react-router-dom';

interface DeepReflectionModalProps {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry;
}

export const DeepReflectionModal = ({ open, onClose, entry }: DeepReflectionModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateDeepReflection, getDeepReflection } = useDeepReflection();
  const { data: existingReflection } = getDeepReflection(entry.id);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGenerateReflection = async () => {
    setIsGenerating(true);
    try {
      await generateDeepReflection(entry);
      toast({
        title: "Reflection Generated",
        description: "Your deep reflection is ready to explore.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartConversation = () => {
    onClose();
    navigate('/chat');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Deep Reflection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!existingReflection && !isGenerating && (
            <div className="text-center py-6">
              <p className="text-gray-300 mb-4">
                Let me reflect on your journal entry and ask you a deeper question to help you explore your thoughts further.
              </p>
              <Button 
                onClick={handleGenerateReflection}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Generate Deep Reflection
              </Button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center py-8">
              <InlineLoading 
                message="Creating your reflection..." 
                size="lg"
                className="text-gray-300 justify-center"
              />
            </div>
          )}

          {existingReflection && (
            <div className="space-y-4">
              {/* Reflection Content */}
              <Card className="bg-gray-700/30 border-gray-600">
                <CardContent className="p-4">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {existingReflection.reflection_content}
                  </div>
                </CardContent>
              </Card>

              {/* Probing Question */}
              <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-indigo-500/30">
                <CardContent className="p-4">
                  <h4 className="text-indigo-300 font-medium mb-2">Question to Explore:</h4>
                  <p className="text-gray-300 leading-relaxed font-medium">
                    {existingReflection.probing_question}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={handleStartConversation}
                  className="bg-indigo-600 hover:bg-indigo-700 flex-1"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continue with AI Coach
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
