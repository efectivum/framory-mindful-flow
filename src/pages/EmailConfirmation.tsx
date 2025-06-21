
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleConfirmation = async () => {
      // Check if user is already authenticated
      if (user) {
        setStatus('success');
        setMessage('Your email has been confirmed successfully!');
        // Redirect to main app after a short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
        return;
      }

      // Check for confirmation tokens in URL
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (type === 'signup' || type === 'email_change' || token) {
        // The Supabase auth state change should handle the actual confirmation
        // We just need to wait for the user state to update
        setStatus('success');
        setMessage('Your email has been confirmed! Redirecting to the app...');
        
        // Redirect after a delay to allow auth state to settle
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Invalid confirmation link. Please try signing in manually.');
      }
    };

    handleConfirmation();
  }, [user, searchParams, navigate]);

  const handleSignInRedirect = () => {
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Confirmation Container */}
      <div className="relative w-full max-w-md">
        {/* App Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-light text-white tracking-tight">
            Lumatori
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Your personal growth companion
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8">
          <div className="text-center space-y-6">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Confirming your email</h2>
                  <p className="text-gray-400 text-sm">
                    Please wait while we verify your email address...
                  </p>
                </div>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Email confirmed!</h2>
                  <p className="text-gray-400 text-sm">
                    {message}
                  </p>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse w-full"></div>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Confirmation failed</h2>
                  <p className="text-gray-400 text-sm">
                    {message}
                  </p>
                </div>
                <Button
                  onClick={handleSignInRedirect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl h-12"
                >
                  Go to Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Secure authentication powered by Supabase
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
