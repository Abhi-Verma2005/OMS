import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ActivityLogger, extractRequestInfo } from '@/lib/activity-logger';
import { ActivityCategory } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { activity, category, description, metadata } = body;

    if (!activity || !category) {
      return NextResponse.json(
        { error: 'Activity and category are required' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories: ActivityCategory[] = [
      'AUTHENTICATION',
      'NAVIGATION',
      'ORDER',
      'PAYMENT',
      'CART',
      'PROFILE',
      'ADMIN',
      'API',
      'ERROR',
      'OTHER'
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const { ipAddress, userAgent } = extractRequestInfo(request);

    await ActivityLogger.log({
      userId: session.user.id,
      activity,
      category,
      description,
      metadata,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
