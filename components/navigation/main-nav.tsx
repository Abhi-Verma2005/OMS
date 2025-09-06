"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/auth/user-menu"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { FileStack, Home, BarChart3, Shield, Filter, ShoppingCart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCart } from "@/contexts/cart-context"

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  adminOnly?: boolean
  userOnly?: boolean // Only show to regular users, not admins
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
    userOnly: true, // Only show to regular users, not admins
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

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { getTotalItems } = useCart()
  const userRole = (session?.user as any)?.role
  const isAdmin = (session?.user as any)?.isAdmin
  const isAuthenticated = !!session
  const cartItemCount = getTotalItems()

  const filteredNavigation = navigation.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) return false
    if (item.adminOnly && !isAdmin) return false
    if (item.userOnly && isAdmin) return false // Hide user-only features from admins
    return true
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <FileStack className="w-4 h-4 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                OMS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2",
                      isActive
                        ? "bg-yellow-400 hover:bg-yellow-300 text-gray-900"
                        : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && !isAdmin && (
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            {isAuthenticated && <MobileNav />}
            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
