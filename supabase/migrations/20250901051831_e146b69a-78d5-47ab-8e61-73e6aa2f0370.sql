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
  -- Log security events to user_activities table with security type
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
      'details', details
    )
  );
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't let logging failures break the main operation
    NULL;
END;
$function$;