import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching user orders...')
    const session = await auth()
    
    if (!session?.user?.id) {
      console.log('❌ No session or user ID found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('👤 User ID:', session.user.id)
    console.log('👤 User Email:', session.user.email)

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
        transactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('📦 Found orders:', orders.length)
    console.log('📋 Orders data:', JSON.stringify(orders, null, 2))

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('❌ Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}