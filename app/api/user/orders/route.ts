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

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    console.log('📄 Pagination params:', { page, limit, skip })

    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: {
        userId: session.user.id,
      },
    })

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
      skip,
      take: limit,
    })

    const hasMore = skip + orders.length < totalCount

    console.log('📦 Found orders:', orders.length)
    console.log('📊 Total count:', totalCount)
    console.log('📄 Has more:', hasMore)

    return NextResponse.json({ 
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        hasMore,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching user orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}