import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./db"
import { ActivityLogger } from "./activity-logger"
import * as bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import type { UserRole } from "@prisma/client"

export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.AUTH_EMAIL_FROM!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user) {
            console.log("User not found:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("User has no password set")
            return null
          }

          // Verify the password
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
          
          if (!isPasswordValid) {
            console.log("Invalid password for user:", credentials.email)
            return null
          }
          
          console.log("Authentication successful for user:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Allow all sign-ins - account linking is handled by allowDangerousEmailAccountLinking
      return true;
    },
    jwt: async ({ token, user, trigger, account }) => {
      if (user) {
        try {
          // Fetch user roles when user first signs in
          const userWithRoles = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              userRoles: {
                where: { isActive: true },
                include: {
                  role: {
                    include: {
                      rolePermissions: {
                        include: {
                          permission: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });

          if (userWithRoles) {
            const roles = userWithRoles.userRoles.map((ur) => ur.role.name);
            const permissions = userWithRoles.userRoles.flatMap((ur) => 
              ur.role.rolePermissions.map((rp) => rp.permission.name)
            );
            
            token.roles = roles;
            token.permissions = permissions;
            token.isAdmin = roles.includes('admin');

            // Log sign in activity
            await ActivityLogger.logAuth(
              user.id,
              'USER_SIGNIN',
              `User signed in via ${user.email}`,
              {
                provider: account?.provider || 'credentials',
                roles: roles,
                isAdmin: roles.includes('admin')
              }
            );
          }
        } catch (error) {
          console.error('Error fetching user roles in JWT callback:', error);
          token.roles = [];
          token.permissions = [];
          token.isAdmin = false;
        }
      }
      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
        roles: (token.roles as string[]) || [],
        permissions: (token.permissions as string[]) || [],
        isAdmin: (token.isAdmin as boolean) || false,
      },
    }),
    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      
      if (isOnAdmin) {
        if (isLoggedIn && (auth.user as any)?.isAdmin) return true
        return false // Redirect unauthenticated users to login page
      }
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
