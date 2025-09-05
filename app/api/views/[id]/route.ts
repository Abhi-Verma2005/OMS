import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const existing = await (prisma as any).savedView.findUnique({ where: { id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await (prisma as any).savedView.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}


