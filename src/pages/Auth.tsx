
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          <div className="card-serene p-8">
            <PasswordResetForm />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md space-y-8"
      >
        {/* Logo & Branding */}
        <div className="text-center space-y-4">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Lumatori
            </h1>
            <p className="text-muted-foreground text-sm">
              Your personal growth companion
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card-serene p-8"
        >
          <AuthForm mode={mode} onToggleMode={toggleMode} />
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Secure authentication powered by Supabase
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
