"use client"

import React from 'react'
import { useCart } from '@/contexts/cart-context'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Site } from '@/lib/sample-sites'
import { 
  ShoppingCart, 
  Trash2, 
  ExternalLink, 
  Globe, 
  ArrowLeft,
  CreditCard,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function CartPage() {
  const { state, removeItem, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const { items } = state

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + item.site.publishing.price // Each item has quantity of 1
    }, 0)
  }

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    router.push('/checkout')
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Sign in to view your cart</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to view and manage your cart items.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
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
              <Link href="/data" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Publishers
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            {items.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {items.length} item{items.length === 1 ? '' : 's'}
              </Badge>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-muted-foreground/50" />
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any publishers to your cart yet. 
                Start browsing our directory to find the perfect sites for your campaigns.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/data">Browse Publishers</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Site Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg line-clamp-2">{item.site.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.site.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a 
                            href={item.site.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {item.site.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">{item.site.niche}</Badge>
                          <Badge variant="outline">DA: {item.site.da}</Badge>
                          <Badge variant="outline">PA: {item.site.pa}</Badge>
                          <Badge variant="outline">DR: {item.site.dr}</Badge>
                        </div>

                        {/* Publishing Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Turnaround:</span> {item.site.publishing.tatDays} days
                          </div>
                          <div>
                            <span className="font-medium">Word Limit:</span> {item.site.publishing.wordLimit || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Link Type:</span> {item.site.publishing.backlinkNature}
                          </div>
                          <div>
                            <span className="font-medium">Placement:</span> {item.site.publishing.linkPlacement}
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ${item.site.publishing.price.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Single item
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
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

                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={clearCart}
                        className="w-full"
                      >
                        Clear Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        asChild
                        className="w-full"
                      >
                        <Link href="/data">
                          Add More
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-4 border-t">
                    <p className="mb-2">
                      <strong>What happens next?</strong>
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Review your order details</li>
                      <li>Complete payment securely</li>
                      <li>Receive order confirmation</li>
                      <li>Start your publishing campaign</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
