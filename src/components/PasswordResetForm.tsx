import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react';

export const PasswordResetForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    const establishSession = async () => {
      // Tokens may arrive in the URL hash (#access_token=...&type=recovery)
      // or as query params (?access_token=...&type=recovery).
      const hash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(window.location.search);

      const errorDescription =
        hashParams.get('error_description') || queryParams.get('error_description');
      if (errorDescription) {
        if (!cancelled) setLinkError(errorDescription.replace(/\+/g, ' '));
        return;
      }

      const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
      const type = hashParams.get('type') || queryParams.get('type');

      if (type === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!cancelled) {
          if (error) {
            setLinkError('This reset link is invalid or has expired. Please request a new one.');
          } else {
            setSessionReady(true);
            // Clean the tokens out of the URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
        return;
      }

      // Fallback: maybe a recovery session was already established
      const { data } = await supabase.auth.getSession();
      if (!cancelled) {
        if (data.session) {
          setSessionReady(true);
        } else {
          setLinkError('This reset link is invalid or has expired. Please request a new one.');
        }
      }
    };

    establishSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: 'Please make sure both passwords are identical.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password.',
      });

      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Could not update password',
        description: error?.message || 'Please try again or request a new reset link.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (linkError) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Reset link unavailable</h2>
          <p className="text-sm text-muted-foreground">{linkError}</p>
        </div>
        <Button onClick={() => navigate('/auth')} className="w-full">
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6 space-y-3">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Set a new password</h2>
          <p className="text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-sm font-medium">
            New password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              disabled={!sessionReady}
              className="pl-10 pr-10 h-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm new password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              disabled={!sessionReady}
              className="pl-10 pr-10 h-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-12" disabled={loading || !sessionReady}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating password...
            </>
          ) : sessionReady ? (
            'Update password'
          ) : (
            'Verifying link...'
          )}
        </Button>
      </form>
    </div>
  );
};
