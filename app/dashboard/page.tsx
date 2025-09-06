import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroStatsCards } from "@/components/dashboard/HeroStatsCards"
import { CaseStudiesCarousel } from "@/components/dashboard/CaseStudiesCarousel"
import { GrowthChart } from "@/components/dashboard/GrowthChart"
import { ROICalculator } from "@/components/dashboard/ROICalculator"
import { TrustBadges } from "@/components/dashboard/TrustBadges"
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

  // Redirect admin users to admin dashboard
  if (isAdmin) {
    redirect("/admin")
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
        <div className="container mx-auto p-6 space-y-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-600">See what success looks like and plan your growth</p>
          </div>

          {/* Hero Stats - Immediate Impact */}
          <HeroStatsCards />

          {/* Trust Elements */}
          <TrustBadges />

          {/* Client Success Stories - Social Proof */}
          <CaseStudiesCarousel />

          {/* Growth Visualization */}
          <GrowthChart />

          {/* ROI Calculator - Personal Relevance */}
          <ROICalculator />

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-[#FDC800] to-[#F2C86C] rounded-2xl p-8 text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h2>
            <p className="text-gray-800 mb-6">
              Join Mahindra Auto, UpGrad, and Proteantech in achieving exceptional growth
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-black text-[#FDC800] px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Browse Publishers
              </button>
              <button className="border-2 border-black text-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-[#FDC800] transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </Suspense>
    </PageLayout>
  )
}
