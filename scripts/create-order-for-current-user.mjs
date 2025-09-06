#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createOrderForCurrentUser() {
  try {
    console.log('🔍 Creating order for current user...')
    
    // Get all users to see who we have
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    })
    
    console.log(`👥 Available users:`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name}) - ID: ${user.id}`)
    })
    
    // For this test, let's use the first user (you can change this)
    const currentUser = users[0]
    console.log(`\n🎯 Creating order for: ${currentUser.email} (${currentUser.name})`)
    
    // Create a sample order
    const order = await prisma.order.create({
      data: {
        userId: currentUser.id,
        totalAmount: 2999, // $29.99 in cents
        currency: 'USD',
        status: 'PAID',
        items: {
          create: [
            {
              siteId: 'site_001',
              siteName: 'TechCrunch',
              priceCents: 1999, // $19.99
              withContent: false,
              quantity: 1,
            },
            {
              siteId: 'site_003', 
              siteName: 'Mashable',
              priceCents: 1000, // $10.00
              withContent: true,
              quantity: 1,
            }
          ]
        },
        transactions: {
          create: {
            amount: 2999, // $29.99 in cents
            currency: 'USD',
            status: 'SUCCESS',
            provider: 'stripe',
            reference: `pi_test_${Date.now()}`,
          }
        }
      },
      include: {
        items: true,
        transactions: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    console.log(`\n✅ Order created successfully!`)
    console.log(`📋 Order Details:`)
    console.log(`   ID: ${order.id}`)
    console.log(`   User: ${order.user.email} (${order.user.name})`)
    console.log(`   Status: ${order.status}`)
    console.log(`   Total: $${(order.totalAmount / 100).toFixed(2)} ${order.currency}`)
    console.log(`   Created: ${order.createdAt.toISOString()}`)
    console.log(`   Items: ${order.items.length}`)
    console.log(`   Transactions: ${order.transactions.length}`)
    
    console.log(`\n📦 Order Items:`)
    order.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.siteName} (${item.siteId})`)
      console.log(`      Price: $${(item.priceCents / 100).toFixed(2)}`)
      console.log(`      With Content: ${item.withContent}`)
      console.log(`      Quantity: ${item.quantity}`)
    })
    
    console.log(`\n💳 Transaction:`)
    order.transactions.forEach((tx, index) => {
      console.log(`   ${index + 1}. ${tx.status} - $${(tx.amount / 100).toFixed(2)} ${tx.currency}`)
      console.log(`      Provider: ${tx.provider}`)
      console.log(`      Reference: ${tx.reference}`)
    })
    
    console.log(`\n🎯 Next Steps:`)
    console.log(`1. Make sure you are logged in as: ${currentUser.email}`)
    console.log(`2. Go to /dashboard in your browser`)
    console.log(`3. You should see this new order in the recent orders section`)
    console.log(`4. If you don't see it, check the browser console for API errors`)
    
    // Verify the order was created
    const verifyOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
        transactions: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })
    
    if (verifyOrder) {
      console.log(`\n✅ Verification: Order exists in database`)
      console.log(`   User ID matches: ${verifyOrder.userId === currentUser.id}`)
      console.log(`   Status: ${verifyOrder.status}`)
      console.log(`   Items count: ${verifyOrder.items.length}`)
    } else {
      console.log(`\n❌ Verification failed: Order not found in database`)
    }
    
  } catch (error) {
    console.error('❌ Error creating order:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createOrderForCurrentUser()
