import { UserRole } from "@prisma/client"

export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  roles?: string[]
  permissions?: string[]
  isAdmin?: boolean
  emailVerified?: Date | null
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface AuthError {
  type: string
  message: string
}

export interface AuthConfig {
  providers: any[]
  callbacks: {
    session: (params: { session: any; user: any }) => any
    authorized: (params: { auth: any; request: { nextUrl: URL } }) => boolean
  }
  pages: {
    signIn: string
    error: string
  }
  session: {
    strategy: "database" | "jwt"
  }
}

export interface PasskeyCredential {
  id: string
  rawId: string
  response: {
    attestationObject: string
    clientDataJSON: string
  }
  type: "public-key"
}

export interface MfaSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}
