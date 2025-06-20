
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { PasswordResetForm } from '@/components/PasswordResetForm';

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
    return <PasswordResetForm />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  );
};

export default Auth;
