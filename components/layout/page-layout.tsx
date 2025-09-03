"use client"

import { ReactNode } from "react"
import { MainNav } from "@/components/navigation/main-nav"
import { Breadcrumbs } from "@/components/navigation/breadcrumbs"

interface PageLayoutProps {
  children: ReactNode
  showBreadcrumbs?: boolean
  className?: string
}

export function PageLayout({ 
  children, 
  showBreadcrumbs = true, 
  className = "" 
}: PageLayoutProps) {
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
