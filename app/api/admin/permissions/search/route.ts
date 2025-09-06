import { NextRequest, NextResponse } from 'next/server';
import { requireAdminForAPI } from '@/lib/rbac';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await requireAdminForAPI();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build search conditions
    const where: any = {};
    
    if (search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { resource: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          resource: true,
          action: true,
          createdAt: true,
          _count: {
            select: {
              rolePermissions: true
            }
          }
        },
        orderBy: [
          { resource: 'asc' },
          { action: 'asc' }
        ],
        skip,
        take: limit,
      }),
      prisma.permission.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      results: permissions,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error('Error searching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to search permissions' },
      { status: 500 }
    );
  }
}
