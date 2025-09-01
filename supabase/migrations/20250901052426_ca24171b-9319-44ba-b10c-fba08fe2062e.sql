-- Fix remaining functions missing search_path protection

-- Fix handle_new_user function
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

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Fix trigger_cleanup_expired_signups function
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_signups()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only run cleanup occasionally to avoid performance impact
  IF random() < 0.01 THEN -- 1% chance on each insert
    PERFORM public.cleanup_expired_signups();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix update_session_last_message_at function
CREATE OR REPLACE FUNCTION public.update_session_last_message_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.chat_sessions 
  SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$function$;

-- Fix trigger_update_routine_streak function
CREATE OR REPLACE FUNCTION public.trigger_update_routine_streak()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  PERFORM public.update_routine_streak(NEW.user_routine_id);
  RETURN NEW;
END;
$function$;