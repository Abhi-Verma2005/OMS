"use server"

import { auth, signIn, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function signUpAction(data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) {
  const validatedFields = signUpSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid input data",
    }
  }

  const { name, email, password } = validatedFields.data

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: "User with this email already exists",
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      error: "Failed to create account. Please try again.",
    }
  }
}

export async function signInAction(formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn("resend", {
      email,
      password,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Something went wrong",
    }
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return session.user
}

export async function requireAdmin() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  const userRole = (session.user as any)?.role
  
  if (userRole !== "ADMIN") {
    redirect("/dashboard")
  }
  
  return session.user
}
