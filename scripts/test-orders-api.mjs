#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testOrdersAPI() {
  try {
    console.log('🧪 Testing Orders API and Database Connection...\n');

    // Test 1: Database Connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Test 2: Check if test user exists
    console.log('2. Checking for test user...');
    let testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('📝 Creating test user...');
      const hashedPassword = await bcrypt.hash('testpassword123', 12);
      
      testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: hashedPassword,
        }
      });
      console.log('✅ Test user created:', testUser.email);
    } else {
      console.log('👤 Test user exists:', testUser.email);
    }

    // Test 3: Check existing orders
    console.log('\n3. Checking existing orders...');
    const existingOrders = await prisma.order.findMany({
      where: { userId: testUser.id },
      include: {
        items: true,
        transactions: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📦 Found ${existingOrders.length} existing orders`);

    if (existingOrders.length === 0) {
      console.log('\n4. Creating sample orders...');
      
      // Create a sample order
      const order = await prisma.order.create({
        data: {
          userId: testUser.id,
          status: 'PAID',
          totalAmount: 4999, // $49.99
          currency: 'USD',
          items: {
            create: [
              {
                siteId: 'site_001',
                siteName: 'TechCrunch',
                priceCents: 2999,
                quantity: 1,
                withContent: true,
              },
              {
                siteId: 'site_002',
                siteName: 'Wired',
                priceCents: 1999,
                quantity: 1,
                withContent: false,
              }
            ]
          }
        },
        include: {
          items: true
        }
      });

      // Create a successful transaction
      await prisma.transaction.create({
        data: {
          orderId: order.id,
          amount: order.totalAmount,
          currency: order.currency,
          status: 'SUCCESS',
          provider: 'stripe',
          reference: 'txn_' + Math.random().toString(36).substr(2, 9),
        }
      });

      console.log('✅ Sample order created:', order.id);
    }

    // Test 4: Test the exact query used by the API
    console.log('\n5. Testing API query...');
    const orders = await prisma.order.findMany({
      where: {
        userId: testUser.id,
      },
      include: {
        items: true,
        transactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📦 API query returned ${orders.length} orders`);
    
    if (orders.length > 0) {
      console.log('\n📋 Sample order data:');
      const sampleOrder = orders[0];
      console.log('  Order ID:', sampleOrder.id);
      console.log('  Status:', sampleOrder.status);
      console.log('  Total Amount:', sampleOrder.totalAmount);
      console.log('  Items:', sampleOrder.items.length);
      console.log('  Transactions:', sampleOrder.transactions.length);
      
      if (sampleOrder.items.length > 0) {
        console.log('  First Item:', sampleOrder.items[0].siteName);
      }
      
      if (sampleOrder.transactions.length > 0) {
        console.log('  First Transaction:', sampleOrder.transactions[0].status);
      }
    }

    console.log('\n🎉 Orders API test completed successfully!');
    console.log('\n🔑 Test Credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: testpassword123');
    console.log('\n🌐 Next Steps:');
    console.log('1. Start your development server');
    console.log('2. Go to /dashboard');
    console.log('3. Sign in with the test credentials');
    console.log('4. Check browser console for API logs');
    console.log('5. Check server console for database logs');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersAPI();
