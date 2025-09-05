'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();

  const hasRole = (roleName: string): boolean => {
    return session?.user?.roles?.includes(roleName) || false;
  };

  const hasPermission = (permissionName: string): boolean => {
    return session?.user?.permissions?.includes(permissionName) || false;
  };

  const hasAnyRole = (roleNames: string[]): boolean => {
    return roleNames.some(role => hasRole(role));
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(permission => hasPermission(permission));
  };

  const isAdmin = (): boolean => {
    return session?.user?.isAdmin || false;
  };

  return {
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    isAdmin,
    roles: session?.user?.roles || [],
    permissions: session?.user?.permissions || [],
    user: session?.user
  };
}
