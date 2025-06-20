
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface OfflineEntry {
  id: string;
  type: 'journal' | 'habit_completion';
  data: any;
  timestamp: number;
  synced: boolean;
}

const DB_NAME = 'MindfulFlowOffline';
const DB_VERSION = 1;
const STORE_NAME = 'pending_actions';

export const useOfflineStorage = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check and count update
    updatePendingCount();
    if (isOnline) {
      syncPendingData();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  };

  const addPendingAction = async (type: 'journal' | 'habit_completion', data: any): Promise<string> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const entry: OfflineEntry = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
        synced: false,
      };

      await new Promise((resolve, reject) => {
        const request = store.add(entry);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      console.log(`Added pending ${type} action:`, entry.id);
      await updatePendingCount();

      if (!isOnline) {
        toast({
          title: "Saved Offline",
          description: `Your ${type.replace('_', ' ')} will sync when you're back online.`,
        });
      }

      return entry.id;
    } catch (error) {
      console.error('Failed to save offline action:', error);
      throw error;
    }
  };

  const getPendingActions = async (type?: string): Promise<OfflineEntry[]> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const request = type 
          ? store.index('type').getAll(type)
          : store.getAll();

        request.onsuccess = () => {
          const results = request.result.filter((entry: OfflineEntry) => !entry.synced);
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to get pending actions:', error);
      return [];
    }
  };

  const markAsSynced = async (id: string): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      await new Promise((resolve, reject) => {
        const getRequest = store.get(id);
        getRequest.onsuccess = () => {
          const entry = getRequest.result;
          if (entry) {
            entry.synced = true;
            const putRequest = store.put(entry);
            putRequest.onsuccess = () => resolve(putRequest.result);
            putRequest.onerror = () => reject(putRequest.error);
          } else {
            resolve(undefined);
          }
        };
        getRequest.onerror = () => reject(getRequest.error);
      });

      await updatePendingCount();
    } catch (error) {
      console.error('Failed to mark action as synced:', error);
    }
  };

  const updatePendingCount = async (): Promise<void> => {
    try {
      const pending = await getPendingActions();
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Failed to update pending count:', error);
    }
  };

  const syncPendingData = async (): Promise<void> => {
    if (!isOnline) return;

    try {
      const pendingActions = await getPendingActions();
      
      if (pendingActions.length === 0) return;

      console.log(`Syncing ${pendingActions.length} pending actions...`);

      let syncedCount = 0;
      for (const action of pendingActions) {
        try {
          if (action.type === 'journal') {
            // Sync journal entry
            const response = await fetch('/api/journal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data),
            });

            if (response.ok) {
              await markAsSynced(action.id);
              syncedCount++;
            }
          } else if (action.type === 'habit_completion') {
            // Sync habit completion
            const response = await fetch('/api/habits/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(action.data),
            });

            if (response.ok) {
              await markAsSynced(action.id);
              syncedCount++;
            }
          }
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
        }
      }

      if (syncedCount > 0) {
        toast({
          title: "Data Synced",
          description: `Successfully synced ${syncedCount} offline ${syncedCount === 1 ? 'action' : 'actions'}.`,
        });
      }
    } catch (error) {
      console.error('Sync process failed:', error);
    }
  };

  const clearSyncedData = async (): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Get all synced entries
      const syncedEntries = await new Promise<OfflineEntry[]>((resolve, reject) => {
        const request = store.index('synced').getAll(true);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Delete synced entries older than 7 days
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      for (const entry of syncedEntries) {
        if (entry.timestamp < weekAgo) {
          store.delete(entry.id);
        }
      }

      await updatePendingCount();
    } catch (error) {
      console.error('Failed to clear synced data:', error);
    }
  };

  return {
    isOnline,
    pendingCount,
    addPendingAction,
    getPendingActions,
    syncPendingData,
    clearSyncedData,
  };
};
