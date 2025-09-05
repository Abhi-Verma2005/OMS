"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Filter, BarChart3, Shield, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

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

export function MobileNav() {
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
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col space-y-6 mt-8">
          {/* User Info */}
          {isAuthenticated && (
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-900" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name || session.user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-yellow-400 text-gray-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Auth Links for non-authenticated users */}
          {!isAuthenticated && (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/auth/signin"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
