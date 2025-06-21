
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatSessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSwitchSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export const ChatSessionSidebar: React.FC<ChatSessionSidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSwitchSession,
  onNewChat,
}) => {
  const handleSessionClick = (sessionId: string) => {
    onSwitchSession(sessionId);
    onClose();
  };

  const handleNewChat = () => {
    onNewChat();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-[#1a1f2e] border-gray-700">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat Sessions
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <Button
            onClick={handleNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No chat sessions yet</p>
                  <p className="text-sm">Start a new conversation!</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm truncate">
                          {session.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      {currentSessionId === session.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
