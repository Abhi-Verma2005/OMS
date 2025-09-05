"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"

type CheckoutSite = {
  id: string
  name: string
  priceCents: number
  withContent?: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const params = useSearchParams()

  // Read selected site details from the query string
  const initialSite: CheckoutSite | null = useMemo(() => {
    const id = params.get("siteId") || ""
    const name = params.get("siteName") || ""
    const priceRaw = params.get("priceCents")
    const price = priceRaw !== null ? Number(priceRaw) : NaN
    if (!id || !name || Number.isNaN(price)) return null
    return { id, name, priceCents: price, withContent: params.get("withContent") === "1" }
  }, [params])

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Don't redirect away; show an inline message if selection is missing

  const totalCents = initialSite?.priceCents ?? 0
  const totalFormatted = `$${(totalCents / 100).toFixed(2)}`

  const createOrder = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: "USD",
          items: [
            {
              siteId: initialSite!.id,
              siteName: initialSite!.name,
              priceCents: initialSite!.priceCents,
              withContent: Boolean(initialSite!.withContent),
              quantity: 1,
            },
          ],
          billing: { fullName, email, company, address },
        }),
      })
      if (!res.ok) throw new Error("Failed to create order")
      const { order } = await res.json()

      const payRes = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, reference: `REF-${Date.now()}` }),
      })
      if (!payRes.ok) throw new Error("Payment failed")

      setSuccess("Payment successful! Your order has been placed.")
      setTimeout(() => router.replace("/data"), 1500)
    } catch (e: any) {
      setError(e?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout showBreadcrumbs={true}>
      <div className="mx-auto max-w-4xl w-full space-y-6">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        {!initialSite ? (
          <div className="rounded border border-yellow-200 bg-yellow-50 p-3 text-yellow-800">
            No site selected. Please go back and choose a site to order.
          </div>
        ) : null}

        {error ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded border border-green-200 bg-green-50 p-3 text-green-700">{success}</div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
                </div>
              </div>

              <Separator />
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Payment Method</div>
                <div className="rounded border p-3 text-sm">Simulated card payment (test mode)</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {initialSite ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium truncate max-w-[60%]" title={initialSite.name}>{initialSite.name}</div>
                    <div className="text-sm">${(initialSite.priceCents / 100).toFixed(2)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Site ID: {initialSite.id}</div>
                  {initialSite.withContent ? (
                    <div className="text-xs text-muted-foreground">Includes content</div>
                  ) : null}
                </div>
              ) : null}

              <Separator />
              <div className="flex items-center justify-between font-medium">
                <div>Total</div>
                <div>{totalFormatted}</div>
              </div>

              <Button className="w-full" disabled={loading || !initialSite} onClick={createOrder}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay and Place Order"
                )}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/data")} disabled={loading}>
                Back to sites
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}


