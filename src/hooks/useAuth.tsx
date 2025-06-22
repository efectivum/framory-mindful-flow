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

  const checkSubscriptionStatus = React.useCallback(async () => {
    if (!user?.email) {
      console.log('Auth: No user email, setting to free tier');
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
      return;
    }

    try {
      console.log('Auth: Checking subscription status for:', user.email);
      
      // Check database first for subscription info
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
        console.log('Auth: No subscription record found - user is free tier');
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
        return;
      }

      console.log('Auth: Subscriber data found:', {
        tier: subscriberData.subscription_tier,
        subscribed: subscriberData.subscribed,
        endDate: subscriberData.subscription_end
      });

      // Check for beta users FIRST - beta users get access regardless of subscription status
      if (subscriberData.subscription_tier === 'beta') {
        console.log('Auth: Beta user detected, granting beta access');
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
        console.log('Auth: Premium subscription active');
        setSubscriptionTier('premium');
        setIsPremium(true);
        setIsBeta(false);
        setSubscriptionEnd(subscriberData.subscription_end);
      } else {
        console.log('Auth: No active subscription, setting to free tier');
        setSubscriptionTier('free');
        setIsPremium(false);
        setIsBeta(false);
        setSubscriptionEnd(null);
      }
      
    } catch (error) {
      console.error('Auth: Error checking subscription:', error);
      // Default to free on any error
      setSubscriptionTier('free');
      setIsPremium(false);
      setIsBeta(false);
      setSubscriptionEnd(null);
    }
  }, [user?.email]);

  const refreshSubscription = React.useCallback(async () => {
    if (!user?.email) return;
    
    try {
      console.log('Auth: Refreshing subscription status');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      
      // Refresh subscription status from database after Stripe sync
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

  React.useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Check admin status and subscription when user signs in
        if (session?.user) {
          const adminStatus = await checkAdminStatus();
          
          // If admin, grant premium access immediately without DB check
          if (adminStatus) {
            console.log('Auth: Admin user detected, granting premium access');
            setSubscriptionTier('premium');
            setIsPremium(true);
            setIsBeta(false);
            setSubscriptionEnd(null);
          } else {
            // Check subscription status for non-admin users
            setTimeout(() => {
              checkSubscriptionStatus();
            }, 0);
          }
        } else {
          console.log('Auth: User logged out, resetting subscription state');
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
        checkAdminStatus().then(adminStatus => {
          if (adminStatus) {
            console.log('Auth: Existing admin session detected');
            setSubscriptionTier('premium');
            setIsPremium(true);
            setIsBeta(false);
            setSubscriptionEnd(null);
          } else {
            checkSubscriptionStatus();
          }
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [checkAdminStatus, checkSubscriptionStatus]);

  const signUp = async (email: string, password: string, userData: UserData = {}) => {
    // Automatically detect timezone
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
