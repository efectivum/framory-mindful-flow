
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Trash2, Users, UserCheck } from 'lucide-react';
import { BetaBadge } from '@/components/BetaBadge';
import { AddBetaUserDialog } from '@/components/admin/AddBetaUserDialog';
import { BetaUsersList } from '@/components/admin/BetaUsersList';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';

interface BetaUser {
  id: string;
  email: string;
  user_id: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export const BetaUserManagement: React.FC = () => {
  const { toast } = useToast();
  const [betaUsers, setBetaUsers] = useState<BetaUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [stats, setStats] = useState({
    totalBeta: 0,
    activeBeta: 0,
    recentlyAdded: 0
  });

  useEffect(() => {
    loadBetaUsers();
  }, []);

  const loadBetaUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('subscription_tier', 'beta')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBetaUsers(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const recent = data?.filter(user => {
        const createdAt = new Date(user.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length || 0;

      setStats({
        totalBeta: total,
        activeBeta: total, // For now, all beta users are considered active
        recentlyAdded: recent
      });
    } catch (error) {
      console.error('Error loading beta users:', error);
      toast({
        title: "Error",
        description: "Failed to load beta users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = betaUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Beta User Management</h2>
          <BetaBadge />
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Beta User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Beta Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalBeta}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Beta Users</p>
                <p className="text-2xl font-bold text-white">{stats.activeBeta}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Added This Week</p>
                <p className="text-2xl font-bold text-white">{stats.recentlyAdded}</p>
              </div>
              <Plus className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search beta users by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Beta Users List */}
      <BetaUsersList 
        users={filteredUsers}
        isLoading={isLoading}
        onUserRemoved={loadBetaUsers}
      />

      {/* Admin Audit Log */}
      <AdminAuditLog />

      {/* Add Beta User Dialog */}
      <AddBetaUserDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onUserAdded={loadBetaUsers}
      />
    </div>
  );
};
