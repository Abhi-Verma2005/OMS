"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  Loader2,
  Shield,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef')

interface CheckoutFormProps {
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ clientSecret, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (err) {
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />
      
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  )
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { state, clearCart } = useCart()
  const { items } = state

  const [clientSecret, setClientSecret] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, router])

  // Check if Stripe is configured
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.warn('Stripe publishable key not configured. Using test key.')
    }
  }, [])

  // Create payment intent and order when component mounts
  useEffect(() => {
    if (!session || items.length === 0 || clientSecret || orderId) return

    const createPaymentIntentAndOrder = async () => {
      try {
        setIsLoading(true)
        setError('')

        console.log('Creating payment intent with items:', items.map(item => ({
          id: item.site.id,
          name: item.site.name,
          price: item.site.publishing.price,
          quantity: item.quantity,
        })))

        // First create the order
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              siteId: item.site.id,
              siteName: item.site.name,
              priceCents: Math.round(item.site.publishing.price * 100), // Convert to cents
              withContent: false, // Default to false, can be made configurable
              quantity: item.quantity,
            })),
            currency: 'USD',
          }),
        })

        console.log('Order creation response status:', orderResponse.status)

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json()
          console.error('Order creation error:', errorData)
          throw new Error(errorData.error || 'Failed to create order')
        }

        const { order } = await orderResponse.json()
        console.log('Order created successfully:', order.id)
        setOrderId(order.id)

        // Then create payment intent with order ID in metadata
        const paymentResponse = await fetch('/api/payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              id: item.site.id,
              name: item.site.name,
              price: item.site.publishing.price,
              quantity: item.quantity,
            })),
            currency: 'usd',
            orderId: order.id, // Pass the order ID to link payment intent with order
          }),
        })

        console.log('Payment intent response status:', paymentResponse.status)

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json()
          console.error('Payment intent error:', errorData)
          throw new Error(errorData.error || 'Failed to create payment intent')
        }

        const { clientSecret } = await paymentResponse.json()
        console.log('Payment intent created successfully:', clientSecret)
        setClientSecret(clientSecret)
      } catch (err) {
        console.error('Payment intent/order creation failed:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize payment')
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntentAndOrder()
  }, [session, items, clientSecret, orderId])

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.site.publishing.price * item.quantity)
    }, 0)
  }

  const handlePaymentSuccess = async () => {
    try {
      // The webhook will handle updating the order status
      // We just need to clear the cart and redirect
      console.log('Payment successful, order will be updated via webhook')
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error('Error in payment success handler:', error)
      // Still proceed to success page as payment was successful
      clearCart()
      router.push('/checkout/success')
    }
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button asChild>
              <Link href="/data">Browse Publishers</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p>Initializing payment...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                ) : null}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your payment information is encrypted and processed securely by Stripe.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.site.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.site.niche} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(item.site.publishing.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span>{orderId ? `#${orderId.slice(-8)}` : 'Generating...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span>{session.user?.name || session.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}