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
        <div className="container mx-auto space-y-12 anim-page-in">
          {/* Page Header */}
          <div className="text-center space-y-4 anim-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">See what success looks like and plan your growth with data-driven insights</p>
          </div>

          {/* Hero Stats - Immediate Impact */}
          <div className="anim-fade-in" style={{animationDelay: '0.2s'}}>
            <HeroStatsCards />
          </div>

          {/* Trust Elements */}
          <div className="anim-fade-in" style={{animationDelay: '0.4s'}}>
            <TrustBadges />
          </div>

          {/* Client Success Stories - Social Proof */}
          <div className="anim-fade-in" style={{animationDelay: '0.6s'}}>
            <CaseStudiesCarousel />
          </div>

          {/* Growth Visualization */}
          <div className="anim-fade-in" style={{animationDelay: '0.8s'}}>
            <GrowthChart />
          </div>

          {/* ROI Calculator - Personal Relevance */}
          <div className="anim-fade-in" style={{animationDelay: '1s'}}>
            <ROICalculator />
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-primary rounded-3xl p-12 text-center text-primary-foreground shadow-modern-xl anim-scale-in" style={{animationDelay: '1.2s'}}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Success Stories?</h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join Mahindra Auto, UpGrad, and Proteantech in achieving exceptional growth
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-background text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-background/90 transition-all duration-300 hover:scale-105 shadow-modern">
                Browse Publishers
              </button>
              <button className="border-2 border-background text-background px-8 py-4 rounded-xl font-semibold hover:bg-background hover:text-foreground transition-all duration-300 hover:scale-105">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </Suspense>
    </PageLayout>
  )
}
