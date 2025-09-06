#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const sampleSites = [
  { id: 'site_001', name: 'TechCrunch', price: 2999 }, // $29.99
  { id: 'site_002', name: 'Wired', price: 1999 },      // $19.99
  { id: 'site_003', name: 'The Verge', price: 2499 },  // $24.99
  { id: 'site_004', name: 'Ars Technica', price: 1799 }, // $17.99
  { id: 'site_005', name: 'Engadget', price: 1599 },   // $15.99
];

const orderStatuses = ['PAID', 'FAILED', 'CANCELLED']; // No PENDING orders allowed
const transactionStatuses = ['INITIATED', 'SUCCESS', 'FAILED'];

async function createSampleOrders() {
  try {
    console.log('🚀 Creating sample orders and transactions...\n');

    // First, ensure we have a test user
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
      console.log('👤 Using existing test user:', testUser.email);
    }

    // Clear existing orders for this user
    console.log('🧹 Cleaning up existing orders...');
    await prisma.transaction.deleteMany({
      where: {
        order: {
          userId: testUser.id
        }
      }
    });
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId: testUser.id
        }
      }
    });
    await prisma.order.deleteMany({
      where: {
        userId: testUser.id
      }
    });

    // Create sample orders
    const orders = [];
    for (let i = 0; i < 8; i++) {
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      
      // Select random sites for this order
      const selectedSites = sampleSites
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      const totalAmount = selectedSites.reduce((sum, site) => sum + site.price, 0);

      const order = await prisma.order.create({
        data: {
          userId: testUser.id,
          status: orderStatus,
          totalAmount: totalAmount,
          currency: 'USD',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        }
      });

      // Create order items
      for (const site of selectedSites) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            siteId: site.id,
            siteName: site.name,
            priceCents: site.price,
            quantity: Math.floor(Math.random() * 2) + 1, // 1-2 quantity
            withContent: Math.random() > 0.5, // Random boolean
          }
        });
      }

      // Create transactions for some orders
      if (orderStatus === 'PAID' || orderStatus === 'FAILED') {
        const numTransactions = Math.floor(Math.random() * 2) + 1; // 1-2 transactions
        
        for (let j = 0; j < numTransactions; j++) {
          const transactionStatus = j === numTransactions - 1 
            ? (orderStatus === 'PAID' ? 'SUCCESS' : 'FAILED')
            : 'INITIATED';
          
          await prisma.transaction.create({
            data: {
              orderId: order.id,
              amount: totalAmount,
              currency: 'USD',
              status: transactionStatus,
              provider: ['stripe', 'paypal', 'square'][Math.floor(Math.random() * 3)],
              reference: `ref_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(order.createdAt.getTime() + (j + 1) * 60000), // 1 minute apart
            }
          });
        }
      }

      orders.push(order);
      console.log(`✅ Created order ${order.id.slice(-8)} with ${numItems} items (${orderStatus})`);
    }

    console.log(`\n🎉 Successfully created ${orders.length} sample orders!`);
    console.log('\n📊 Order Summary:');
    
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      where: { userId: testUser.id },
      _count: { status: true }
    });

    orderStats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count.status} orders`);
    });

    console.log('\n🔑 Test Credentials:');
    console.log('  Email: test@example.com');
    console.log('  Password: testpassword123');
    console.log('\n🌐 Next Steps:');
    console.log('1. Start your development server');
    console.log('2. Go to /dashboard');
    console.log('3. Sign in with the test credentials');
    console.log('4. View your recent orders and transaction details!');

  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleOrders();
