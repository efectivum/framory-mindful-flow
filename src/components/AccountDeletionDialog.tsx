
import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { DataExportDialog } from './DataExportDialog';

export const AccountDeletionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const { deleteAccount, isDeleting } = useAccountDeletion();

  const handleDelete = async () => {
    await deleteAccount(confirmationText);
    setIsOpen(false);
  };

  const isConfirmationValid = confirmationText === 'DELETE MY ACCOUNT';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive mobile-flex mobile-flex-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Delete Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="mobile-space-y-6">
          <div className="mobile-bg-error mobile-border-error mobile-rounded-lg mobile-p-4">
            <h3 className="mobile-text-error font-medium mobile-mb-2">⚠️ This action cannot be undone</h3>
            <ul className="mobile-text-error mobile-text-body mobile-space-y-1">
              <li>• All your journal entries will be permanently deleted</li>
              <li>• All your habits and tracking data will be lost</li>
              <li>• Your account preferences will be removed</li>
              <li>• You will lose access to all AI insights and analysis</li>
            </ul>
          </div>

          <div className="mobile-bg-accent mobile-border-accent mobile-rounded-lg mobile-p-4">
            <p className="mobile-text-accent mobile-text-body mobile-mb-3">
              Before deleting your account, consider exporting your data:
            </p>
            <DataExportDialog />
          </div>

          <div>
            <Label htmlFor="confirmation" className="mobile-text-primary font-medium">
              Type "DELETE MY ACCOUNT" to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="mobile-input"
            />
          </div>

          <div className="mobile-flex mobile-gap-3">
            <Button
              onClick={handleDelete}
              disabled={!isConfirmationValid || isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? (
                "Deleting Account..."
              ) : (
                <>
                  <Trash2 className="mobile-w-4 mobile-h-4 mobile-mr-2" />
                  Delete Account
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
