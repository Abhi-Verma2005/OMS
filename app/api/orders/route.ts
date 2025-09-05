import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Create an order
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { items, currency = 'USD' } = body as {
      items: Array<{ siteId: string; siteName: string; priceCents: number; withContent?: boolean; quantity?: number }>
      currency?: string
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const totalAmount = items.reduce((sum, it) => sum + (it.priceCents * (it.quantity ?? 1)), 0)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        currency,
        items: {
          create: items.map((it) => ({
            siteId: it.siteId,
            siteName: it.siteName,
            priceCents: it.priceCents,
            withContent: Boolean(it.withContent),
            quantity: it.quantity ?? 1,
          }))
        }
      },
      include: { items: true }
    })

    // Create a pending transaction record
    const tx = await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        currency: order.currency,
        status: 'INITIATED',
        provider: 'offline',
      }
    })

    return NextResponse.json({ order, transaction: tx }, { status: 201 })
  } catch (err) {
    console.error('Create order error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// Mark order as paid (simulate payment success)
export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { orderId, reference } = body as { orderId: string; reference?: string }
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.user.id } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const updated = await prisma.$transaction(async (tx) => {
      const paidOrder = await tx.order.update({ where: { id: order.id }, data: { status: 'PAID' } })
      await tx.transaction.updateMany({
        where: { orderId: order.id },
        data: { status: 'SUCCESS', reference: reference ?? undefined }
      })
      return paidOrder
    })

    return NextResponse.json({ order: updated }, { status: 200 })
  } catch (err) {
    console.error('Mark paid error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


