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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-modern group-hover:shadow-modern-lg transition-all duration-300 group-hover:scale-105">
                <FileStack className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                OMS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-modern hover:shadow-modern-lg hover:scale-105"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105"
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
          <div className="flex items-center gap-3">
            {isAuthenticated && !isAdmin && (
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative p-3 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-modern">
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
