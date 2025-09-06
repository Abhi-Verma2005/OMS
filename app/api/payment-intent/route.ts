import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'
import { auth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Payment intent API called')
    
    // Check authentication
    const session = await auth()
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated')
    
    if (!session?.user?.id) {
      console.log('Unauthorized: No session or user ID')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, currency = 'usd', orderId } = await request.json()
    console.log('Request body:', { items, currency, orderId: orderId || 'not provided' })

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Error: No items provided')
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Calculate total amount
    const totalAmount = items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity)
    }, 0)

    console.log('Total amount calculated:', totalAmount)

    if (totalAmount <= 0) {
      console.log('Error: Invalid amount')
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Error: Stripe secret key not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Create payment intent
    console.log('Creating Stripe payment intent...')
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(totalAmount, currency),
      currency: currency,
      metadata: {
        userId: session.user.id,
        items: JSON.stringify(items),
        orderType: 'publisher_services',
        orderId: orderId || '', // Include order ID in metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    console.log('Payment intent created successfully:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
