"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

const pathLabels: Record<string, string> = {
  "/": "Home",
  "/data": "Publishers",
  "/dashboard": "Dashboard",
  "/admin": "Admin",
  "/auth/signin": "Sign In",
  "/auth/signup": "Sign Up",
  "/auth/setup-mfa": "Setup MFA",
  "/auth/verify-email": "Verify Email",
  "/auth/error": "Auth Error",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on home page
  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
  ]

  let currentPath = ""
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === pathSegments.length - 1
    
    // Use custom label if available, otherwise capitalize the segment
    const label = pathLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    })
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-gray-900 dark:text-white font-medium">
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
