import { UserRole } from "@prisma/client"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      AUTH_SECRET: string
      AUTH_URL: string
      AUTH_GOOGLE_ID: string
      AUTH_GOOGLE_SECRET: string
      AUTH_DISCORD_ID: string
      AUTH_DISCORD_SECRET: string
      AUTH_RESEND_KEY: string
      AUTH_EMAIL_FROM: string
      AUTH_WEBAUTHN_RP_ID?: string
      AUTH_WEBAUTHN_RP_NAME?: string
      AUTH_RATE_LIMIT_MAX?: string
      AUTH_RATE_LIMIT_WINDOW?: string
    }
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      roles: string[]
      permissions: string[]
      isAdmin: boolean
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: string[]
    permissions: string[]
    isAdmin: boolean
  }
}

export {}
