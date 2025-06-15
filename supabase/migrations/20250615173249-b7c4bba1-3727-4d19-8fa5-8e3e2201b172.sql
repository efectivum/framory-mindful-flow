
-- Create a new table to store notifications
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- 'whatsapp', 'push', 'email'
    type TEXT NOT NULL, -- 'daily_reminder', 'weekly_insight', 'habit_checkin'
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'seen'
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comment for clarity
COMMENT ON COLUMN public.notifications.channel IS 'The channel for the notification (e.g., whatsapp, push, email)';
COMMENT ON COLUMN public.notifications.type IS 'The type of notification (e.g., daily_reminder, weekly_insight)';
COMMENT ON COLUMN public.notifications.status IS 'The delivery status of the notification';

-- Add Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for service roles to manage all notifications (for our backend functions)
CREATE POLICY "Service roles can manage all notifications"
ON public.notifications
FOR ALL
USING (true)
WITH CHECK (true);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp on the new table
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_status_scheduled_for ON public.notifications(status, scheduled_for);

