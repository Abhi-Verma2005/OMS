import { prisma } from './db';
import { auth } from './auth';

export interface UserWithRoles {
  id: string;
  name: string | null;
  email: string;
  userRoles: Array<{
    id: string;
    isActive: boolean;
    role: {
      id: string;
      name: string;
      displayName: string;
      isActive: boolean;
      rolePermissions: Array<{
        permission: {
          id: string;
          name: string;
          displayName: string;
          resource: string;
          action: string;
        };
      }>;
    };
  }>;
}

/**
 * Check if a user has admin role
 */
export async function requireAdminRole(userId: string): Promise<UserWithRoles> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        },
        where: { isActive: true }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const hasAdminRole = user.userRoles.some(ur => 
    ur.role.name === 'admin' && ur.role.isActive
  );

  if (!hasAdminRole) {
    throw new Error('Access denied: Admin role required');
  }
  
  return user as UserWithRoles;
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: { isActive: true },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user || !user.userRoles) return false;

  // Check if user has admin role (admins have all permissions)
  const hasAdminRole = user.userRoles.some((ur: any) => 
    ur.role.name === 'admin' && ur.role.isActive
  );

  if (hasAdminRole) return true;

  // Check for specific permission
  const hasPermission = user.userRoles.some((ur: any) =>
    ur.role.rolePermissions.some((rp: any) =>
      rp.permission.name === permissionName
    )
  );

  return hasPermission;
}

/**
 * Get all permissions for a user (flattened)
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        where: { isActive: true },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!user || !user.userRoles) return [];

  // Check if user has admin role
  const hasAdminRole = user.userRoles.some((ur: any) => 
    ur.role.name === 'admin' && ur.role.isActive
  );

  if (hasAdminRole) {
    // Return all permissions for admin
    const allPermissions = await prisma.permission.findMany({
      select: { name: true }
    });
    return allPermissions.map(p => p.name);
  }

  // Get unique permissions from user's roles
  const permissions = new Set<string>();
  user.userRoles.forEach((ur: any) => {
    ur.role.rolePermissions.forEach((rp: any) => {
      permissions.add(rp.permission.name);
    });
  });

  return Array.from(permissions);
}

/**
 * Get user with all roles and permissions
 */
export async function getUserWithRoles(userId: string): Promise<UserWithRoles | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        },
        where: { isActive: true }
      }
    }
  });

  return user as UserWithRoles | null;
}

/**
 * Check if current session user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    return session?.user?.isAdmin || false;
  } catch {
    return false;
  }
}

/**
 * Middleware helper for API routes
 */
export async function requireAdminForAPI(): Promise<UserWithRoles> {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Authentication required');
  }

  if (!session.user.isAdmin) {
    throw new Error('Access denied: Admin role required');
  }

  // Return user with roles for API operations
  return await getUserWithRoles(session.user.id) as UserWithRoles;
}

/**
 * Get roles with user counts
 */
export async function getRolesWithCounts() {
  return await prisma.role.findMany({
    include: {
      _count: {
        select: {
          userRoles: { where: { isActive: true } },
          rolePermissions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get permissions with role counts
 */
export async function getPermissionsWithCounts() {
  return await prisma.permission.findMany({
    include: {
      _count: {
        select: {
          rolePermissions: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Get users with their roles
 */
export async function getUsersWithRoles() {
  return await prisma.user.findMany({
    include: {
      userRoles: {
        where: { isActive: true },
        include: {
          role: true
        }
      },
      _count: {
        select: {
          userRoles: { where: { isActive: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}
