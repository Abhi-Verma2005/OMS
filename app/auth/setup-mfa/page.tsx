import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MfaSetup } from "@/components/auth/mfa-setup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserMenu } from "@/components/auth/user-menu"
import { Shield } from "lucide-react"
import { generateSecret, generateBackupCodes } from "@/lib/mfa-utils"

export default async function SetupMfaPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const user = session.user
  const userRole = (user as any)?.role

  // Generate MFA setup data
  const secret = generateSecret()
  const backupCodes = generateBackupCodes()
  
  // Generate QR code URL
  const qrCodeUrl = `otpauth://totp/OMS:${user.email}?secret=${secret}&issuer=OMS`

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Security Settings</h1>
          <UserMenu />
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Set Up Two-Factor Authentication</h2>
            <p className="text-muted-foreground">
              Add an extra layer of security to your account with MFA.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Why Enable MFA?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Protects your account even if your password is compromised</li>
                <li>• Required for admin accounts and sensitive operations</li>
                <li>• Industry standard for secure authentication</li>
                <li>• Easy to set up with your smartphone</li>
              </ul>
            </CardContent>
          </Card>
          
          <Suspense fallback={<div>Loading MFA setup...</div>}>
            <MfaSetup 
              secret={secret}
              qrCodeUrl={qrCodeUrl}
              backupCodes={backupCodes}
            />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
