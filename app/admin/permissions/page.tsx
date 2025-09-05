import { AdminLayout } from '@/components/admin/admin-layout';
import { PermissionsManagement } from '@/components/admin/permissions-management';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export default function PermissionsPage() {
  return (
    <AdminLayout>
      <ErrorBoundary>
        <PermissionsManagement />
      </ErrorBoundary>
    </AdminLayout>
  );
}
