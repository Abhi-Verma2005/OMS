"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Calendar, Shield, Link as LinkIcon, CheckCircle, AlertCircle } from "lucide-react"
import { prisma } from "@/lib/db"

interface ProfileContentProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface Account {
  id: string
  provider: string
  type: string
  providerAccountId: string
}

export function ProfileContent({ user }: ProfileContentProps) {
  const { data: session, update } = useSession()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLinkedAccounts()
  }, [])

  const fetchLinkedAccounts = async () => {
    try {
      const response = await fetch('/api/user/accounts')
      if (response.ok) {
        const data = await response.json()
        setAccounts(data.accounts || [])
      } else {
        setError('Failed to fetch linked accounts')
      }
    } catch (err) {
      setError('Failed to fetch linked accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkAccount = async (provider: string) => {
    try {
      await signIn(provider, { 
        callbackUrl: '/profile',
        redirect: false 
      })
      // Refresh the session and accounts after linking
      await update()
      fetchLinkedAccounts()
    } catch (err) {
      setError(`Failed to link ${provider} account`)
    }
  }

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case 'google':
        return { name: 'Google', color: 'bg-blue-500', icon: '🔍' }
      case 'discord':
        return { name: 'Discord', color: 'bg-indigo-500', icon: '💬' }
      case 'credentials':
        return { name: 'Email/Password', color: 'bg-gray-500', icon: '📧' }
      default:
        return { name: provider, color: 'bg-gray-500', icon: '🔗' }
    }
  }

  const isAccountLinked = (provider: string) => {
    return accounts.some(account => account.provider === provider)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and linked authentication methods
        </p>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your basic account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || ''} 
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium">{user.name || 'No name set'}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Linked Accounts
          </CardTitle>
          <CardDescription>
            Manage your authentication methods and linked accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {['google', 'discord', 'credentials'].map((provider) => {
                const providerInfo = getProviderInfo(provider)
                const isLinked = isAccountLinked(provider)
                
                return (
                  <div 
                    key={provider}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full ${providerInfo.color} flex items-center justify-center text-white text-sm`}>
                        {providerInfo.icon}
                      </div>
                      <div>
                        <p className="font-medium">{providerInfo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {isLinked ? 'Linked' : 'Not linked'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLinked ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Linked
                        </Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLinkAccount(provider)}
                          disabled={provider === 'credentials'}
                        >
                          Link Account
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Linking multiple accounts allows you to sign in using any of your linked methods. 
              This is especially useful if you want to use Google or Discord for quick sign-ins while keeping your email/password as a backup.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
