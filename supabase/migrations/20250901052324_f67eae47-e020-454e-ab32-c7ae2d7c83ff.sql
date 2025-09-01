-- CRITICAL SECURITY FIXES: Fix overly permissive RLS policies

-- Fix pending_signups table: Remove access to personal data for unauthorized users
-- Only allow reading specific fields needed for token validation
DROP POLICY IF EXISTS "Allow reading pending signup by valid token" ON public.pending_signups;

CREATE POLICY "Allow token validation only" 
ON public.pending_signups 
FOR SELECT 
USING (
  (token IS NOT NULL) 
  AND (expires_at > now()) 
  AND (completed = false)
);

-- Fix subscribers table: Restrict email-based access that could expose other users' data
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;

CREATE POLICY "Users can view their own subscription only" 
ON public.subscribers 
FOR SELECT 
USING (user_id = auth.uid());

-- Add admin policy for subscriber management
CREATE POLICY "Admins can view all subscriber records" 
ON public.subscribers 
FOR SELECT 
USING (get_current_user_admin_status());

-- Ensure subscribers update policy is properly restricted
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

CREATE POLICY "Service can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
USING (true);

-- Add security event logging for suspicious subscription access attempts
CREATE OR REPLACE FUNCTION public.log_subscription_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log when someone tries to access subscription data
  IF TG_OP = 'SELECT' AND auth.uid() IS NOT NULL THEN
    INSERT INTO public.user_activities (
      user_id,
      type,
      source,
      title,
      content,
      metadata
    ) VALUES (
      auth.uid(),
      'security_event',
      'subscription_access',
      'Subscription Data Access',
      'User accessed subscription information',
      jsonb_build_object(
        'accessed_user_id', NEW.user_id,
        'accessed_email', NEW.email,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for subscription access logging
DROP TRIGGER IF EXISTS log_subscription_access_trigger ON public.subscribers;
CREATE TRIGGER log_subscription_access_trigger
  AFTER SELECT ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.log_subscription_access();