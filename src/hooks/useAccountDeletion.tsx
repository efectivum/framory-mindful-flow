
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useAccountDeletion = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const deleteAccount = async (confirmationText: string) => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { confirmation_text: confirmationText }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted.",
      });

      // Sign out after successful deletion
      await signOut();

    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "There was an error deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteAccount,
    isDeleting,
  };
};
