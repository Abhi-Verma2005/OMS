import { AdminLayout } from '@/components/admin/admin-layout';
import { UserRolesManagement } from '@/components/admin/user-roles-management';

export default function UserRolesPage() {
  return (
    <AdminLayout>
      <UserRolesManagement />
    </AdminLayout>
  );
}
