"use client"

import { useState, useTransition } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { useActivityLogger } from "@/hooks/use-activity-logger"

interface SignOutButtonProps {
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function SignOutButton({ 
  children, 
  variant = "ghost",
  size = "default",
  className 
}: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { logAuth } = useActivityLogger()

  const handleSignOut = () => {
    // Log sign out activity
    logAuth(
      'USER_SIGNOUT',
      'User signed out of the application'
    )
    
    startTransition(() => {
      signOut({ callbackUrl: "/" })
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {children && <span className="ml-2">{children}</span>}
    </Button>
  )
}
