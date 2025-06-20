
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEmailPreferences } from '@/hooks/useEmailPreferences';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Shield, TrendingUp } from 'lucide-react';

export const EmailPreferences = () => {
  const { preferences, loading, updatePreferences, sendWeeklyInsights } = useEmailPreferences();
  const { toast } = useToast();

  const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
    const result = await updatePreferences({ [key]: value });
    
    if (result?.success) {
      toast({
        title: "Preferences updated",
        description: "Your email preferences have been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update email preferences.",
        variant: "destructive",
      });
    }
  };

  const handleSendTestInsights = async () => {
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
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading email preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <Label htmlFor="weekly-insights" className="text-white font-medium">
                  Weekly Insights
                </Label>
              </div>
              <p className="text-gray-400 text-sm">
                Get personalized insights about your mood trends and habit progress
              </p>
            </div>
            <Switch
              id="weekly-insights"
              checked={preferences.weekly_insights_email}
              onCheckedChange={(checked) => handlePreferenceChange('weekly_insights_email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                <Label htmlFor="security-alerts" className="text-white font-medium">
                  Security Alerts
                </Label>
              </div>
              <p className="text-gray-400 text-sm">
                Important notifications about your account security
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={preferences.security_alerts_email}
              onCheckedChange={(checked) => handlePreferenceChange('security_alerts_email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <Label htmlFor="marketing-emails" className="text-white font-medium">
                  Product Updates
                </Label>
              </div>
              <p className="text-gray-400 text-sm">
                Occasional updates about new features and improvements
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketing_emails}
              onCheckedChange={(checked) => handlePreferenceChange('marketing_emails', checked)}
            />
          </div>
        </div>

        {preferences.weekly_insights_email && (
          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Test Weekly Insights</p>
                <p className="text-gray-400 text-sm">Send yourself a sample weekly insights email</p>
              </div>
              <Button onClick={handleSendTestInsights} variant="outline" size="sm">
                Send Test Email
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
