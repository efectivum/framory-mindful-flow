import React, { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
  signUp: (email: string, password: string, userData?: UserData) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  resendEmailConfirmation: (email: string) => Promise<any>;
  signOutFromAllDevices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const checkAdminStatus = React.useCallback(async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_id_param: user.id
      });

      if (error) throw error;
      const adminStatus = data || false;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  }, [user]);

  React.useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check admin status when user signs in
        if (session?.user) {
          checkAdminStatus();
        } else {
          setIsAdmin(false);
        }
        
        // Initialize onboarding for new users
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              await supabase.rpc('initialize_user_onboarding', {
                user_id_param: session.user.id
              });
            } catch (error) {
              console.error('Failed to initialize onboarding:', error);
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        checkAdminStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus]);

  const signUp = async (email: string, password: string, userData: UserData = {}) => {
    // Automatically detect timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          timezone,
        },
        emailRedirectTo: redirectUrl
      }
    });
    
    // Send welcome email with better template
    if (data.user && !error) {
      try {
        await supabase.functions.invoke('send-auth-email', {
          body: {
            type: 'welcome',
            email: email,
            name: userData.name || 'there',
            confirmationUrl: redirectUrl,
          }
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the signup process if email fails
      }
    }
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth?reset=true`;
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    // Send password reset email with better template
    if (!error) {
      try {
        await supabase.functions.invoke('send-auth-email', {
          body: {
            type: 'password_reset',
            email: email,
            resetUrl: redirectUrl,
          }
        });
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the process if email fails
      }
    }
    
    return { data, error };
  };

  const resendEmailConfirmation = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { data, error };
  };

  const signOutFromAllDevices = async () => {
    // Sign out from all devices by refreshing the session
    const { error } = await supabase.auth.admin.signOut(user?.id || '', 'global');
    if (error) {
      // Fallback: just sign out from current device
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      checkAdminStatus,
      signUp,
      signIn,
      signOut,
      resetPassword,
      resendEmailConfirmation,
      signOutFromAllDevices,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
