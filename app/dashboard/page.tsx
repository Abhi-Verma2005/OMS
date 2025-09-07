import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageLayout } from "@/components/layout/page-layout"
import { HeroStatsCards } from "@/components/dashboard/HeroStatsCards"
import { CaseStudiesCarousel } from "@/components/dashboard/CaseStudiesCarousel"
import { GrowthChart } from "@/components/dashboard/GrowthChart"
import { ROICalculator } from "@/components/dashboard/ROICalculator"
import { TrustBadges } from "@/components/dashboard/TrustBadges"
import { BusinessOverviewCards } from "@/components/dashboard/BusinessOverviewCards"
import { PublisherCategoryChart } from "@/components/dashboard/PublisherCategoryChart"
import { BusinessGrowthCharts } from "@/components/dashboard/BusinessGrowthCharts"
import { RecentOrdersActivity } from "@/components/dashboard/RecentOrdersActivity"
import { PublisherAnalytics } from "@/components/dashboard/PublisherAnalytics"
import { IntegratedCTASection } from "@/components/dashboard/IntegratedCTASection"
import { TopIndianClients } from "@/components/dashboard/TopIndianClients"
import { PromotionalBanners, ExploreSitesCTA } from "@/components/dashboard/PromotionalBanners"
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
          {/* Page Header with Live Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  Business Dashboard
                </h1>
                <p className="text-gray-600 text-lg">Real-time insights into our publisher network and client success</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* 40K+ Sites Badge */}
          <PromotionalBanners />

          {/* Business Overview - What We Have & Whom We Served */}
          <BusinessOverviewCards />

          {/* Top Indian Clients & Testimonials */}
          <TopIndianClients />

          {/* Publisher Network Analytics */}
          <PublisherCategoryChart />
          <PublisherAnalytics />

          {/* Business Growth Metrics */}
          <BusinessGrowthCharts />

          {/* Explore More Sites CTA */}
          <ExploreSitesCTA />

          {/* Recent Activity & Social Proof */}
          <RecentOrdersActivity />

          {/* Client Success Stories - Enhanced Social Proof */}
          <CaseStudiesCarousel />

          {/* Client Growth Timeline */}
          <GrowthChart />

          {/* Limited Offer Banner */}
          <div className="mb-8">
            <PromotionalBanners />
          </div>

          {/* Interactive ROI Calculator */}
          <ROICalculator />

          {/* Integrated Call-to-Action Section with Working Buttons */}
          <IntegratedCTASection />

          {/* Footer Stats Summary */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Scale Your Business?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div>
                <p className="text-3xl font-bold text-blue-400">40K+</p>
                <p className="text-gray-400">Publishers Ready</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">1000+</p>
                <p className="text-gray-400">Happy Clients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-400">98.5%</p>
                <p className="text-gray-400">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-400">24/7</p>
                <p className="text-gray-400">Support Available</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Join the ranks of successful businesses. Start your growth journey today.
            </p>
          </div>
        </div>
      </Suspense>
    </PageLayout>
  )
}
