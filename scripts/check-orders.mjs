#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkOrders() {
  try {
    console.log('🔍 Checking orders in database...')
    
    // Check all orders
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
    
    console.log(`📦 Found ${orders.length} orders in database:`)
    
    if (orders.length === 0) {
      console.log('❌ No orders found in database!')
      console.log('\n🔍 Let me check other tables...')
      
      // Check users
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true
        }
      })
      console.log(`👥 Found ${users.length} users:`, users)
      
      // Check transactions
      const transactions = await prisma.transaction.findMany()
      console.log(`💳 Found ${transactions.length} transactions:`, transactions)
      
    } else {
      orders.forEach((order, index) => {
        console.log(`\n📋 Order ${index + 1}:`)
        console.log(`   ID: ${order.id}`)
        console.log(`   User: ${order.user.email} (${order.user.name})`)
        console.log(`   Status: ${order.status}`)
        console.log(`   Total: $${(order.totalAmount / 100).toFixed(2)} ${order.currency}`)
        console.log(`   Created: ${order.createdAt}`)
        console.log(`   Items: ${order.items.length}`)
        console.log(`   Transactions: ${order.transactions.length}`)
        
        if (order.items.length > 0) {
          console.log('   Items:')
          order.items.forEach(item => {
            console.log(`     - ${item.siteName} (${item.siteId}) - $${(item.priceCents / 100).toFixed(2)}`)
          })
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking orders:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkOrders()
