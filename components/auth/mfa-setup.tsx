"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, Smartphone, Copy, CheckCircle } from "lucide-react"
import QRCode from "qrcode"

interface MfaSetupProps {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export function MfaSetup({ secret, qrCodeUrl, backupCodes }: MfaSetupProps) {
  const [isPending, startTransition] = useTransition()
  const [token, setToken] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copiedCode, setCopiedCode] = useState<number | null>(null)

  const handleVerifyToken = async () => {
    if (!token.trim()) {
      setError("Please enter the 6-digit code")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        
        const response = await fetch("/api/auth/mfa/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          throw new Error("Invalid token")
        }

        setSuccess(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify token")
      }
    })
  }

  const copyBackupCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(index)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            MFA Enabled
          </CardTitle>
          <CardDescription>
            Two-factor authentication has been successfully enabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your account is now protected with two-factor authentication.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Set Up Authenticator App
          </CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Or enter this code manually:
              </p>
              <code className="block p-2 bg-muted rounded text-sm font-mono">
                {secret}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify Setup</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="token">Verification Code</Label>
            <Input
              id="token"
              placeholder="000000"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isPending}
              maxLength={6}
            />
          </div>

          <Button 
            onClick={handleVerifyToken} 
            disabled={isPending || token.length !== 6}
            className="w-full"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Enable MFA
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup Codes</CardTitle>
          <CardDescription>
            Save these codes in a secure location. Each code can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <code className="text-sm font-mono">{code}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyBackupCode(code, index)}
                  className="h-6 w-6 p-0"
                >
                  {copiedCode === index ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <Alert className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Store these backup codes in a safe place. You'll need them if you lose access to your authenticator app.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
