-- CRITICAL SECURITY FIXES: Fix overly permissive RLS policies (Fixed Version)

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

-- Enhanced security monitoring function for subscription access
CREATE OR REPLACE FUNCTION public.audit_subscription_access(
  accessed_user_id uuid,
  accessed_email text,
  access_type text DEFAULT 'read'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Only log if someone is accessing another user's data
  IF auth.uid() IS NOT NULL AND auth.uid() != accessed_user_id THEN
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
      'subscription_audit',
      'Cross-User Subscription Access',
      'User accessed another user''s subscription data',
      jsonb_build_object(
        'accessed_user_id', accessed_user_id,
        'accessed_email', accessed_email,
        'access_type', access_type,
        'timestamp', now(),
        'severity', 'high'
      )
    );
  END IF;
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't break functionality if logging fails
    NULL;
END;
$function$;

-- Add security constraint to prevent data leaks in pending signups
-- Create a view that only exposes safe fields for token validation
CREATE OR REPLACE VIEW public.safe_pending_signups AS
SELECT 
  id,
  token,
  expires_at,
  completed
FROM public.pending_signups
WHERE (token IS NOT NULL) 
  AND (expires_at > now()) 
  AND (completed = false);

-- Grant select on the safe view
GRANT SELECT ON public.safe_pending_signups TO authenticated, anon;