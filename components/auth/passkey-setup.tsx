"use client"

import { useState, useTransition } from "react"
import { startRegistration } from "@simplewebauthn/browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, CheckCircle } from "lucide-react"

export function PasskeySetup() {
  const [isPending, startTransition] = useTransition()
  const [passkeyName, setPasskeyName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePasskeyRegistration = async () => {
    if (!passkeyName.trim()) {
      setError("Please enter a name for your passkey")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        
        // Get registration options from server
        const response = await fetch("/api/auth/passkey/register/begin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: passkeyName }),
        })

        if (!response.ok) {
          throw new Error("Failed to start passkey registration")
        }

        const options = await response.json()

        // Start WebAuthn registration
        const credential = await startRegistration(options)

        // Complete registration on server
        const completeResponse = await fetch("/api/auth/passkey/register/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: passkeyName,
            credential,
          }),
        })

        if (!completeResponse.ok) {
          throw new Error("Failed to complete passkey registration")
        }

        setSuccess(true)
        setPasskeyName("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to register passkey")
      }
    })
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Passkey Registered
          </CardTitle>
          <CardDescription>
            Your passkey has been successfully registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You can now use your passkey to sign in securely without a password.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Set Up Passkey
        </CardTitle>
        <CardDescription>
          Add a passkey for secure, passwordless authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="passkey-name">Passkey Name</Label>
          <Input
            id="passkey-name"
            placeholder="e.g., My iPhone, Work Laptop"
            value={passkeyName}
            onChange={(e) => setPasskeyName(e.target.value)}
            disabled={isPending}
          />
        </div>

        <Button 
          onClick={handlePasskeyRegistration} 
          disabled={isPending || !passkeyName.trim()}
          className="w-full"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Register Passkey
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Passkeys use biometric authentication or device PIN for secure sign-in.
        </p>
      </CardContent>
    </Card>
  )
}
