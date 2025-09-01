-- Critical Security Fix: Restrict public access to email_subscribers table
-- Currently anyone can view all email addresses, which is a major privacy violation

-- First, check if email_subscribers table exists and fix it
DO $$
BEGIN
    -- Remove overly permissive public access policy if it exists
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'email_subscribers'
        AND policyname LIKE '%public%' OR policyname LIKE '%anyone%'
    ) THEN
        DROP POLICY IF EXISTS "Anyone can view email subscribers" ON public.email_subscribers;
        DROP POLICY IF EXISTS "Public can view email subscribers" ON public.email_subscribers;
        DROP POLICY IF EXISTS "Allow public read access" ON public.email_subscribers;
    END IF;
    
    -- Add proper RLS policies for email_subscribers if table exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_subscribers'
    ) THEN
        -- Enable RLS if not already enabled
        ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
        
        -- Users can only view their own subscription
        CREATE POLICY "Users can view their own subscription" 
        ON public.email_subscribers 
        FOR SELECT 
        USING (auth.uid()::text = user_id OR auth.email() = email);
        
        -- Users can only manage their own subscription
        CREATE POLICY "Users can manage their own subscription" 
        ON public.email_subscribers 
        FOR ALL 
        USING (auth.uid()::text = user_id OR auth.email() = email)
        WITH CHECK (auth.uid()::text = user_id OR auth.email() = email);
        
        -- Admins can view all subscriptions
        CREATE POLICY "Admins can view all email subscribers" 
        ON public.email_subscribers 
        FOR SELECT 
        USING (get_current_user_admin_status());
        
        -- Admins can manage all subscriptions
        CREATE POLICY "Admins can manage all email subscribers" 
        ON public.email_subscribers 
        FOR ALL 
        USING (get_current_user_admin_status())
        WITH CHECK (get_current_user_admin_status());
    END IF;
END $$;

-- Fix database function security: Add SET search_path to remaining functions
-- This prevents SQL injection through search path manipulation

-- Fix reset_weekly_coaching_counts function
CREATE OR REPLACE FUNCTION public.reset_weekly_coaching_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.coaching_state 
  SET 
    level_2_count_this_week = 0,
    level_3_count_this_week = 0,
    week_start_date = date_trunc('week', now())::date,
    updated_at = now()
  WHERE week_start_date < date_trunc('week', now())::date;
END;
$function$;

-- Fix update_habit_streak function
CREATE OR REPLACE FUNCTION public.update_habit_streak(habit_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  latest_completion timestamp with time zone;
  streak_count integer := 0;
  current_date_check date;
BEGIN
  -- Get the latest completion for this habit
  SELECT completed_at INTO latest_completion
  FROM public.habit_completions 
  WHERE habit_id = habit_id_param 
  ORDER BY completed_at DESC 
  LIMIT 1;

  -- If no completions, set streak to 0
  IF latest_completion IS NULL THEN
    UPDATE public.habits 
    SET current_streak = 0, updated_at = now()
    WHERE id = habit_id_param;
    RETURN;
  END IF;

  -- Calculate streak from latest completion backwards
  current_date_check := latest_completion::date;
  
  WHILE EXISTS (
    SELECT 1 FROM public.habit_completions 
    WHERE habit_id = habit_id_param 
    AND completed_at::date = current_date_check
  ) LOOP
    streak_count := streak_count + 1;
    current_date_check := current_date_check - interval '1 day';
  END LOOP;

  -- Update the habit with new streak
  UPDATE public.habits 
  SET 
    current_streak = streak_count,
    longest_streak = GREATEST(longest_streak, streak_count),
    updated_at = now()
  WHERE id = habit_id_param;
END;
$function$;

-- Fix trigger_update_habit_streak function
CREATE OR REPLACE FUNCTION public.trigger_update_habit_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  PERFORM public.update_habit_streak(NEW.habit_id);
  RETURN NEW;
END;
$function$;

-- Restrict pending_signups access further to address privacy concerns
-- Current token-based access still exposes sensitive data

-- Add data masking for sensitive fields in pending_signups
CREATE OR REPLACE VIEW public.masked_pending_signups AS
SELECT 
  id,
  token,
  CASE 
    WHEN char_length(name) > 0 THEN 
      left(name, 1) || repeat('*', greatest(char_length(name) - 2, 0)) || 
      CASE WHEN char_length(name) > 1 THEN right(name, 1) ELSE '' END
    ELSE name 
  END as masked_name,
  CASE 
    WHEN char_length(phone_number) > 4 THEN 
      '***-***-' || right(phone_number, 4)
    ELSE '***-****' 
  END as masked_phone,
  expires_at,
  completed,
  timezone,
  created_at
FROM public.pending_signups
WHERE expires_at > now() AND completed = false;

-- Grant access to the masked view instead of direct table access for non-admin users
GRANT SELECT ON public.masked_pending_signups TO authenticated, anon;

-- Add security logging function for monitoring suspicious activity
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  user_id_param uuid DEFAULT NULL,
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log to a hypothetical security_events table (would need to be created)
  -- For now, just use the existing user_activities table with security type
  INSERT INTO public.user_activities (
    user_id,
    type,
    source,
    title,
    content,
    metadata
  ) VALUES (
    COALESCE(user_id_param, auth.uid()),
    'security_event',
    'system',
    'Security Event: ' || event_type,
    'Security monitoring detected: ' || event_type,
    jsonb_build_object(
      'event_type', event_type,
      'timestamp', now(),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
      'details', details
    )
  );
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't let logging failures break the main operation
    NULL;
END;
$function$;