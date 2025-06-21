import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  ScrollText, 
  Calendar, 
  User, 
  Plus, 
  Trash2,
  Loader2, 
  Mail 
} from 'lucide-react';

interface AuditLogEntry {
  id: string;
  admin_user_id: string;
  action: string;
  target_user_email: string | null;
  details: any;
  created_at: string;
}

export const AdminAuditLog: React.FC = React.memo(() => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuditLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading audit logs:', error);
        throw error;
      }
      
      console.log('Loaded audit logs:', data);
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
    
    // Set up real-time subscription for audit log updates
    const subscription = supabase
      .channel('admin_audit_log_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'admin_audit_log' 
        }, 
        (payload) => {
          console.log('New audit log entry:', payload);
          setAuditLogs(current => [payload.new as AuditLogEntry, ...current.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadAuditLogs]);

  const getActionIcon = useCallback((action: string) => {
    switch (action) {
      case 'add_beta_user':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'remove_beta_user':
        return <Trash2 className="w-4 h-4 text-red-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  }, []);

  const getActionLabel = useCallback((action: string) => {
    switch (action) {
      case 'add_beta_user':
        return 'Added Beta User';
      case 'remove_beta_user':
        return 'Removed Beta User';
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }, []);

  const getActionColor = useCallback((action: string) => {
    switch (action) {
      case 'add_beta_user':
        return 'border-green-400 text-green-400';
      case 'remove_beta_user':
        return 'border-red-400 text-red-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          Admin Activity Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-400" />
            <p className="text-gray-400">Loading audit logs...</p>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <ScrollText className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
            <p className="text-gray-400">Admin actions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div className="mt-1">
                  {getActionIcon(log.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={getActionColor(log.action)}
                    >
                      {getActionLabel(log.action)}
                    </Badge>
                    {log.target_user_email && (
                      <span className="text-gray-300 text-sm">
                        → {log.target_user_email}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(log.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Admin ID: {log.admin_user_id.slice(0, 8)}...
                    </div>
                  </div>
                  
                  {log.details && Object.keys(log.details).length > 0 && (
                    <div className="mt-2 text-xs">
                      {log.details.emailSent !== undefined && (
                        <div className={`flex items-center gap-1 ${log.details.emailSent ? 'text-green-400' : 'text-red-400'}`}>
                          <Mail className="w-3 h-3" />
                          Email: {log.details.emailSent ? 'Sent' : 'Failed'}
                          {log.details.emailError && (
                            <span className="text-red-400 ml-1">({log.details.emailError})</span>
                          )}
                        </div>
                      )}
                      {log.details.mode && (
                        <div className="text-gray-500 mt-1">
                          Mode: {log.details.mode}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

AdminAuditLog.displayName = 'AdminAuditLog';
