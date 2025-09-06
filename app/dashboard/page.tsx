import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Shield, Filter, ShoppingCart, Receipt, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { getUserWithRoles } from "@/lib/rbac"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const user = session.user
  
  // Get user with roles to check for admin
  let isAdmin = false
  try {
    const userWithRoles = await getUserWithRoles(session.user.id)
    isAdmin = userWithRoles?.userRoles.some(ur => 
      ur.role.name === 'admin' && ur.role.isActive
    ) || false
  } catch (error) {
    console.error('Error fetching user roles:', error)
    // Fallback: check if user has admin role in session
    isAdmin = (session.user as any)?.isAdmin || false
  }

  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      }>
        <DashboardContent user={user} userRole={isAdmin ? "ADMIN" : "USER"} />
      </Suspense>
    </PageLayout>
  )
}
