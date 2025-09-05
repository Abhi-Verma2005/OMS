import { NextRequest, NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Get existing authenticators for the user
    const existingAuthenticators = await prisma.authenticator.findMany({
      where: { userId: session.user.id },
    })

    const options = await generateRegistrationOptions({
      rpName: process.env.AUTH_WEBAUTHN_RP_NAME || "OMS - Publisher Directory",
      rpID: process.env.AUTH_WEBAUTHN_RP_ID || "localhost",
      userID: session.user.id,
      userName: session.user.email || session.user.name || "user",
      userDisplayName: session.user.name || session.user.email || "User",
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred",
        residentKey: "preferred",
      },
      supportedAlgorithmIDs: [-7, -257],
      excludeCredentials: existingAuthenticators.map((auth) => ({
        id: auth.credentialID,
        type: "public-key",
        transports: auth.transports ? auth.transports.split(",") as any : undefined,
      })),
    })

    // Store challenge in session or database
    // For simplicity, we'll store it in a temporary way
    // In production, use a proper session store or database
    return NextResponse.json(options)
  } catch (error) {
    console.error("Passkey registration begin error:", error)
    return NextResponse.json(
      { error: "Failed to start passkey registration" },
      { status: 500 }
    )
  }
}
