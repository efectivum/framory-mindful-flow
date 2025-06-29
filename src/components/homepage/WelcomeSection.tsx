
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { useTodayContent } from "@/hooks/useTodayContent";
import { useToast } from '@/hooks/use-toast';
import { ButtonErrorBoundary } from '@/components/ButtonErrorBoundary';

export const WelcomeSection: React.FC = () => {
  const { greeting } = useTimeOfDay();
  const todayContent = useTodayContent();
  const { toast } = useToast();
  const [intentionInput, setIntentionInput] = React.useState('');
  const [isSettingIntention, setIsSettingIntention] = React.useState(false);

  const handleSetIntention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentionInput.trim()) return;
    
    setIsSettingIntention(true);
    try {
      await todayContent.setIntention(intentionInput.trim());
      setIntentionInput('');
      toast({
        title: "Intention Set! ✨",
        description: "Your daily intention has been saved.",
      });
    } catch (error) {
      console.error('Failed to set intention:', error);
      toast({
        title: "Failed to set intention",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSettingIntention(false);
    }
  };

  return (
    <>
      {/* Enhanced Welcome Section */}
      <div className="text-center space-y-6 pt-6">
        <h1 className="text-hero animate-fade-in">{greeting}</h1>
        <p className="text-subhero max-w-2xl mx-auto animate-fade-in">
          {todayContent.prompt}
        </p>
      </div>

      {todayContent.showIntentionBox && (
        <ButtonErrorBoundary fallbackMessage="Intention setting is not available">
          <Card className="app-card-organic max-w-md mx-auto animate-fade-in">
            <CardContent className="p-6">
              {todayContent.intention ? (
                <div className="text-center space-y-4">
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm font-medium">Today's intention</p>
                    <p className="text-white font-medium text-lg gradient-text-warm">"{todayContent.intention}"</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => todayContent.setIntention("")}
                    className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-2xl transition-all duration-300"
                  >
                    Change intention
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSetIntention} className="space-y-5">
                  <div>
                    <label className="block text-gray-400 text-sm mb-3 font-medium">Set your intention for today</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700/30 border border-gray-600/30 rounded-2xl px-5 py-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="e.g. Be present in every moment"
                      value={intentionInput}
                      onChange={e => setIntentionInput(e.target.value)}
                      maxLength={64}
                      autoFocus
                      disabled={isSettingIntention}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="btn-organic w-full glow-primary"
                    disabled={isSettingIntention || !intentionInput.trim()}
                  >
                    {isSettingIntention ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting...
                      </>
                    ) : (
                      'Set Intention'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </ButtonErrorBoundary>
      )}
    </>
  );
};
