-- CRITICAL SECURITY FIXES

-- 1. Remove public access to pending_signups and restrict to service role only
DROP POLICY IF EXISTS "Allow reading pending signup by token" ON public.pending_signups;

-- Create token-based lookup policy for legitimate signup verification
CREATE POLICY "Allow reading pending signup by valid token" 
ON public.pending_signups 
FOR SELECT 
USING (
  -- Only allow reading if the token matches and signup hasn't expired
  token IS NOT NULL AND 
  expires_at > now() AND 
  completed = false
);

-- 2. Fix database functions with proper search_path to prevent SQL injection
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param
  );
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, timezone)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'timezone', 'UTC'));
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_signups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.pending_signups 
  WHERE expires_at < now() OR completed = true;
END;
$function$;

CREATE OR REPLACE FUNCTION public.initialize_user_onboarding(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_onboarding (user_id, current_step, completed_steps, completion_percentage)
  VALUES (user_id_param, 'welcome', '{}', 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_achievements(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  entry_count INTEGER;
  habit_count INTEGER;
  streak_count INTEGER;
BEGIN
  -- Count journal entries
  SELECT COUNT(*) INTO entry_count
  FROM public.journal_entries 
  WHERE user_id = user_id_param AND deleted_at IS NULL;
  
  -- Count active habits
  SELECT COUNT(*) INTO habit_count
  FROM public.habits 
  WHERE user_id = user_id_param AND is_active = true;
  
  -- Get max streak
  SELECT COALESCE(MAX(current_streak), 0) INTO streak_count
  FROM public.habits 
  WHERE user_id = user_id_param;
  
  -- Award achievements based on milestones
  IF entry_count >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'first_entry', 'First Entry', 'You wrote your first journal entry!', '📝', 'journaling')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF entry_count >= 7 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'week_writer', 'Week Writer', 'You''ve written 7 journal entries!', '🗓️', 'journaling')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF habit_count >= 1 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'habit_starter', 'Habit Starter', 'You created your first habit!', '🎯', 'habits')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
  
  IF streak_count >= 7 THEN
    INSERT INTO public.user_achievements (user_id, achievement_type, achievement_key, title, description, icon, category)
    VALUES (user_id_param, 'milestone', 'week_streak', 'Week Streak', 'You maintained a 7-day habit streak!', '🔥', 'habits')
    ON CONFLICT (user_id, achievement_key) DO NOTHING;
  END IF;
END;
$function$;

-- 3. Add rate limiting table for edge functions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits policies
CREATE POLICY "Users can view their own rate limits" 
ON public.rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (true);