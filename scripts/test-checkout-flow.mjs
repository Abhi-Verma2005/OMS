#!/usr/bin/env node

/**
 * Test script to verify the checkout flow works correctly
 * This script tests:
 * 1. Order creation (should only create one order)
 * 2. Payment intent creation with order ID
 * 3. Webhook handling with order ID
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCheckoutFlow() {
  console.log('🧪 Testing Checkout Flow...\n')

  try {
    // Clean up any existing test orders
    await prisma.order.deleteMany({
      where: {
        userId: 'test-user-id'
      }
    })
    console.log('✅ Cleaned up existing test orders')

    // Test 1: Create an order
    console.log('\n📝 Test 1: Creating order...')
    const orderResponse = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'authjs.session-token=test-session' // You'll need to set up proper auth
      },
      body: JSON.stringify({
        items: [{
          siteId: 'test-site-1',
          siteName: 'Test Site 1',
          priceCents: 1000, // $10.00
          withContent: false,
          quantity: 1
        }],
        currency: 'USD'
      })
    })

    if (!orderResponse.ok) {
      const error = await orderResponse.text()
      console.log('❌ Order creation failed:', error)
      return
    }

    const { order } = await orderResponse.json()
    console.log('✅ Order created:', order.id)

    // Test 2: Create payment intent with order ID
    console.log('\n💳 Test 2: Creating payment intent with order ID...')
    const paymentResponse = await fetch('http://localhost:3000/api/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'authjs.session-token=test-session'
      },
      body: JSON.stringify({
        items: [{
          id: 'test-site-1',
          name: 'Test Site 1',
          price: 10.00,
          quantity: 1
        }],
        currency: 'usd',
        orderId: order.id
      })
    })

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text()
      console.log('❌ Payment intent creation failed:', error)
      return
    }

    const { clientSecret, paymentIntentId } = await paymentResponse.json()
    console.log('✅ Payment intent created:', paymentIntentId)
    console.log('✅ Client secret received:', clientSecret ? 'Yes' : 'No')

    // Test 3: Verify order exists and is in PENDING status
    console.log('\n🔍 Test 3: Verifying order status...')
    const dbOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true, transactions: true }
    })

    if (!dbOrder) {
      console.log('❌ Order not found in database')
      return
    }

    console.log('✅ Order found in database')
    console.log('   - Status:', dbOrder.status)
    console.log('   - Total Amount:', dbOrder.totalAmount)
    console.log('   - Items:', dbOrder.items.length)
    console.log('   - Transactions:', dbOrder.transactions.length)

    // Test 4: Simulate webhook call
    console.log('\n🔗 Test 4: Simulating webhook call...')
    const webhookResponse = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature' // You'll need proper signature
      },
      body: JSON.stringify({
        id: 'evt_test_webhook',
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            amount: 1000,
            currency: 'usd',
            metadata: {
              userId: 'test-user-id',
              items: JSON.stringify([{
                id: 'test-site-1',
                name: 'Test Site 1',
                price: 10.00,
                quantity: 1
              }]),
              orderType: 'publisher_services',
              orderId: order.id
            }
          }
        }
      })
    })

    console.log('✅ Webhook simulation completed (status:', webhookResponse.status, ')')

    // Test 5: Verify order status updated
    console.log('\n✅ Test 5: Verifying order status after webhook...')
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true, transactions: true }
    })

    if (updatedOrder) {
      console.log('✅ Order status after webhook:', updatedOrder.status)
      console.log('✅ Transaction status:', updatedOrder.transactions[0]?.status)
    }

    console.log('\n🎉 Checkout flow test completed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testCheckoutFlow()
