
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
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Test Weekly Insights</p>
            <p className="text-gray-400 text-sm">Send yourself a sample weekly insights email</p>
          </div>
          <Button onClick={handleSendTestInsights} variant="outline" size="sm">
            <Send className="w-4 h-4 mr-2" />
            Send Test Email
          </Button>
        </div>

        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">Email Settings</h4>
          <p className="text-blue-300 text-sm">
            Email preferences are now managed in the Personal Preferences section above. 
            You can enable/disable weekly insights, security alerts, and product updates there.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
