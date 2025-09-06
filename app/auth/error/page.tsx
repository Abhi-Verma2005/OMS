import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ErrorPageProps {
  searchParams: {
    error?: string
  }
}

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  OAuthAccountNotLinked: "An account with this email already exists. Please sign in with your password first, then you can link your Google account in your profile settings.",
  OAuthCallback: "There was an issue with the OAuth callback. This might be due to browser security policies. Please try using a different browser or incognito mode.",
  Default: "An error occurred during authentication.",
}

export default function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const error = searchParams.error as keyof typeof errorMessages
  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground">Something went wrong during sign in</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>
              We encountered an issue while trying to sign you in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              {error === 'OAuthAccountNotLinked' ? (
                <>
                  <Button asChild>
                    <Link href="/auth/signin">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Sign in with Password
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signup">
                      Create New Account
                    </Link>
                  </Button>
                </>
              ) : error === 'OAuthCallback' ? (
                <>
                  <div className="text-sm text-muted-foreground mb-4 space-y-2">
                    <p><strong>If you're seeing a "disallowed_useragent" error:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Try using a different browser (Chrome, Firefox, Safari)</li>
                      <li>Use incognito/private browsing mode</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Disable browser extensions temporarily</li>
                    </ul>
                  </div>
                  <Button asChild>
                    <Link href="/auth/signin">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Try Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signin">
                      Sign in with Email Instead
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild>
                    <Link href="/auth/signin">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Try Again
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/">
                      Go Home
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
