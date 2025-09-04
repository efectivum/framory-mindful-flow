
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/AuthForm';
import { PasswordResetForm } from '@/components/PasswordResetForm';
import { Calendar } from 'lucide-react';
import { MobilePage, MobileContent } from '@/components/layouts/MobileLayout';
import { MobileCard } from '@/components/ui/MobileCard';

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
      <MobilePage>
        <MobileContent padded>
          <div className="mobile-center">
            <PasswordResetForm />
          </div>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileContent padded>
        <div className="mobile-center mobile-stack-center">
          {/* App Icon */}
          <div className="mobile-section">
            <div className="mobile-h1" style={{ background: 'var(--app-gradient-primary)', borderRadius: 'var(--app-radius-lg)' }}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="mobile-h1">
              Lumatori
            </h1>
            <p className="mobile-body-sm" style={{ color: 'var(--app-text-muted)' }}>
              Your personal growth companion
            </p>
          </div>

          {/* Auth Card */}
          <MobileCard variant="spacious" className="mobile-w-full max-w-md">
            <AuthForm mode={mode} onToggleMode={toggleMode} />
          </MobileCard>

          {/* Footer */}
          <p className="mobile-caption" style={{ color: 'var(--app-text-muted)' }}>
            Secure authentication powered by Supabase
          </p>
        </div>
      </MobileContent>
    </MobilePage>
  );
};

export default Auth;
