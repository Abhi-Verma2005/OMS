"use client"

import { ReactNode, useState } from "react"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Sidebar, MobileSidebar } from "@/components/navigation/sidebar"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface PageLayoutProps {
  children: ReactNode
  showBreadcrumbs?: boolean
  className?: string
  useSidebar?: boolean
}

export function PageLayout({ 
  children, 
  showBreadcrumbs = true, 
  className = "",
  useSidebar
}: PageLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Use sidebar for all pages except landing page, unless explicitly disabled
  const shouldUseSidebar = (useSidebar === undefined || useSidebar === true) && !isLandingPage
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (shouldUseSidebar) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebar}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-xl flex-shrink-0 shadow-modern">
            <MobileSidebar />
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">OMS</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </header>
          
          {/* Desktop Header with Sidebar Toggle */}
          <header className="hidden md:flex h-16 items-center px-6 border-b border-border bg-background/80 backdrop-blur-xl flex-shrink-0 shadow-modern">
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2 hover:bg-accent/50 rounded-xl transition-all duration-300 flex-shrink-0 hover:scale-105"
              >
                {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </Button>
              <div className="w-px h-6 bg-border flex-shrink-0" />
              {showBreadcrumbs && (
                <div className="flex-1 min-w-0">
                  <Breadcrumbs />
                </div>
              )}
            </div>
          </header>
          
          <main className={`flex-1 px-6 py-8 overflow-y-auto ${className}`}>
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Fallback to original layout for landing page
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className={`mx-auto max-w-7xl px-6 py-8 ${className}`}>
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
      </main>
    </div>
  )
}
