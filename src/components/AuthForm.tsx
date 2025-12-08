
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

export const AuthForm = ({ mode, onToggleMode }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signIn, resetPassword, resendEmailConfirmation } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, { name });
        if (error) throw error;
        setEmailSent(true);
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account before signing in.",
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email not verified",
              description: "Please check your email and click the verification link before signing in.",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
      setShowPasswordReset(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend confirmation.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await resendEmailConfirmation(email);
      if (error) throw error;
      
      toast({
        title: "Confirmation email sent",
        description: "Check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Input styling classes
  const inputClasses = "h-12 bg-muted border-border rounded-xl pl-10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200";
  const labelClasses = "text-sm font-medium text-foreground";

  if (emailSent && mode === 'signup') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-success" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to<br />
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Click the link in your email to verify your account, then return here to sign in.
          </p>
          
          <Button
            onClick={handleResendConfirmation}
            variant="outline"
            disabled={loading}
            className="w-full h-12 rounded-xl border-border hover:bg-muted transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend verification email'
            )}
          </Button>
          
          <Button
            onClick={() => {
              setEmailSent(false);
              onToggleMode();
            }}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Back to sign in
          </Button>
        </div>
      </motion.div>
    );
  }

  if (showPasswordReset) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPasswordReset(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Reset password</h2>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className={labelClasses}>
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className={inputClasses}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 btn-serene" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-foreground">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === 'signin' 
            ? 'Sign in to continue your journey' 
            : 'Start your personal growth journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name" className={labelClasses}>
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className={inputClasses}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className={labelClasses}>
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className={labelClasses}>
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className={`${inputClasses} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mode === 'signin' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-primary hover:text-primary/80 text-sm transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 btn-serene" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
            </>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </Button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full h-12 rounded-xl border-border hover:bg-muted transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
