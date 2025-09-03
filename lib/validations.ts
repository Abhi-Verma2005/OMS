import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const userRoleSchema = z.enum(["USER", "ADMIN", "MODERATOR"])

export const mfaSetupSchema = z.object({
  secret: z.string(),
  token: z.string().length(6, "Token must be 6 digits"),
})

export const passkeyRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  credential: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      attestationObject: z.string(),
      clientDataJSON: z.string(),
    }),
    type: z.literal("public-key"),
  }),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type MfaSetupInput = z.infer<typeof mfaSetupSchema>
export type PasskeyRegistrationInput = z.infer<typeof passkeyRegistrationSchema>
