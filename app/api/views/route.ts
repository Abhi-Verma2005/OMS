import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const views = await (prisma as any).savedView.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, filters: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ views })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const name = (body?.name ?? "").trim()
  const filters = body?.filters

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 })
  }
  if (filters === undefined || filters === null || typeof filters !== "object") {
    return NextResponse.json({ error: "Filters object is required" }, { status: 400 })
  }

  // Upsert by unique (userId, name)
  const saved = await prisma.savedView.upsert({
    where: { userId_name: { userId: session.user.id, name } },
    update: { filters },
    create: { userId: session.user.id, name, filters },
    select: { id: true, name: true, filters: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ view: saved }, { status: 201 })
}


