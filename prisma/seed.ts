import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultRoles = [
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    isActive: true
  },
  {
    name: 'user',
    displayName: 'Regular User',
    description: 'Standard user access with basic permissions',
    isSystem: true,
    isActive: true
  },
  {
    name: 'moderator',
    displayName: 'Moderator',
    description: 'Content moderation and user management permissions',
    isSystem: false,
    isActive: true
  },
  {
    name: 'editor',
    displayName: 'Editor',
    description: 'Content creation and editing permissions',
    isSystem: false,
    isActive: true
  }
];

const defaultPermissions = [
  // Admin permissions
  {
    name: 'admin.dashboard.view',
    displayName: 'View Admin Dashboard',
    description: 'Access to the admin dashboard',
    resource: 'admin',
    action: 'view',
    isSystem: true
  },
  {
    name: 'admin.users.manage',
    displayName: 'Manage Users',
    description: 'Create, read, update, and delete users',
    resource: 'admin',
    action: 'users.manage',
    isSystem: true
  },
  {
    name: 'admin.roles.manage',
    displayName: 'Manage Roles',
    description: 'Create, read, update, and delete roles',
    resource: 'admin',
    action: 'roles.manage',
    isSystem: true
  },
  {
    name: 'admin.permissions.manage',
    displayName: 'Manage Permissions',
    description: 'Create, read, update, and delete permissions',
    resource: 'admin',
    action: 'permissions.manage',
    isSystem: true
  },
  {
    name: 'admin.system.settings',
    displayName: 'System Settings',
    description: 'Access to system configuration and settings',
    resource: 'admin',
    action: 'system.settings',
    isSystem: true
  },
  {
    name: 'admin.audit.view',
    displayName: 'View Audit Logs',
    description: 'Access to system audit logs and activity history',
    resource: 'admin',
    action: 'audit.view',
    isSystem: true
  },

  // User permissions
  {
    name: 'user.profile.view',
    displayName: 'View Profile',
    description: 'View own user profile',
    resource: 'user',
    action: 'profile.view',
    isSystem: true
  },
  {
    name: 'user.profile.update',
    displayName: 'Update Profile',
    description: 'Update own user profile information',
    resource: 'user',
    action: 'profile.update',
    isSystem: true
  },
  {
    name: 'user.dashboard.view',
    displayName: 'View Dashboard',
    description: 'Access to user dashboard',
    resource: 'user',
    action: 'dashboard.view',
    isSystem: true
  },

  // Content permissions
  {
    name: 'content.create',
    displayName: 'Create Content',
    description: 'Create new content items',
    resource: 'content',
    action: 'create',
    isSystem: false
  },
  {
    name: 'content.read',
    displayName: 'Read Content',
    description: 'View and read content items',
    resource: 'content',
    action: 'read',
    isSystem: false
  },
  {
    name: 'content.update',
    displayName: 'Update Content',
    description: 'Edit and update content items',
    resource: 'content',
    action: 'update',
    isSystem: false
  },
  {
    name: 'content.delete',
    displayName: 'Delete Content',
    description: 'Delete content items',
    resource: 'content',
    action: 'delete',
    isSystem: false
  },

  // Moderation permissions
  {
    name: 'moderation.content.moderate',
    displayName: 'Moderate Content',
    description: 'Review and moderate content for approval',
    resource: 'moderation',
    action: 'content.moderate',
    isSystem: false
  },
  {
    name: 'moderation.users.moderate',
    displayName: 'Moderate Users',
    description: 'Manage user accounts and permissions',
    resource: 'moderation',
    action: 'users.moderate',
    isSystem: false
  },
  {
    name: 'moderation.reports.view',
    displayName: 'View Reports',
    description: 'View user reports and flagged content',
    resource: 'moderation',
    action: 'reports.view',
    isSystem: false
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create roles
  console.log('📝 Creating roles...');
  for (const roleData of defaultRoles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: roleData,
      create: roleData
    });
  }

  // Create permissions
  console.log('🔐 Creating permissions...');
  for (const permissionData of defaultPermissions) {
    await prisma.permission.upsert({
      where: { name: permissionData.name },
      update: permissionData,
      create: permissionData
    });
  }

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');
  
  // Admin role gets all permissions
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  const allPermissions = await prisma.permission.findMany();
  
  if (adminRole) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // User role gets basic permissions
  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  const userPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'user.profile.view',
          'user.profile.update',
          'user.dashboard.view',
          'content.read'
        ]
      }
    }
  });

  if (userRole) {
    for (const permission of userPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // Moderator role gets moderation permissions
  const moderatorRole = await prisma.role.findUnique({ where: { name: 'moderator' } });
  const moderatorPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'user.profile.view',
          'user.profile.update',
          'user.dashboard.view',
          'content.read',
          'moderation.content.moderate',
          'moderation.users.moderate',
          'moderation.reports.view'
        ]
      }
    }
  });

  if (moderatorRole) {
    for (const permission of moderatorPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: moderatorRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: moderatorRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  // Editor role gets content permissions
  const editorRole = await prisma.role.findUnique({ where: { name: 'editor' } });
  const editorPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          'user.profile.view',
          'user.profile.update',
          'user.dashboard.view',
          'content.create',
          'content.read',
          'content.update',
          'content.delete'
        ]
      }
    }
  });

  if (editorRole) {
    for (const permission of editorPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: permission.id
          }
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: permission.id
        }
      });
    }
  }

  console.log('✅ Database seed completed successfully!');
  console.log(`📊 Created ${defaultRoles.length} roles and ${defaultPermissions.length} permissions`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
