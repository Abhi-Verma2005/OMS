#!/usr/bin/env node

/**
 * Test script to verify webhook processing
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testWebhook() {
  console.log('🧪 Testing Webhook Processing...\n')

  try {
    // Find a recent PENDING order
    const pendingOrder = await prisma.order.findFirst({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { items: true, transactions: true }
    })

    if (!pendingOrder) {
      console.log('❌ No pending orders found')
      
      // Show recent orders
      const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { items: true, transactions: true }
      })
      
      console.log('\nRecent orders:')
      recentOrders.forEach(order => {
        console.log(`- Order ${order.id}: Status=${order.status}, Amount=${order.totalAmount}`)
        if (order.transactions.length > 0) {
          order.transactions.forEach(tx => {
            console.log(`  Transaction: ${tx.status} (${tx.provider}) - ${tx.reference}`)
          })
        }
      })
      return
    }

    console.log('✅ Found pending order:', pendingOrder.id)
    console.log('   - Status:', pendingOrder.status)
    console.log('   - Amount:', pendingOrder.totalAmount)
    console.log('   - User ID:', pendingOrder.userId)

    // Test webhook call (without signature verification for testing)
    console.log('\n🔗 Testing webhook call...')
    
    const webhookPayload = {
      id: 'evt_test_webhook',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_payment_intent',
          amount: pendingOrder.totalAmount,
          currency: 'usd',
          metadata: {
            userId: pendingOrder.userId,
            items: JSON.stringify(pendingOrder.items.map(item => ({
              id: item.siteId,
              name: item.siteName,
              price: item.priceCents / 100,
              quantity: item.quantity
            }))),
            orderType: 'publisher_services',
            orderId: pendingOrder.id
          }
        }
      }
    }

    console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2))

    // Make webhook call
    const response = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature' // This will fail signature verification
      },
      body: JSON.stringify(webhookPayload)
    })

    console.log('Webhook response status:', response.status)
    const responseText = await response.text()
    console.log('Webhook response:', responseText)

    // Check if order status changed
    const updatedOrder = await prisma.order.findUnique({
      where: { id: pendingOrder.id },
      include: { items: true, transactions: true }
    })

    console.log('\n📊 Order status after webhook:')
    console.log('   - Status:', updatedOrder?.status)
    console.log('   - Transactions:', updatedOrder?.transactions.length)
    if (updatedOrder?.transactions.length > 0) {
      updatedOrder.transactions.forEach(tx => {
        console.log(`     Transaction: ${tx.status} (${tx.provider}) - ${tx.reference}`)
      })
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testWebhook()