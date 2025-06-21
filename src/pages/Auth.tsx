
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { Calendar } from 'lucide-react';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [searchParams] = useSearchParams();

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  // Check if this is a password reset flow
  const isPasswordReset = searchParams.get('type') === 'recovery' || searchParams.get('reset') === 'true';

  useEffect(() => {
    // Handle email confirmation redirect
    const type = searchParams.get('type');
    if (type === 'signup') {
      setMode('signin');
    }
  }, [searchParams]);

  if (isPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <PasswordResetForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-600/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Auth Container */}
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
          <AuthForm mode={mode} onToggleMode={toggleMode} />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Secure authentication powered by Supabase
        </div>
      </div>
    </div>
  );
};

export default Auth;
