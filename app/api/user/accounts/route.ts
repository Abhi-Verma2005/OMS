import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's linked accounts
    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        provider: true,
        type: true,
        providerAccountId: true,
        createdAt: true
      }
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error("Error fetching user accounts:", error)
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    )
  }
}
