#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleSites = [
  { id: 'site_001', name: 'TechCrunch', price: 2999 }, // $29.99
  { id: 'site_002', name: 'Wired', price: 1999 },      // $19.99
  { id: 'site_003', name: 'The Verge', price: 2499 },  // $24.99
  { id: 'site_004', name: 'Ars Technica', price: 1799 }, // $17.99
  { id: 'site_005', name: 'Engadget', price: 1599 },   // $15.99
];

const orderStatuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED'];
const transactionStatuses = ['INITIATED', 'SUCCESS', 'FAILED'];

async function createOrdersForCurrentUser() {
  try {
    console.log('🚀 Creating sample orders for current user...\n');

    // Get all users to see who exists
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    console.log('👥 Available users:');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.name || 'No name'}) - ID: ${user.id}`);
    });

    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    // Use the first user (or you can modify this to select a specific user)
    const targetUser = users[2];
    console.log(`\n🎯 Creating orders for: ${targetUser.email} (${targetUser.id})\n`);

    // Clear existing orders for this user
    console.log('🧹 Cleaning up existing orders...');
    await prisma.transaction.deleteMany({
      where: {
        order: {
          userId: targetUser.id
        }
      }
    });
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          userId: targetUser.id
        }
      }
    });
    await prisma.order.deleteMany({
      where: {
        userId: targetUser.id
      }
    });

    // Create sample orders
    const orders = [];
    for (let i = 0; i < 6; i++) {
      const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      
      // Select random sites for this order
      const selectedSites = sampleSites
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      const totalAmount = selectedSites.reduce((sum, site) => sum + site.price, 0);

      const order = await prisma.order.create({
        data: {
          userId: targetUser.id,
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
      where: { userId: targetUser.id },
      _count: { status: true }
    });

    orderStats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count.status} orders`);
    });

    console.log('\n🌐 Next Steps:');
    console.log('1. Refresh your dashboard page');
    console.log('2. You should now see your recent orders!');
    console.log('3. Click "Details" on any order to see the full information');

  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createOrdersForCurrentUser();
