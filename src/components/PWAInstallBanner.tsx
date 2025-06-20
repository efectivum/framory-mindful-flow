
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Share, Plus, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallBanner: React.FC = () => {
  const { 
    showInstallPrompt, 
    isIOS, 
    canShowInstallPrompt,
    promptInstall,
    dismissInstallPrompt 
  } = usePWA();

  if (!canShowInstallPrompt || (!showInstallPrompt && !isIOS)) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      // For iOS, we can't programmatically install, so show instructions
      return;
    } else {
      // For Chrome/Edge, use the install prompt
      await promptInstall();
    }
  };

  return (
    <Card className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm bg-gradient-to-r from-blue-600/90 to-purple-600/90 border-blue-500/30 backdrop-blur-sm z-40 animate-slide-in-up">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm mb-1">
              Install Mindful Flow
            </h3>
            
            {isIOS ? (
              <div className="space-y-2">
                <p className="text-blue-100 text-xs leading-relaxed">
                  Add to your home screen for the best experience
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-100">
                  <span>Tap</span>
                  <Share className="w-4 h-4" />
                  <span>then</span>
                  <Plus className="w-4 h-4" />
                  <span>"Add to Home Screen"</span>
                </div>
              </div>
            ) : (
              <p className="text-blue-100 text-xs leading-relaxed mb-3">
                Get offline access, push notifications, and a native app experience
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-3">
              {!isIOS && (
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs px-3 py-1.5 h-auto"
                >
                  Install
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallPrompt}
                className="text-blue-100 hover:bg-white/10 text-xs px-2 py-1.5 h-auto"
              >
                Later
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissInstallPrompt}
            className="text-blue-200 hover:bg-white/10 p-1 h-auto shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
