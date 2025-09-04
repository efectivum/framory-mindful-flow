
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswordReset(false)}
            className="text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-xl p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-white">Reset password</h2>
            <p className="text-gray-400 text-sm">
              Enter your email to receive a reset link
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-300 text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="pl-10 bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-500 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl h-12 shadow-lg transition-all duration-200 hover:shadow-xl" 
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
            <Label htmlFor="name" className="text-gray-300 text-sm font-medium">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="pl-10 bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-500 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="pl-10 bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-500 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              className="pl-10 pr-10 bg-gray-700/50 border-gray-600/50 text-gray-200 placeholder-gray-500 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl h-12 shadow-lg transition-all duration-200 hover:shadow-xl" 
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

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-gray-400 hover:text-white text-sm transition-colors"
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
