
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Trash2, 
  Calendar, 
  Mail, 
  AlertTriangle,
  Loader2,
  Crown
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BetaBadge } from '@/components/BetaBadge';

interface BetaUser {
  id: string;
  email: string;
  user_id: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

interface BetaUsersListProps {
  users: BetaUser[];
  isLoading: boolean;
  onUserRemoved: () => void;
}

export const BetaUsersList: React.FC<BetaUsersListProps> = ({
  users,
  isLoading,
  onUserRemoved
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [userToRemove, setUserToRemove] = useState<BetaUser | null>(null);

  const handleRemoveBetaUser = async (betaUser: BetaUser) => {
    if (!betaUser) return;

    setRemovingUser(betaUser.id);

    try {
      // Update user to free tier
      const { error } = await supabase
        .from('subscribers')
        .update({ 
          subscription_tier: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('id', betaUser.id);

      if (error) throw error;

      // Log admin action
      await supabase
        .from('admin_audit_log')
        .insert({
          admin_user_id: user?.id,
          action: 'remove_beta_user',
          target_user_email: betaUser.email,
          details: { previous_tier: 'beta' }
        });

      toast({
        title: "Success",
        description: `Removed ${betaUser.email} from beta program`,
      });

      onUserRemoved();
    } catch (error) {
      console.error('Error removing beta user:', error);
      toast({
        title: "Error",
        description: "Failed to remove beta user",
        variant: "destructive",
      });
    } finally {
      setRemovingUser(null);
      setUserToRemove(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-400" />
          <p className="text-gray-400">Loading beta users...</p>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <Crown className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold text-white mb-2">No Beta Users Found</h3>
          <p className="text-gray-400">No beta users match your search criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Beta Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((betaUser) => (
              <div
                key={betaUser.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{betaUser.email}</span>
                    </div>
                    <BetaBadge />
                    {betaUser.user_id && (
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Active Account
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Added: {formatDate(betaUser.created_at)}
                    </div>
                    {betaUser.updated_at !== betaUser.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated: {formatDate(betaUser.updated_at)}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserToRemove(betaUser)}
                  disabled={removingUser === betaUser.id}
                  className="text-red-400 border-red-400 hover:bg-red-400/10"
                >
                  {removingUser === betaUser.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remove Beta User Confirmation Dialog */}
      <AlertDialog open={!!userToRemove} onOpenChange={() => setUserToRemove(null)}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <AlertDialogTitle className="text-white">Remove Beta User</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to remove <strong>{userToRemove?.email}</strong> from the beta program? 
              They will lose access to beta features immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToRemove && handleRemoveBetaUser(userToRemove)}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Beta Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
