import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignAdminRole() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    console.log('Usage: node scripts/assign-admin-role.mjs <email>');
    process.exit(1);
  }

  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Find the admin role
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' }
    });

    if (!adminRole) {
      console.error('Admin role not found. Please run the seed script first.');
      process.exit(1);
    }

    // Check if user already has admin role
    const existingAssignment = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id
        }
      }
    });

    if (existingAssignment) {
      if (existingAssignment.isActive) {
        console.log(`User ${email} already has admin role`);
      } else {
        // Reactivate the role
        await prisma.userRole.update({
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: adminRole.id
            }
          },
          data: { isActive: true }
        });
        console.log(`Admin role reactivated for user ${email}`);
      }
    } else {
      // Create new assignment
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
          isActive: true
        }
      });
      console.log(`Admin role assigned to user ${email}`);
    }

  } catch (error) {
    console.error('Error assigning admin role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignAdminRole();
