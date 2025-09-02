import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileStack, Filter, BarChart3, Globe, Search, TrendingUp } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileStack className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">OMS</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white">
            Publisher Directory
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Find and filter high-quality publishers for your campaigns. Access comprehensive data on domain authority, traffic metrics, pricing, and publishing requirements.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/data">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Filter className="w-5 h-5 mr-2" />
                Explore Publishers
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Advanced Filtering</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Filter by domain authority, traffic, pricing, and publishing requirements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Comprehensive data on DA, PA, DR, spam scores, and traffic trends
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-slate-900 dark:text-white">Global Reach</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Publishers from multiple countries and languages for diverse campaigns
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Platform Statistics
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Comprehensive data on thousands of publishers
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Publishers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">50+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">15+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">25+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Niches</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
