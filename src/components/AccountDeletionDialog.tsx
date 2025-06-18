
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
          <DialogTitle className="text-red-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Delete Account
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <h3 className="text-red-300 font-medium mb-2">⚠️ This action cannot be undone</h3>
            <ul className="text-red-300 text-sm space-y-1">
              <li>• All your journal entries will be permanently deleted</li>
              <li>• All your habits and tracking data will be lost</li>
              <li>• Your account preferences will be removed</li>
              <li>• You will lose access to all AI insights and analysis</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <p className="text-blue-300 text-sm mb-3">
              Before deleting your account, consider exporting your data:
            </p>
            <DataExportDialog />
          </div>

          <div>
            <Label htmlFor="confirmation" className="text-white font-medium">
              Type "DELETE MY ACCOUNT" to confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              className="mt-2 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="flex gap-3">
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
                  <Trash2 className="w-4 h-4 mr-2" />
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
