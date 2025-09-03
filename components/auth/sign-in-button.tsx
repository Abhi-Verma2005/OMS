"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SignInButtonProps {
  provider: "google" | "discord"
  children?: React.ReactNode
  className?: string
}

export function SignInButton({ 
  provider, 
  children, 
  className = "w-full" 
}: SignInButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    startTransition(() => {
      signIn(provider, { callbackUrl: "/dashboard" })
    })
  }

  const providerConfig = {
    google: {
      name: "Google",
      icon: "🔍",
    },
    discord: {
      name: "Discord", 
      icon: "🎮",
    },
  }

  const config = providerConfig[provider]

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      disabled={isPending}
      className={className}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <span className="mr-2">{config.icon}</span>
      )}
      {children || `Continue with ${config.name}`}
    </Button>
  )
}
