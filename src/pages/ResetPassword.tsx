import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { PasswordResetForm } from '@/components/PasswordResetForm';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Lumatori</h1>
            <p className="text-muted-foreground text-sm">Reset your password</p>
          </div>
        </div>

        <div className="card-serene p-8">
          <PasswordResetForm />
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
