#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCompletePaymentFlow() {
  try {
    console.log('🔍 Testing Complete Payment Flow...')
    
    // Get all users
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
    
    // Get all orders to see the current state
    const allOrders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\n📦 Current orders in database: ${allOrders.length}`)
    allOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.user.email} - $${(order.totalAmount / 100).toFixed(2)} - ${order.status} - ${order.createdAt.toISOString()}`)
    })
    
    // Create orders for each user to test
    console.log(`\n🎯 Creating test orders for each user...`)
    
    for (const user of users) {
      console.log(`\n📝 Creating order for: ${user.email}`)
      
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount: Math.floor(Math.random() * 5000) + 1000, // Random amount between $10-$60
          currency: 'USD',
          status: 'PAID',
          items: {
            create: [
              {
                siteId: `site_${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
                siteName: `Test Site ${Math.floor(Math.random() * 100)}`,
                priceCents: Math.floor(Math.random() * 3000) + 500, // Random price $5-$35
                withContent: Math.random() > 0.5,
                quantity: 1,
              }
            ]
          },
          transactions: {
            create: {
              amount: Math.floor(Math.random() * 5000) + 1000,
              currency: 'USD',
              status: 'SUCCESS',
              provider: 'stripe',
              reference: `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            }
          }
        },
        include: {
          items: true,
          transactions: true
        }
      })
      
      console.log(`   ✅ Created order ${order.id} - $${(order.totalAmount / 100).toFixed(2)}`)
    }
    
    // Verify all orders were created
    const finalOrders = await prisma.order.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\n📊 Final Results:`)
    console.log(`   Total orders: ${finalOrders.length}`)
    
    // Group orders by user
    const ordersByUser = {}
    finalOrders.forEach(order => {
      if (!ordersByUser[order.user.email]) {
        ordersByUser[order.user.email] = []
      }
      ordersByUser[order.user.email].push(order)
    })
    
    console.log(`\n👥 Orders by user:`)
    Object.entries(ordersByUser).forEach(([email, orders]) => {
      console.log(`   ${email}: ${orders.length} orders`)
      orders.forEach(order => {
        console.log(`     - $${(order.totalAmount / 100).toFixed(2)} - ${order.status} - ${order.createdAt.toISOString()}`)
      })
    })
    
    console.log(`\n🎯 Testing Instructions:`)
    console.log(`1. Sign in as any of these users:`)
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name})`)
    })
    console.log(`2. Go to /dashboard`)
    console.log(`3. You should see orders for the user you're logged in as`)
    console.log(`4. Check browser console for API logs`)
    
    console.log(`\n🔍 API Test Commands:`)
    console.log(`In browser console, run:`)
    console.log(`fetch("/api/user/orders").then(r => r.json()).then(console.log)`)
    console.log(`This should return orders for the currently logged-in user.`)
    
  } catch (error) {
    console.error('❌ Error testing payment flow:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCompletePaymentFlow()
