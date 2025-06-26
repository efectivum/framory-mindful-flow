
-- Create notification templates table
CREATE TABLE public.notification_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    channel TEXT NOT NULL, -- 'push', 'email', 'whatsapp'
    type TEXT NOT NULL, -- 'daily_reminder', 'weekly_insight', 'habit_checkin', 'custom'
    subject_template TEXT, -- For email notifications
    content_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_system BOOLEAN NOT NULL DEFAULT false, -- System templates can't be deleted
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all templates
CREATE POLICY "Admins can manage all notification templates"
ON public.notification_templates
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.admin_roles 
        WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admin_roles 
        WHERE user_id = auth.uid()
    )
);

-- Create policy for users to view active templates (for preview purposes)
CREATE POLICY "Users can view active notification templates"
ON public.notification_templates
FOR SELECT
USING (is_active = true);

-- Add updated_at trigger
CREATE TRIGGER update_notification_templates_updated_at
BEFORE UPDATE ON public.notification_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add template_id column to notifications table
ALTER TABLE public.notifications 
ADD COLUMN template_id UUID REFERENCES public.notification_templates(id);

-- Create index for performance
CREATE INDEX idx_notification_templates_channel_type ON public.notification_templates(channel, type);
CREATE INDEX idx_notifications_template_id ON public.notifications(template_id);

-- Insert default system templates
INSERT INTO public.notification_templates (
    name, 
    description, 
    channel, 
    type, 
    content_template, 
    variables, 
    is_system
) VALUES 
(
    'Daily Reminder - Push',
    'Default daily reminder push notification',
    'push',
    'daily_reminder',
    'Time for your daily reflection, {{user_name}}! How are you feeling today?',
    '["user_name", "current_time", "streak_count"]'::jsonb,
    true
),
(
    'Weekly Insights - Email',
    'Default weekly insights email template',
    'email',
    'weekly_insight',
    'Hi {{user_name}},

Here are your insights for this week:

{{weekly_summary}}

Keep up the great work!
Your Personal Growth Coach',
    '["user_name", "weekly_summary", "total_entries", "mood_trend"]'::jsonb,
    true
),
(
    'Habit Check-in - Push',
    'Default habit check-in reminder',
    'push',
    'habit_checkin',
    'Don''t forget about your {{habit_name}} habit! You''re on a {{streak_count}} day streak 🔥',
    '["user_name", "habit_name", "streak_count", "habit_time"]'::jsonb,
    true
);
