import { AdminLayout } from '@/components/admin/admin-layout';
import { RolesManagement } from '@/components/admin/roles-management';

export default function RolesPage() {
  return (
    <AdminLayout>
      <RolesManagement />
    </AdminLayout>
  );
}
