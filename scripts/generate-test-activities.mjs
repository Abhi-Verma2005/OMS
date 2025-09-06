#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateTestActivities() {
  console.log('🎭 Generating test activities for your user...\n');

  try {
    // Find your user account
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    console.log('Available users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name || 'No name'}) - ID: ${user.id}`);
    });

    // Use the first user (or you can modify this to use a specific user)
    const testUser = users[0];
    if (!testUser) {
      console.log('❌ No users found. Please create a user account first.');
      return;
    }

    console.log(`\n📝 Generating activities for: ${testUser.email}`);

    // Generate various test activities
    const testActivities = [
      {
        activity: 'DASHBOARD_VISITED',
        category: 'NAVIGATION',
        description: 'User visited the dashboard',
        metadata: { page: 'dashboard', timestamp: new Date().toISOString() }
      },
      {
        activity: 'BROWSE_PUBLISHERS',
        category: 'NAVIGATION',
        description: 'User browsed the publishers page',
        metadata: { page: 'data', filters: { category: 'all' } }
      },
      {
        activity: 'ITEM_ADDED_TO_CART',
        category: 'CART',
        description: 'Added "Tech News Site" to cart',
        metadata: { 
          siteId: 'tech-news-001', 
          siteName: 'Tech News Site', 
          price: 2999,
          category: 'Technology'
        }
      },
      {
        activity: 'ITEM_ADDED_TO_CART',
        category: 'CART',
        description: 'Added "Business Blog" to cart',
        metadata: { 
          siteId: 'business-blog-002', 
          siteName: 'Business Blog', 
          price: 1999,
          category: 'Business'
        }
      },
      {
        activity: 'CART_VIEWED',
        category: 'CART',
        description: 'User viewed their cart',
        metadata: { itemCount: 2, totalValue: 4998 }
      },
      {
        activity: 'ORDER_CREATED',
        category: 'ORDER',
        description: 'Order created with 2 items, total: $49.98',
        metadata: { 
          orderId: 'order_' + Date.now(),
          status: 'PAID',
          totalAmount: 4998,
          currency: 'USD',
          itemCount: 2
        }
      },
      {
        activity: 'PAYMENT_SUCCESS',
        category: 'PAYMENT',
        description: 'Payment processed successfully',
        metadata: { 
          amount: 4998,
          currency: 'USD',
          provider: 'stripe',
          reference: 'pi_' + Date.now()
        }
      },
      {
        activity: 'PROFILE_VIEWED',
        category: 'PROFILE',
        description: 'User viewed their profile page',
        metadata: { page: 'profile' }
      },
      {
        activity: 'SETTINGS_ACCESSED',
        category: 'PROFILE',
        description: 'User accessed account settings',
        metadata: { section: 'general' }
      },
      {
        activity: 'SEARCH_PERFORMED',
        category: 'NAVIGATION',
        description: 'User searched for "technology sites"',
        metadata: { 
          query: 'technology sites',
          results: 15,
          filters: { category: 'Technology' }
        }
      }
    ];

    // Create activities with some time spread
    for (let i = 0; i < testActivities.length; i++) {
      const activity = testActivities[i];
      const createdAt = new Date(Date.now() - (i * 5 * 60 * 1000)); // 5 minutes apart

      await prisma.userActivity.create({
        data: {
          userId: testUser.id,
          activity: activity.activity,
          category: activity.category,
          description: activity.description,
          metadata: JSON.stringify(activity.metadata),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          createdAt: createdAt
        }
      });

      console.log(`✅ Created: ${activity.activity}`);
    }

    console.log(`\n🎉 Generated ${testActivities.length} test activities for ${testUser.email}`);
    console.log('\nNow you can:');
    console.log('1. Go to /admin/activities to view all activities');
    console.log('2. Filter by category, search, or user');
    console.log('3. See the activity statistics');

  } catch (error) {
    console.error('❌ Error generating test activities:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateTestActivities();

