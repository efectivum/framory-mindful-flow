
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Loader2, Settings } from 'lucide-react';

interface PreferencesFormData {
  tone_of_voice: 'calm' | 'motivational' | 'supportive' | 'direct' | 'gentle';
  growth_focus: 'habits' | 'mindfulness' | 'goals' | 'journaling';
  notification_time: string;
  notification_frequency: 'daily' | 'weekly' | 'custom' | 'none';
  whatsapp_enabled: boolean;
  push_notifications_enabled: boolean;
  weekly_insights_email: boolean;
  security_alerts_email: boolean;
  marketing_emails: boolean;
}

export const UserPreferencesForm = () => {
  const { preferences, updatePreferences, isUpdating, isLoading } = useUserPreferences();

  const form = useForm<PreferencesFormData>({
    defaultValues: {
      tone_of_voice: 'supportive',
      growth_focus: 'habits',
      notification_time: '09:00',
      notification_frequency: 'daily',
      whatsapp_enabled: false,
      push_notifications_enabled: true,
      weekly_insights_email: true,
      security_alerts_email: true,
      marketing_emails: false,
    },
  });

  // Update form when preferences load
  React.useEffect(() => {
    if (preferences && !isLoading) {
      form.reset({
        tone_of_voice: preferences.tone_of_voice || 'supportive',
        growth_focus: preferences.growth_focus || 'habits',
        notification_time: preferences.notification_time || '09:00',
        notification_frequency: preferences.notification_frequency || 'daily',
        whatsapp_enabled: preferences.whatsapp_enabled || false,
        push_notifications_enabled: preferences.push_notifications_enabled !== false,
        weekly_insights_email: preferences.weekly_insights_email !== false,
        security_alerts_email: preferences.security_alerts_email !== false,
        marketing_emails: preferences.marketing_emails || false,
      });
    }
  }, [preferences, isLoading, form]);

  const onSubmit = (data: PreferencesFormData) => {
    console.log('Form submitted with data:', data);
    updatePreferences(data);
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="ml-2 text-white">Loading preferences...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Personal Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tone of Voice */}
            <FormField
              control={form.control}
              name="tone_of_voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">AI Tone of Voice</FormLabel>
                  <FormDescription className="text-gray-400">
                    How would you like the AI to communicate with you in journal analysis?
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="calm" id="calm" />
                        <Label htmlFor="calm" className="text-gray-300">Calm & Peaceful</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="motivational" id="motivational" />
                        <Label htmlFor="motivational" className="text-gray-300">Motivational</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="supportive" id="supportive" />
                        <Label htmlFor="supportive" className="text-gray-300">Supportive</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="direct" id="direct" />
                        <Label htmlFor="direct" className="text-gray-300">Direct & Clear</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gentle" id="gentle" />
                        <Label htmlFor="gentle" className="text-gray-300">Gentle & Kind</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Growth Focus */}
            <FormField
              control={form.control}
              name="growth_focus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Primary Growth Focus</FormLabel>
                  <FormDescription className="text-gray-400">
                    What area would you like to focus on most in your personal development?
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-2 gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="habits" id="habits" />
                        <Label htmlFor="habits" className="text-gray-300">Building Habits</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mindfulness" id="mindfulness" />
                        <Label htmlFor="mindfulness" className="text-gray-300">Mindfulness</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="goals" id="goals" />
                        <Label htmlFor="goals" className="text-gray-300">Goal Achievement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="journaling" id="journaling" />
                        <Label htmlFor="journaling" className="text-gray-300">Self-Reflection</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Notification Settings</h3>
              
              <FormField
                control={form.control}
                name="notification_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Reminder Frequency</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily" className="text-gray-300">Daily</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly" className="text-gray-300">Weekly</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label htmlFor="custom" className="text-gray-300">Custom</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <Label htmlFor="none" className="text-gray-300">None</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notification_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Preferred Reminder Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="push_notifications_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-white font-medium">Push Notifications</FormLabel>
                      <FormDescription className="text-gray-400">
                        Receive push notifications for reminders and insights
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-white font-medium">WhatsApp Notifications</FormLabel>
                      <FormDescription className="text-gray-400">
                        Receive gentle reminders and prompts via WhatsApp
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Email Preferences */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Email Preferences</h3>
              
              <FormField
                control={form.control}
                name="weekly_insights_email"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-white font-medium">Weekly Insights</FormLabel>
                      <FormDescription className="text-gray-400">
                        Get personalized insights about your mood trends and habit progress
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="security_alerts_email"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-white font-medium">Security Alerts</FormLabel>
                      <FormDescription className="text-gray-400">
                        Important notifications about your account security
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketing_emails"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-white font-medium">Product Updates</FormLabel>
                      <FormDescription className="text-gray-400">
                        Occasional updates about new features and improvements
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
