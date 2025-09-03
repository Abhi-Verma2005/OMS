"use client"

import { useSession } from "next-auth/react"
import useSWR from "swr"

export function useSessionData() {
  const { data: session, status, update } = useSession()

  // Use SWR for additional caching and real-time updates
  const { data: sessionData, error, mutate } = useSWR(
    session ? "/api/auth/session" : null,
    async () => {
      const response = await fetch("/api/auth/session")
      if (!response.ok) throw new Error("Failed to fetch session")
      return response.json()
    },
    {
      refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  )

  return {
    session: sessionData || session,
    status,
    isLoading: status === "loading",
    error,
    update: async () => {
      await update()
      await mutate()
    },
  }
}
