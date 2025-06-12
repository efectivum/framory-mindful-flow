
-- Fix Function Search Path Mutable warnings by adding SET search_path = '' 
-- and using fully qualified schema names for the remaining 4 functions

-- 1. Fix cleanup_expired_signups function
CREATE OR REPLACE FUNCTION public.cleanup_expired_signups()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.pending_signups 
  WHERE expires_at < now() OR completed = true;
END;
$function$;

-- 2. Fix trigger_cleanup_expired_signups function
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_signups()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only run cleanup occasionally to avoid performance impact
  IF random() < 0.01 THEN -- 1% chance on each insert
    PERFORM public.cleanup_expired_signups();
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Fix update_habit_streak function
CREATE OR REPLACE FUNCTION public.update_habit_streak(habit_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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

-- 4. Fix trigger_update_habit_streak function
CREATE OR REPLACE FUNCTION public.trigger_update_habit_streak()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  PERFORM public.update_habit_streak(NEW.habit_id);
  RETURN NEW;
END;
$function$;

-- 5. Create the missing triggers that should exist based on the function names
-- Check if trigger exists and create if missing
DO $$
BEGIN
  -- Create trigger for cleanup on pending_signups insert
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_cleanup_on_insert' 
    AND tgrelid = 'public.pending_signups'::regclass
  ) THEN
    CREATE TRIGGER trigger_cleanup_on_insert
      AFTER INSERT ON public.pending_signups
      FOR EACH ROW
      EXECUTE FUNCTION public.trigger_cleanup_expired_signups();
  END IF;

  -- Create trigger for habit streak update on habit_completions
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_habit_streak_trigger' 
    AND tgrelid = 'public.habit_completions'::regclass
  ) THEN
    CREATE TRIGGER update_habit_streak_trigger
      AFTER INSERT ON public.habit_completions
      FOR EACH ROW
      EXECUTE FUNCTION public.trigger_update_habit_streak();
  END IF;
END $$;
