
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CompleteSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [pendingData, setPendingData] = useState<{
    name: string;
    phone_number: string;
    timezone: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "This signup link is invalid or missing.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    fetchPendingSignup();
  }, [token]);

  const fetchPendingSignup = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_signups')
        .select('*')
        .eq('token', token)
        .eq('completed', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (error || !data) {
        toast({
          title: "Invalid or Expired Link",
          description: "This signup link is invalid or has expired.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      setPendingData(data);
    } catch (error) {
      console.error('Error fetching pending signup:', error);
      toast({
        title: "Error",
        description: "Failed to load signup information.",
        variant: "destructive",
      });
      navigate('/auth');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pendingData) return;

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create the user account
      const { error } = await signUp(email, password, {
        name: pendingData.name,
        phone_number: pendingData.phone_number,
        timezone: pendingData.timezone,
      });

      if (error) throw error;

      // Mark signup as completed using edge function call
      // Since RLS now restricts updates to service role only
      const { error: completeError } = await supabase.functions.invoke('whatsapp-signup', {
        body: {
          action: 'complete',
          token: token
        }
      });

      if (completeError) {
        console.error('Error completing signup:', completeError);
        // Don't throw here as the user was created successfully
      }

      toast({
        title: "Account Created!",
        description: "Your account has been created successfully. Please check your email to verify your account.",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pendingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Complete Your Signup</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {pendingData.name}! Please set your password to complete your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Phone:</strong> {pendingData.phone_number}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Signup'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSignup;
