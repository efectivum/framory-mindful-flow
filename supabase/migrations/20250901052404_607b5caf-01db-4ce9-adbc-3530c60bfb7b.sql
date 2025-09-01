-- Fix security issues from previous migration

-- Fix 1: Remove the security definer view and replace with safer approach
DROP VIEW IF EXISTS public.safe_pending_signups;

-- Fix 2 & 3: Add missing search_path to remaining functions
CREATE OR REPLACE FUNCTION public.cleanup_expired_exports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.data_exports 
  WHERE expires_at < now();
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

-- Additional security: Restrict pending_signups to only show necessary fields
-- Remove personal information exposure entirely
DROP POLICY IF EXISTS "Allow token validation only" ON public.pending_signups;

CREATE POLICY "Token validation for service only" 
ON public.pending_signups 
FOR SELECT 
USING (false);  -- Block all direct access

-- Create a secure function for token validation that doesn't expose personal data
CREATE OR REPLACE FUNCTION public.validate_signup_token(token_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pending_signups 
    WHERE token = token_input 
      AND expires_at > now() 
      AND completed = false
  );
END;
$function$;

-- Grant execute permission to authenticated and anonymous users for token validation
GRANT EXECUTE ON FUNCTION public.validate_signup_token(text) TO authenticated, anon;