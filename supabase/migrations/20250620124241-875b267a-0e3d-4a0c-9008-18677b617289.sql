
-- Add email preference columns to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN weekly_insights_email boolean NOT NULL DEFAULT true,
ADD COLUMN security_alerts_email boolean NOT NULL DEFAULT true,
ADD COLUMN marketing_emails boolean NOT NULL DEFAULT false;
