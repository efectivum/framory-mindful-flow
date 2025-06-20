
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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

  if (emailSent && mode === 'signup') {
    return (
      <div className="w-full max-w-md mx-auto text-center space-y-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a verification link to {email}
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Click the link in your email to verify your account, then return here to sign in.
          </p>
          
          <Button
            onClick={handleResendConfirmation}
            variant="outline"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Resend verification email'}
          </Button>
          
          <Button
            onClick={() => {
              setEmailSent(false);
              onToggleMode();
            }}
            variant="ghost"
            className="w-full"
          >
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowPasswordReset(false)}
              className="text-blue-600 hover:underline text-sm"
            >
              Back to sign in
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'signin' 
              ? 'Sign in to continue your journey' 
              : 'Start your personal growth journey'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
          />
        </div>

        {mode === 'signin' && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-blue-600 hover:underline text-sm"
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
