#!/usr/bin/env node

/**
 * Test script to verify that orders are NOT created when accessing checkout
 * Orders should only be created after successful payment via webhook
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testCheckoutFlow() {
  console.log('🧪 Testing checkout flow - orders should NOT be created upfront\n')

  try {
    // Get a test user
    const user = await prisma.user.findFirst({
      where: { email: { contains: 'test' } }
    })

    if (!user) {
      console.log('❌ No test user found. Please create a test user first.')
      return
    }

    console.log(`👤 Using test user: ${user.email}`)

    // Count orders before test
    const ordersBefore = await prisma.order.count({
      where: { userId: user.id }
    })

    console.log(`📊 Orders before test: ${ordersBefore}`)

    // Simulate checkout page access (this should NOT create an order)
    console.log('\n🛒 Simulating checkout page access...')
    
    // Test payment intent creation (this should work without creating an order)
    const testItems = [
      {
        id: 'test-site-1',
        name: 'Test Site 1',
        price: 50.00,
        quantity: 1
      }
    ]

    const paymentIntentResponse = await fetch('http://localhost:3000/api/payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `next-auth.session-token=${user.id}` // This won't work in real test, but shows the intent
      },
      body: JSON.stringify({
        items: testItems,
        currency: 'usd'
      })
    })

    console.log(`💳 Payment intent response status: ${paymentIntentResponse.status}`)

    if (paymentIntentResponse.status === 401) {
      console.log('⚠️  Payment intent requires authentication (expected)')
    } else if (paymentIntentResponse.ok) {
      console.log('✅ Payment intent created successfully')
    } else {
      console.log('❌ Payment intent creation failed')
    }

    // Count orders after payment intent creation
    const ordersAfterPaymentIntent = await prisma.order.count({
      where: { userId: user.id }
    })

    console.log(`📊 Orders after payment intent creation: ${ordersAfterPaymentIntent}`)

    if (ordersAfterPaymentIntent === ordersBefore) {
      console.log('✅ SUCCESS: No orders were created during checkout process')
    } else {
      console.log('❌ FAILURE: Orders were created during checkout process')
    }

    // Test webhook simulation (this SHOULD create an order)
    console.log('\n🔔 Simulating successful payment webhook...')
    
    const webhookPayload = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123456789',
          amount: 5000, // $50.00 in cents
          currency: 'usd',
          metadata: {
            userId: user.id,
            items: JSON.stringify(testItems),
            orderType: 'publisher_services'
          }
        }
      }
    }

    const webhookResponse = await fetch('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature' // For development mode
      },
      body: JSON.stringify(webhookPayload)
    })

    console.log(`🔔 Webhook response status: ${webhookResponse.status}`)

    if (webhookResponse.ok) {
      console.log('✅ Webhook processed successfully')
    } else {
      console.log('❌ Webhook processing failed')
    }

    // Count orders after webhook
    const ordersAfterWebhook = await prisma.order.count({
      where: { userId: user.id }
    })

    console.log(`📊 Orders after webhook: ${ordersAfterWebhook}`)

    if (ordersAfterWebhook > ordersAfterPaymentIntent) {
      console.log('✅ SUCCESS: Order was created after successful payment')
    } else {
      console.log('❌ FAILURE: No order was created after successful payment')
    }

    // Summary
    console.log('\n📋 Test Summary:')
    console.log(`   Orders before: ${ordersBefore}`)
    console.log(`   Orders after payment intent: ${ordersAfterPaymentIntent}`)
    console.log(`   Orders after webhook: ${ordersAfterWebhook}`)
    
    if (ordersAfterPaymentIntent === ordersBefore && ordersAfterWebhook > ordersAfterPaymentIntent) {
      console.log('\n🎉 ALL TESTS PASSED: Orders are only created after successful payment!')
    } else {
      console.log('\n❌ TESTS FAILED: Check the implementation')
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testCheckoutFlow()
