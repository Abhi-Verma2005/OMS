import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import FilterPage from "@/components/filter-page"
import { Loader2 } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"

export default async function DataPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Redirect admin users to admin dashboard
  if (session?.user && (session.user as any)?.isAdmin) {
    redirect("/admin")
  }

  return (
    <PageLayout showBreadcrumbs={true} className="px-0">
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading publishers...</p>
          </div>
        </div>
      }>
        <FilterPage />
      </Suspense>
    </PageLayout>
  )
}

