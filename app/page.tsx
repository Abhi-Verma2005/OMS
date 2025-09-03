import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileStack, BarChart3, Globe, Search, TrendingUp, Shield, Zap, Target, Users, Sparkles } from "lucide-react"
import { auth } from "@/lib/auth"
import { PageLayout } from "@/components/layout/page-layout"

export default async function Page() {
  const session = await auth()
  const isAuthenticated = !!session

  return (
    <PageLayout showBreadcrumbs={false} className="px-6">

      {/* Hero Section */}
      <div className="py-20">
        <div className="text-center space-y-8 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">Next-Gen Publisher Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            Publisher Directory
            <span className="block text-4xl md:text-6xl mt-4 text-yellow-600 dark:text-yellow-400">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover premium publishers with cutting-edge analytics. Access real-time domain authority, 
            traffic insights, competitive pricing, and advanced publishing requirements—all in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <>
                <Link href="/data">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-0 shadow-sm hover:shadow-md transition-all duration-200">
                    <Search className="w-5 h-5 mr-2" />
                    Explore Publishers
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-0 shadow-sm hover:shadow-md transition-all duration-200">
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
                    <Users className="w-5 h-5 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-xl mb-3">AI-Powered Search</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                Advanced filtering with machine learning algorithms to find the perfect publishers based on domain authority, traffic patterns, and ROI potential.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-xl mb-3">Real-Time Analytics</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                Live performance metrics including DA, PA, DR scores, spam analysis, traffic trends, and predictive analytics for campaign success.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-4">
              <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-gray-900 dark:text-white text-xl mb-3">Global Network</CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                Worldwide publisher network spanning 50+ countries and 15+ languages, with localized insights and cultural targeting capabilities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Stats Section */}
        <div className="relative">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-6 mx-auto">
                <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-800 dark:text-yellow-200">Platform Performance</span>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Trusted by Industry Leaders
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Comprehensive analytics and insights across our growing publisher ecosystem
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    2.5K+
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Active Publishers</div>
                  <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    85+
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Global Markets</div>
                  <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    25+
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Languages</div>
                  <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                    50+
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">Industry Verticals</div>
                  <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Ready to Transform Your Campaigns?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Join thousands of marketers who trust OMS for their publisher discovery and campaign optimization.
          </p>
          {!isAuthenticated && (
            <Link href="/auth/signup">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </div>
    </PageLayout>
  )
}