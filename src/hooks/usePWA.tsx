
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  showInstallPrompt: boolean;
  canShowInstallPrompt: boolean;
}

export const usePWA = () => {
  const { toast } = useToast();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    isIOS: false,
    showInstallPrompt: false,
    canShowInstallPrompt: false,
  });

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    const isInstalled = isStandalone;

    // Check if app is running as PWA
    const updatePWAState = () => {
      setPwaState(prev => ({
        ...prev,
        isIOS,
        isStandalone,
        isInstalled,
        showInstallPrompt: isIOS && !isInstalled && !localStorage.getItem('pwa-install-dismissed'),
        canShowInstallPrompt: !isInstalled,
      }));
    };

    updatePWAState();

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const beforeInstallEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(beforeInstallEvent);
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        canShowInstallPrompt: true,
      }));

      console.log('PWA install prompt available');
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setDeferredPrompt(null);
      
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        showInstallPrompt: false,
        canShowInstallPrompt: false,
      }));

      toast({
        title: "App Installed!",
        description: "Mindful Flow is now installed on your device.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User ${outcome} the install prompt`);
      
      if (outcome === 'accepted') {
        toast({
          title: "Installing...",
          description: "The app is being installed on your device.",
        });
      }

      setDeferredPrompt(null);
      setPwaState(prev => ({
        ...prev,
        isInstallable: false,
        canShowInstallPrompt: false,
      }));

      return outcome === 'accepted';
    } catch (error) {
      console.error('Install prompt failed:', error);
      return false;
    }
  };

  const dismissInstallPrompt = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: false,
    }));
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive",
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast({
        title: "Notifications Blocked",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive reminders and updates.",
        });
        return true;
      } else {
        toast({
          title: "Notifications Disabled",
          description: "You won't receive push notifications.",
        });
        return false;
      }
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  };

  const registerForPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push messaging not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          // You'll need to replace this with your actual VAPID public key
          'BPBj-kGLDkU5kSxW3J8H-LJ8H5T5XbF4-Jy4xF5PJ8H3J4T5'
        ),
      });

      console.log('Push subscription created:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  };

  return {
    ...pwaState,
    promptInstall,
    dismissInstallPrompt,
    requestNotificationPermission,
    registerForPushNotifications,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
