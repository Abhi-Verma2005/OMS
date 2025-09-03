"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { FileStack, Home, BarChart3, Shield, Filter, Menu, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  adminOnly?: boolean
}

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Publishers",
    href: "/data",
    icon: Filter,
    requiresAuth: true,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    requiresAuth: true,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: Shield,
    requiresAuth: true,
    adminOnly: true,
  },
]

interface SidebarProps {
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAuthenticated = !!session

  const filteredNavigation = navigation.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.adminOnly && userRole !== "ADMIN") return false
    return true
  })

  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-6 flex-shrink-0">
        <div className="flex items-center gap-3 w-full">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileStack className="w-4 h-4 text-gray-900" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                OMS
              </span>
            )}
          </Link>
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="ml-auto p-1 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full h-12 transition-all duration-200",
                  isCollapsed ? "justify-center px-2" : "justify-start gap-3",
                  isActive
                    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section with user menu and theme toggle */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2 flex-shrink-0">
        <div className={cn("flex", isCollapsed ? "justify-center" : "flex-col space-y-2")}>
          <UserMenu />
          <div className={cn("flex", isCollapsed ? "justify-center" : "justify-center")}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile sidebar component
export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role
  const isAuthenticated = !!session

  const filteredNavigation = navigation.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.adminOnly && userRole !== "ADMIN") return false
    return true
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-800 px-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <FileStack className="w-4 h-4 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                OMS
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-12",
                      isActive
                        ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section with user menu and theme toggle */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
            <UserMenu />
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
