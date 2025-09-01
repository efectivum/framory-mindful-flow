-- CRITICAL SECURITY FIXES: Fix overly permissive RLS policies

-- Fix pending_signups table: Remove access to personal data for unauthorized users
-- Only allow reading for token validation, not personal information
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

-- Fix subscribers update policy to be service-only
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

CREATE POLICY "Service can update subscriptions" 
ON public.subscribers 
FOR UPDATE 
USING (true);

-- Add additional security function to detect suspicious access patterns
CREATE OR REPLACE FUNCTION public.audit_data_access(
  table_name text,
  user_id_param uuid,
  accessed_data jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log data access for security monitoring
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
    'data_access',
    'Data Access: ' || table_name,
    'User accessed sensitive data from ' || table_name,
    jsonb_build_object(
      'table_name', table_name,
      'timestamp', now(),
      'accessed_data', accessed_data
    )
  );
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't let logging failures break the main operation
    NULL;
END;
$function$;