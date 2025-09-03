"use client"

import { useSession } from "next-auth/react"
import { use } from "react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    role: (session?.user as any)?.role,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  }
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return { user: null, isLoading: true, isAuthenticated: false }
  }

  if (!isAuthenticated) {
    throw new Error("Authentication required")
  }

  return { user, isLoading: false, isAuthenticated: true }
}
