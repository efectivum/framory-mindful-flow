
-- Fix the admin_roles RLS policies to prevent infinite recursion
DROP POLICY IF EXISTS "Admins can view admin roles" ON public.admin_roles;
DROP POLICY IF EXISTS "Admins can manage admin roles" ON public.admin_roles;

-- Create a security definer function to safely check admin status
CREATE OR REPLACE FUNCTION public.get_current_user_admin_status()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid()
  );
$$;

-- Create new admin_roles policies using the security definer function
CREATE POLICY "Admins can view admin roles" 
  ON public.admin_roles 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can manage admin roles" 
  ON public.admin_roles 
  FOR ALL 
  USING (public.get_current_user_admin_status());

-- Fix the subscribers table RLS policies to allow admin access
CREATE POLICY "Admins can view all subscribers" 
  ON public.subscribers 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can manage all subscribers" 
  ON public.subscribers 
  FOR ALL 
  USING (public.get_current_user_admin_status());

-- Update the is_admin function to use the security definer approach
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param
  );
$$;

-- Add admin access policies to other tables that the dashboard needs
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can view all journal entries" 
  ON public.journal_entries 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can view all habits" 
  ON public.habits 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can view all chat sessions" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (public.get_current_user_admin_status());

CREATE POLICY "Admins can view all notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (public.get_current_user_admin_status());
