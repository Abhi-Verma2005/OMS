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
      <div className="h-screen bg-white dark:bg-gray-950 flex overflow-hidden">
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
          <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
            <MobileSidebar />
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">OMS</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </header>
          
          {/* Desktop Header with Sidebar Toggle */}
          <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isSidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </Button>
              {showBreadcrumbs && <Breadcrumbs />}
            </div>
          </header>
          
          <main className={`flex-1 px-4 py-6 overflow-y-auto ${className}`}>
            {children}
          </main>
        </div>
      </div>
    )
  }

  // Fallback to original layout for landing page
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <MainNav />
      <main className={`mx-auto max-w-7xl px-4 py-6 ${className}`}>
        {showBreadcrumbs && <Breadcrumbs />}
        {children}
      </main>
    </div>
  )
}
