import { AdminLayout } from '@/components/admin/admin-layout';
import { UsersManagement } from '@/components/admin/users-management';

export default function UsersPage() {
  return (
    <AdminLayout>
      <UsersManagement />
    </AdminLayout>
  );
}
