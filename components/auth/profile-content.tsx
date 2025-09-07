"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Calendar, Shield, Link as LinkIcon, CheckCircle, AlertCircle, Building2, Globe, Target, MapPin } from "lucide-react"
import { prisma } from "@/lib/db"

interface ProfileContentProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

interface BusinessProfile {
  company?: string
  website?: string
  niche?: string
  country?: string
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
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    company: '',
    website: '',
    niche: '',
    country: ''
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  useEffect(() => {
    fetchLinkedAccounts()
    fetchBusinessProfile()
  }, [])

  const fetchBusinessProfile = async () => {
    try {
      const response = await fetch('/api/user/business-profile')
      if (response.ok) {
        const data = await response.json()
        setBusinessProfile(data.profile || {})
      }
    } catch (err) {
      console.error('Failed to fetch business profile:', err)
    }
  }

  const handleBusinessProfileUpdate = async () => {
    setProfileLoading(true)
    setProfileSuccess(false)
    try {
      const response = await fetch('/api/user/business-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessProfile),
      })
      
      if (response.ok) {
        setProfileSuccess(true)
        setTimeout(() => setProfileSuccess(false), 3000)
      } else {
        setError('Failed to update business profile')
      }
    } catch (err) {
      setError('Failed to update business profile')
    } finally {
      setProfileLoading(false)
    }
  }

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

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <CardDescription>
            Help us personalize your experience with business details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profileSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Business profile updated successfully!</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Name
              </Label>
              <Input
                id="company"
                placeholder="Enter your company name"
                value={businessProfile.company || ''}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                id="website"
                placeholder="https://yourcompany.com"
                value={businessProfile.website || ''}
                onChange={(e) => setBusinessProfile(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niche" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Industry/Niche
              </Label>
              <Select 
                value={businessProfile.niche || ''} 
                onValueChange={(value) => setBusinessProfile(prev => ({ ...prev, niche: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Country
              </Label>
              <Select 
                value={businessProfile.country || ''} 
                onValueChange={(value) => setBusinessProfile(prev => ({ ...prev, country: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="uae">UAE</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleBusinessProfileUpdate}
              disabled={profileLoading}
              className="min-w-[120px]"
            >
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Why we need this information:</strong> This helps us provide you with more relevant publisher recommendations and personalized campaign suggestions based on your industry and location.
            </p>
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
