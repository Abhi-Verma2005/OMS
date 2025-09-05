import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./db"
import * as bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import type { UserRole } from "@prisma/client"

export const config = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID!,
      clientSecret: process.env.AUTH_DISCORD_SECRET!,
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
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !(user as any).password) {
          return null
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(credentials.password as string, (user as any).password)
        
        if (!isPasswordValid) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Fetch user roles when user first signs in
        const userWithRoles = await (prisma as any).user.findUnique({
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
          const roles = userWithRoles.userRoles.map((ur: any) => ur.role.name);
          const permissions = userWithRoles.userRoles.flatMap((ur: any) => 
            ur.role.rolePermissions.map((rp: any) => rp.permission.name)
          );
          
          token.roles = roles;
          token.permissions = permissions;
          token.isAdmin = roles.includes('admin');
        }
      }
      return token
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
        roles: token.roles as string[],
        permissions: token.permissions as string[],
        isAdmin: token.isAdmin as boolean,
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
