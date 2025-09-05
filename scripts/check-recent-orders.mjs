#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkRecentOrders() {
  try {
    console.log('🔍 Checking recent orders and debugging dashboard issue...')
    
    // Get all orders with detailed info
    const orders = await prisma.order.findMany({
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
    
    console.log(`📦 Total orders in database: ${orders.length}`)
    
    if (orders.length === 0) {
      console.log('❌ No orders found! This means:')
      console.log('   1. Stripe webhook is not working')
      console.log('   2. Payment is not completing successfully')
      console.log('   3. Database connection issues')
      return
    }
    
    // Show all orders
    orders.forEach((order, index) => {
      console.log(`\n📋 Order ${index + 1}:`)
      console.log(`   ID: ${order.id}`)
      console.log(`   User ID: ${order.userId}`)
      console.log(`   User Email: ${order.user.email}`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Total: $${(order.totalAmount / 100).toFixed(2)} ${order.currency}`)
      console.log(`   Created: ${order.createdAt.toISOString()}`)
      console.log(`   Items: ${order.items.length}`)
      console.log(`   Transactions: ${order.transactions.length}`)
      
      if (order.items.length > 0) {
        console.log('   Items:')
        order.items.forEach(item => {
          console.log(`     - ${item.siteName} (${item.siteId}) - $${(item.priceCents / 100).toFixed(2)}`)
        })
      }
      
      if (order.transactions.length > 0) {
        console.log('   Transactions:')
        order.transactions.forEach(tx => {
          console.log(`     - ${tx.status} - $${(tx.amount / 100).toFixed(2)} ${tx.currency} (${tx.provider})`)
        })
      }
    })
    
    // Check if there are any users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    })
    
    console.log(`\n👥 Total users: ${users.length}`)
    users.forEach(user => {
      console.log(`   - ${user.email} (${user.name}) - ID: ${user.id}`)
    })
    
    // Check if the order user matches any current user
    const orderUserIds = orders.map(o => o.userId)
    const currentUserIds = users.map(u => u.id)
    
    console.log('\n🔍 User ID Analysis:')
    console.log(`   Order User IDs: ${orderUserIds.join(', ')}`)
    console.log(`   Current User IDs: ${currentUserIds.join(', ')}`)
    
    const matchingUsers = orderUserIds.filter(orderUserId => 
      currentUserIds.includes(orderUserId)
    )
    
    if (matchingUsers.length === 0) {
      console.log('❌ ISSUE FOUND: Order user IDs do not match current user IDs!')
      console.log('   This means the orders were created for users that no longer exist')
      console.log('   or there is a user ID mismatch in the authentication system.')
    } else {
      console.log(`✅ Found ${matchingUsers.length} matching users`)
    }
    
  } catch (error) {
    console.error('❌ Error checking orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkRecentOrders()
