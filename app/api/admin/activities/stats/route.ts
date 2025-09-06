import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ActivityLogger } from '@/lib/activity-logger';

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
    const userId = searchParams.get('userId') || undefined;
    const days = parseInt(searchParams.get('days') || '30');

    const stats = await ActivityLogger.getActivityStats(userId, days);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
