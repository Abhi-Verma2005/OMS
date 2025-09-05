import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  console.log('Webhook received:', {
    hasSignature: !!signature,
    bodyLength: body.length,
    webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
  })

  let event: Stripe.Event

  // For development/testing, allow bypassing signature verification
  if (process.env.NODE_ENV === 'development' && signature === 'test-signature') {
    console.log('Development mode: Bypassing signature verification')
    try {
      event = JSON.parse(body) as Stripe.Event
    } catch (err) {
      console.error('Failed to parse webhook body:', err)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
  } else {
    if (!signature) {
      console.error('No signature provided')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('Processing payment_intent.succeeded:', {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata
        })
        
        // Extract metadata
        const { userId, items, orderType, orderId } = paymentIntent.metadata
        
        if (!userId || !items) {
          console.error('Missing required metadata in payment intent:', {
            userId: !!userId,
            items: !!items,
            orderId: !!orderId
          })
          break
        }

        // Parse items
        const parsedItems = JSON.parse(items)
        console.log('Parsed items:', parsedItems)
        
        try {
          let order;
          
          // If we have an orderId in metadata, use that specific order
          if (orderId) {
            console.log('Looking for order with ID:', orderId)
            order = await prisma.order.findUnique({
              where: { id: orderId },
              include: { items: true, transactions: true }
            })
            
            if (order) {
              console.log('Found order:', {
                id: order.id,
                status: order.status,
                amount: order.totalAmount,
                userId: order.userId
              })
              
              // Update the specific order to PAID status
              order = await prisma.order.update({
                where: { id: order.id },
                data: { status: 'PAID' },
                include: { items: true, transactions: true }
              })

              console.log('Order updated to PAID:', order.id)

              // Update or create transaction record
              const transactionResult = await prisma.transaction.updateMany({
                where: { orderId: order.id },
                data: {
                  status: 'SUCCESS',
                  provider: 'stripe',
                  reference: paymentIntent.id,
                }
              })

              console.log('Transaction updated:', transactionResult)
            } else {
              console.error('Order not found with ID:', orderId)
            }
          } else {
            // Fallback: Find existing pending order for this user
            order = await prisma.order.findFirst({
              where: {
                userId,
                status: 'PENDING',
              },
              orderBy: { createdAt: 'desc' },
              include: { items: true, transactions: true }
            })

            if (order) {
              // Update existing order to PAID status
              order = await prisma.order.update({
                where: { id: order.id },
                data: { status: 'PAID' },
                include: { items: true, transactions: true }
              })

              // Update or create transaction record
              await prisma.transaction.updateMany({
                where: { orderId: order.id },
                data: {
                  status: 'SUCCESS',
                  provider: 'stripe',
                  reference: paymentIntent.id,
                }
              })

              console.log('Order updated to PAID:', order.id)
            } else {
              // Create new order if none exists (fallback)
              order = await prisma.order.create({
                data: {
                  userId,
                  totalAmount: paymentIntent.amount,
                  currency: paymentIntent.currency.toUpperCase(),
                  status: 'PAID',
                  items: {
                    create: parsedItems.map((item: any) => ({
                      siteId: item.id,
                      siteName: item.name,
                      priceCents: Math.round(item.price * 100),
                      withContent: false, // Default value
                      quantity: item.quantity,
                    }))
                  },
                  transactions: {
                    create: {
                      amount: paymentIntent.amount,
                      currency: paymentIntent.currency.toUpperCase(),
                      status: 'SUCCESS',
                      provider: 'stripe',
                      reference: paymentIntent.id,
                    }
                  }
                },
                include: {
                  items: true,
                  transactions: true,
                }
              })

              console.log('Order created successfully:', order.id)
            }
          }
        } catch (dbError) {
          console.error('Error handling order in database:', dbError)
        }

        console.log('Payment succeeded:', {
          paymentIntentId: paymentIntent.id,
          userId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          items: parsedItems,
          orderType,
        })

        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        console.log('Payment failed:', {
          paymentIntentId: paymentIntent.id,
          userId: paymentIntent.metadata.userId,
          error: paymentIntent.last_payment_error,
        })

        // Create failed transaction record if we have the order
        if (paymentIntent.metadata.userId) {
          try {
            // Find existing order or create a failed one
            const existingOrder = await prisma.order.findFirst({
              where: {
                userId: paymentIntent.metadata.userId,
                status: 'PENDING',
              },
              orderBy: { createdAt: 'desc' }
            })

            if (existingOrder) {
              await prisma.transaction.create({
                data: {
                  orderId: existingOrder.id,
                  amount: paymentIntent.amount,
                  currency: paymentIntent.currency.toUpperCase(),
                  status: 'FAILED',
                  provider: 'stripe',
                  reference: paymentIntent.id,
                }
              })

              // Update order status
              await prisma.order.update({
                where: { id: existingOrder.id },
                data: { status: 'FAILED' }
              })
            }
          } catch (dbError) {
            console.error('Error handling failed payment:', dbError)
          }
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
