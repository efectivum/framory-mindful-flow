
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit2, Plus, MessageSquare } from 'lucide-react';
import { useChatSessions, ChatSession } from '@/hooks/useChatSessions';
import { cn } from '@/lib/utils';

interface ChatSessionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSessionSidebar: React.FC<ChatSessionSidebarProps> = ({
  isOpen,
  onClose
}) => {
  const {
    sessions,
    currentSession,
    createSession,
    updateSessionTitle,
    deleteSession,
    setActiveSession
  } = useChatSessions();

  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateNew = async () => {
    const session = await createSession();
    if (session) {
      onClose();
    }
  };

  const handleSessionSelect = (session: ChatSession) => {
    setActiveSession(session);
    onClose();
  };

  const handleEditStart = (session: ChatSession) => {
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const handleEditSave = async (sessionId: string) => {
    if (editTitle.trim()) {
      await updateSessionTitle(sessionId, editTitle.trim());
    }
    setEditingSession(null);
    setEditTitle('');
  };

  const handleEditCancel = () => {
    setEditingSession(null);
    setEditTitle('');
  };

  const handleDelete = async (sessionId: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteSession(sessionId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="flex-1 bg-black/50" 
        onClick={onClose}
      />
      <div className="w-80 bg-[#1a2332] border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Conversations</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </Button>
          </div>
          <Button
            onClick={handleCreateNew}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={cn(
                  "group p-3 rounded-lg border cursor-pointer transition-colors",
                  currentSession?.id === session.id
                    ? "bg-blue-900/50 border-blue-600 text-blue-100"
                    : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0" onClick={() => handleSessionSelect(session)}>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      {editingSession === session.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleEditSave(session.id);
                            } else if (e.key === 'Escape') {
                              handleEditCancel();
                            }
                          }}
                          onBlur={() => handleEditSave(session.id)}
                          className="h-6 text-sm bg-gray-700 border-gray-600"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium truncate">{session.title}</span>
                      )}
                    </div>
                    <div className="text-xs opacity-70">
                      {new Date(session.last_message_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditStart(session);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(session.id);
                      }}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a new conversation to begin</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
