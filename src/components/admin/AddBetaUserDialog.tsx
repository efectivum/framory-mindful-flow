
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail, Users } from 'lucide-react';

interface AddBetaUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

export const AddBetaUserDialog: React.FC<AddBetaUserDialogProps> = ({
  open,
  onOpenChange,
  onUserAdded
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'single' && !email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'bulk' && !bulkEmails.trim()) {
      toast({
        title: "Error",
        description: "Please enter email addresses",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const emailsToAdd = mode === 'single' 
        ? [email.trim()]
        : bulkEmails.split('\n').map(e => e.trim()).filter(e => e);

      const results = [];
      
      for (const emailAddress of emailsToAdd) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
          results.push({ email: emailAddress, success: false, error: 'Invalid email format' });
          continue;
        }

        try {
          // Check if user already exists
          const { data: existing } = await supabase
            .from('subscribers')
            .select('*')
            .eq('email', emailAddress)
            .single();

          if (existing) {
            if (existing.subscription_tier === 'beta') {
              results.push({ email: emailAddress, success: false, error: 'Already a beta user' });
              continue;
            } else {
              // Update existing user to beta
              const { error: updateError } = await supabase
                .from('subscribers')
                .update({ 
                  subscription_tier: 'beta',
                  updated_at: new Date().toISOString()
                })
                .eq('email', emailAddress);

              if (updateError) {
                results.push({ email: emailAddress, success: false, error: updateError.message });
                continue;
              }
            }
          } else {
            // Create new beta user
            const { error: insertError } = await supabase
              .from('subscribers')
              .insert({
                email: emailAddress,
                subscription_tier: 'beta',
                subscribed: false,
                user_id: null
              });

            if (insertError) {
              results.push({ email: emailAddress, success: false, error: insertError.message });
              continue;
            }
          }

          // Log admin action
          await supabase
            .from('admin_audit_log')
            .insert({
              admin_user_id: user?.id,
              action: 'add_beta_user',
              target_user_email: emailAddress,
              details: { mode }
            });

          results.push({ email: emailAddress, success: true });
        } catch (error) {
          results.push({ 
            email: emailAddress, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      if (successful > 0) {
        toast({
          title: "Success",
          description: `Added ${successful} beta user${successful === 1 ? '' : 's'}${failed > 0 ? `, ${failed} failed` : ''}`,
        });
        
        // Reset form
        setEmail('');
        setBulkEmails('');
        onUserAdded();
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: `Failed to add beta users. ${results[0]?.error || 'Unknown error'}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error adding beta users:', error);
      toast({
        title: "Error",
        description: "Failed to add beta users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Add Beta Users
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'single' ? 'default' : 'outline'}
              onClick={() => setMode('single')}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Single Email
            </Button>
            <Button
              type="button"
              variant={mode === 'bulk' ? 'default' : 'outline'}
              onClick={() => setMode('bulk')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Bulk Add
            </Button>
          </div>

          {mode === 'single' ? (
            <div>
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="bulkEmails" className="text-white">
                Email Addresses (one per line)
              </Label>
              <Textarea
                id="bulkEmails"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com"
                className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter one email address per line
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                `Add Beta User${mode === 'bulk' ? 's' : ''}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
