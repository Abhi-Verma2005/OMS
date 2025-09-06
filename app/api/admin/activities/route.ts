import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ActivityLogger } from '@/lib/activity-logger';
import { ActivityCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category') as ActivityCategory | null;
    const userId = searchParams.get('userId') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await ActivityLogger.getAllActivities(
      page,
      limit,
      category || undefined,
      userId,
      search
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
