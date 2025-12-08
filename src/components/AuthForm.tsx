
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
          title: "Account created! ✨",
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
          title: "Welcome back! 🎉",
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
        title: "Password reset email sent ✉️",
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
        title: "Confirmation email sent ✉️",
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

  if (emailSent && mode === 'signup') {
    return (
      <div className="mobile-center mobile-flow-lg">
        <div className="mobile-w-16 mobile-h-16 mobile-bg-success/20 mobile-rounded-full mobile-flex mobile-flex-center mobile-mx-auto mobile-mb-md">
          <Mail className="mobile-w-8 mobile-h-8 mobile-text-success" />
        </div>
        
        <div className="mobile-flow-tight mobile-text-center">
          <h2 className="mobile-h2 mobile-text-primary">Check your email</h2>
          <p className="mobile-text-sm mobile-text-muted">
            We've sent a verification link to<br />
            <span className="mobile-text-primary font-medium">{email}</span>
          </p>
        </div>
        
        <div className="mobile-flow-md">
          <p className="mobile-text-xs mobile-text-muted">
            Click the link in your email to verify your account, then return here to sign in.
          </p>
          
          <Button
            onClick={handleResendConfirmation}
            variant="outline"
            disabled={loading}
            className="mobile-w-full mobile-button"
          >
            {loading ? (
              <>
                <Loader2 className="mobile-w-4 mobile-h-4 mobile-mr-sm animate-spin" />
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
            className="mobile-w-full mobile-text-muted mobile-touchable"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="mobile-flow-lg">
        <div className="flex items-center gap-3 mobile-mb-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswordReset(false)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="mobile-h2 mobile-text-primary">Reset password</h2>
            <p className="mobile-text-sm mobile-text-muted">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordReset} className="mobile-flow-md">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-foreground text-sm font-medium">
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
                className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="mobile-w-full mobile-button" 
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
      </div>
    );
  }

  return (
    <div className="mobile-flow-lg">
      <div className="mobile-text-center mobile-flow-tight">
        <h2 className="mobile-h2 mobile-text-primary">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="mobile-text-sm mobile-text-muted">
          {mode === 'signin' 
            ? 'Sign in to continue your journey' 
            : 'Start your personal growth journey'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mobile-flow-md">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground text-sm font-medium">
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
                className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground text-sm font-medium">
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
              className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground text-sm font-medium">
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
              className="pl-10 pr-10 bg-muted border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
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
          className="mobile-w-full mobile-button" 
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or continue with</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mobile-w-full h-12 rounded-xl border-border hover:bg-muted transition-all duration-200"
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

        <div className="text-center">
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
    </div>
  );
};
