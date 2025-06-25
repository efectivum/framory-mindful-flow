
import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BetaUserManagement } from '@/components/BetaUserManagement';

export default function AdminUsers() {
  return (
    <AdminLayout 
      title="User Management" 
      subtitle="Manage beta users, subscriptions, and user accounts"
    >
      <BetaUserManagement />
    </AdminLayout>
  );
}
