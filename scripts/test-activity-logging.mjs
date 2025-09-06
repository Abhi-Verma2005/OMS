#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testActivityLogging() {
  console.log('🧪 Testing Activity Logging System...\n');

  try {
    // First, get a real user ID or create a test user
    console.log('1. Finding or creating test user...');
    let testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User'
        }
      });
      console.log('✅ Test user created:', testUser.id);
    } else {
      console.log('✅ Using existing test user:', testUser.id);
    }

    // Test 2: Create a test user activity
    console.log('\n2. Creating test user activity...');
    const testActivity = await prisma.userActivity.create({
      data: {
        userId: testUser.id,
        activity: 'TEST_ACTIVITY',
        category: 'OTHER',
        description: 'Test activity for verification',
        metadata: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString()
        }),
        ipAddress: '127.0.0.1',
        userAgent: 'Test Script'
      }
    });
    console.log('✅ Test activity created:', testActivity.id);

    // Test 3: Query activities
    console.log('\n3. Querying activities...');
    const activities = await prisma.userActivity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    console.log(`✅ Found ${activities.length} activities`);
    activities.forEach(activity => {
      console.log(`   - ${activity.activity} (${activity.category}) - ${activity.createdAt.toISOString()}`);
    });

    // Test 4: Test category filtering
    console.log('\n4. Testing category filtering...');
    const authActivities = await prisma.userActivity.findMany({
      where: { category: 'AUTHENTICATION' },
      take: 3
    });
    console.log(`✅ Found ${authActivities.length} authentication activities`);

    // Test 5: Test user-specific activities
    console.log('\n5. Testing user-specific activities...');
    const userActivities = await prisma.userActivity.findMany({
      where: { userId: testUser.id },
      take: 3
    });
    console.log(`✅ Found ${userActivities.length} activities for test user`);

    // Test 6: Test activity statistics
    console.log('\n6. Testing activity statistics...');
    const stats = await prisma.userActivity.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });
    console.log('✅ Activity statistics by category:');
    stats.forEach(stat => {
      console.log(`   - ${stat.category}: ${stat._count.category} activities`);
    });

    // Clean up test data
    console.log('\n7. Cleaning up test data...');
    await prisma.userActivity.deleteMany({
      where: { userId: testUser.id }
    });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Activity logging system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testActivityLogging();
