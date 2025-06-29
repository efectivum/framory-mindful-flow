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
  isPremium: boolean;
  isBeta: boolean;
  subscriptionTier: 'free' | 'premium' | 'beta';
  subscriptionEnd: string | null;
  checkAdminStatus: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
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
  const [initialized, setInitialized] = React.useState(false);
  
  // Subscription state
  const [isPremium, setIsPremium] = React.useState(false);
  const [isBeta, setIsBeta] = React.useState(false);
  const [subscriptionTier, setSubscriptionTier] = React.useState<'free' | 'premium' | 'beta'>('free');
  const [subscriptionEnd, setSubscriptionEnd] = React.useState<string | null>(null);

  const checkAdminStatus = React.useCallback(async (): Promise<boolean> => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_id_param: user.id
      });

      if (error) {
        console.error('Auth: Admin check RPC error:', error);
        throw error;
      }
      
      const adminStatus = data || false;
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('Auth: Error checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  }, [user]);

  const checkSubscriptionStatus = React.useCallback(async () => {
    if (!user?.email) {
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
      return;
    }

    try {
      const { data: subscriberData, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error) {
        console.error('Auth: Error fetching subscription data:', error);
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      if (!subscriberData) {
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      // Check for beta users FIRST
      if (subscriberData.subscription_tier === 'beta') {
        setSubscriptionTier('beta');
        setIsBeta(true);
        setIsPremium(false);
        setSubscriptionEnd(subscriberData.subscription_end);
        return;
      }

      // For non-beta users, check subscription status
      const now = new Date();
      const endDate = subscriberData.subscription_end ? new Date(subscriberData.subscription_end) : null;
      const isSubscriptionActive = subscriberData.subscribed && (!endDate || endDate > now);
      
      if (isSubscriptionActive && subscriberData.subscription_tier === 'premium') {
        setSubscriptionTier('premium');
        setIsPremium(true);
        setIsBeta(false);
        setSubscriptionEnd(subscriberData.subscription_end);
      } else {
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
      }
      
    } catch (error) {
      console.error('Auth: Error checking subscription:', error);
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
    }
  }, [user?.email]);

  const refreshSubscription = React.useCallback(async () => {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      await checkSubscriptionStatus();
    } catch (error) {
      console.error('Auth: Error refreshing subscription:', error);
    }
  }, [user?.email, checkSubscriptionStatus]);

  const createCheckout = React.useCallback(async () => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  }, [user]);

  const openCustomerPortal = React.useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  }, [user]);

  // Single initialization effect to prevent loops
  React.useEffect(() => {
    if (initialized) return;
    
    console.log('Auth: Initializing auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth: State change event:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle user session changes
        if (session?.user) {
          setTimeout(async () => {
            const adminStatus = await checkAdminStatus();
            
            if (adminStatus) {
              setSubscriptionTier('premium');
              setIsPremium(true);
              setIsBeta(false);
              setSubscriptionEnd(null);
            } else {
              await checkSubscriptionStatus();
            }
          }, 0);
        } else {
          setIsAdmin(false);
          setSubscriptionTier('free');
          setIsPremium(false);
          setIsBeta(false);
          setSubscriptionEnd(null);
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
        setTimeout(async () => {
          const adminStatus = await checkAdminStatus();
          if (adminStatus) {
            setSubscriptionTier('premium');
            setIsPremium(true);
            setIsBeta(false);
            setSubscriptionEnd(null);
          } else {
            await checkSubscriptionStatus();
          }
        }, 0);
      }
    });

    setInitialized(true);

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized, checkAdminStatus, checkSubscriptionStatus]);

  const signUp = async (email: string, password: string, userData: UserData = {}) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const redirectUrl = `${window.location.origin}/auth/confirm`;
    
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
      }
    }
    
    return { data, error };
  };

  const resendEmailConfirmation = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth/confirm`;
    
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
    const { error } = await supabase.auth.admin.signOut(user?.id || '', 'global');
    if (error) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      isPremium,
      isBeta,
      subscriptionTier,
      subscriptionEnd,
      checkAdminStatus,
      refreshSubscription,
      createCheckout,
      openCustomerPortal,
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
