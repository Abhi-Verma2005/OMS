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
      <div className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl anim-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl anim-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="text-center space-y-8 mb-20 relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8 anim-fade-in">
            <Sparkles className="w-5 h-5 text-primary anim-glow-pulse" />
            <span className="text-sm font-medium text-primary">Next-Gen Publisher Platform</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-tight anim-page-in">
            Publisher Directory
            <span className="block text-5xl md:text-7xl mt-4 bg-gradient-primary bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed anim-fade-in" style={{animationDelay: '0.2s'}}>
            Discover premium publishers with cutting-edge analytics. Access real-time domain authority, 
            traffic insights, competitive pricing, and advanced publishing requirements—all in one powerful platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 anim-fade-in" style={{animationDelay: '0.4s'}}>
            {isAuthenticated ? (
              <>
                <Link href="/data">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                    <Search className="w-5 h-5 mr-2" />
                    Explore Publishers
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent/50 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-accent/50 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105 px-8 py-4 text-lg">
                    <Users className="w-5 h-5 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 stagger-children">
          <Card className="card-modern hover-lift group anim-card-in">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-foreground text-xl mb-4 group-hover:text-primary transition-colors duration-300">AI-Powered Search</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Advanced filtering with machine learning algorithms to find the perfect publishers based on domain authority, traffic patterns, and ROI potential.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift group anim-card-in">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-foreground text-xl mb-4 group-hover:text-accent transition-colors duration-300">Real-Time Analytics</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Live performance metrics including DA, PA, DR scores, spam analysis, traffic trends, and predictive analytics for campaign success.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift group anim-card-in md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-foreground text-xl mb-4 group-hover:text-primary transition-colors duration-300">Global Network</CardTitle>
              <CardDescription className="text-muted-foreground text-base leading-relaxed">
                Worldwide publisher network spanning 50+ countries and 15+ languages, with localized insights and cultural targeting capabilities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Enhanced Stats Section */}
        <div className="relative">
          <Card className="card-gradient shadow-modern-xl rounded-3xl overflow-hidden anim-scale-in">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8 mx-auto anim-fade-in">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Platform Performance</span>
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold text-foreground mb-6 anim-fade-in" style={{animationDelay: '0.2s'}}>
                Trusted by Industry Leaders
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg max-w-2xl mx-auto anim-fade-in" style={{animationDelay: '0.4s'}}>
                Comprehensive analytics and insights across our growing publisher ecosystem
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-children">
                <div className="text-center group anim-card-in">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    2.5K+
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">Active Publishers</div>
                  <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group anim-card-in">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    85+
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">Global Markets</div>
                  <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group anim-card-in">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    25+
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">Languages</div>
                  <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="text-center group anim-card-in">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                    50+
                  </div>
                  <div className="text-muted-foreground text-sm uppercase tracking-wider font-medium">Industry Verticals</div>
                  <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 space-y-8 anim-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Ready to Transform Your Campaigns?
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Join thousands of marketers who trust OMS for their publisher discovery and campaign optimization.
          </p>
          {!isAuthenticated && (
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-modern hover:shadow-modern-lg transition-all duration-300 hover:scale-105 px-10 py-4 text-lg">
                <Zap className="w-6 h-6 mr-3" />
                Get Started Free
              </Button>
            </Link>
          )}
        </div>
      </div>
    </PageLayout>
  )
}