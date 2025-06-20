
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<number>(0);

  const checkAdminStatus = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    // Rate limiting - only check once per 30 seconds
    const now = Date.now();
    if (now - lastCheck < 30000 && lastCheck > 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('is_admin', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Admin check error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data || false);
      }
      setLastCheck(now);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [user, lastCheck]);

  useEffect(() => {
    checkAdminStatus();
  }, [user?.id]); // Only depend on user ID

  return {
    isAdmin,
    isLoading,
    checkAdminStatus
  };
};
