
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'menu' | 'notifications';
}

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, type }) => {
  const { signOut } = useAuth();

  const menuItems = [
    { icon: User, label: 'Profile', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: Moon, label: 'Dark Mode', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: signOut },
  ];

  const notifications = [
    { id: 1, title: 'Daily Reminder', message: 'Time for your evening reflection', time: '2 hours ago' },
    { id: 2, title: 'Goal Achievement', message: 'You completed your meditation streak!', time: '1 day ago' },
    { id: 3, title: 'Weekly Insights', message: 'Your personal growth report is ready', time: '3 days ago' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: type === 'menu' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: type === 'menu' ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className={`fixed top-0 ${type === 'menu' ? 'left-0' : 'right-0'} h-full w-80 max-w-[85vw] bg-gray-800 z-50 shadow-xl`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-white font-semibold text-lg">
                  {type === 'menu' ? 'Menu' : 'Notifications'}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {type === 'menu' ? (
                  <div className="space-y-2">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            onClose();
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                      >
                        <h3 className="text-white font-medium text-sm">{notification.title}</h3>
                        <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                        <span className="text-gray-400 text-xs mt-2 block">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
