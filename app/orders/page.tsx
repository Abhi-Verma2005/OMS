import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageLayout } from "@/components/layout/page-layout"
import { OrdersContent } from "@/components/orders/orders-content"

export default async function OrdersPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      }>
        <OrdersContent />
      </Suspense>
    </PageLayout>
  )
}
