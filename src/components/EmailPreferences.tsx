
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';

export const EmailPreferences = () => {
  const { sendWeeklyInsights } = useEmailPreferences();
  const { toast } = useToast();

  const handleSendTestInsights = async () => {
    try {
      const result = await sendWeeklyInsights();
      
      if (result?.success) {
        toast({
          title: "Insights sent!",
          description: "Check your email for your weekly insights.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send weekly insights email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending test insights:', error);
      toast({
        title: "Error",
        description: "Failed to send weekly insights email.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="card-serene border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Mail className="w-5 h-5 text-warning" />
          Email Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-foreground font-medium text-sm">Test Weekly Insights</p>
            <p className="text-muted-foreground text-xs">Send yourself a sample email</p>
          </div>
          <Button onClick={handleSendTestInsights} variant="outline" size="sm" className="btn-serene">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <h4 className="text-primary font-medium text-sm mb-2">Email Settings</h4>
          <p className="text-muted-foreground text-xs">
            Email preferences are managed in the Personal Preferences section. 
            Enable/disable weekly insights, alerts, and updates there.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
