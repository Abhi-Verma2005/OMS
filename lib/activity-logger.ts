import { prisma } from './db';
import { ActivityCategory } from '@prisma/client';

export interface ActivityLogData {
  userId: string;
  activity: string;
  category: ActivityCategory;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogger {
  /**
   * Log a user activity
   */
  static async log(data: ActivityLogData): Promise<void> {
    try {
      await prisma.userActivity.create({
        data: {
          userId: data.userId,
          activity: data.activity,
          category: data.category,
          description: data.description,
          metadata: data.metadata ? JSON.stringify(data.metadata) : null,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Log authentication activities
   */
  static async logAuth(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'AUTHENTICATION',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log navigation activities
   */
  static async logNavigation(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'NAVIGATION',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log order activities
   */
  static async logOrder(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'ORDER',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log payment activities
   */
  static async logPayment(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'PAYMENT',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log cart activities
   */
  static async logCart(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'CART',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log profile activities
   */
  static async logProfile(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'PROFILE',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log admin activities
   */
  static async logAdmin(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'ADMIN',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log API activities
   */
  static async logApi(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'API',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log error activities
   */
  static async logError(
    userId: string,
    activity: string,
    description?: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      userId,
      activity,
      category: 'ERROR',
      description,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Get user activities with pagination
   */
  static async getUserActivities(
    userId: string,
    page: number = 1,
    limit: number = 50,
    category?: ActivityCategory
  ) {
    const skip = (page - 1) * limit;
    
    const where = {
      userId,
      ...(category && { category }),
    };

    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.userActivity.count({ where }),
    ]);

    return {
      activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all activities for admin with pagination and filters
   */
  static async getAllActivities(
    page: number = 1,
    limit: number = 50,
    category?: ActivityCategory,
    userId?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (search) {
      where.OR = [
        { activity: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.userActivity.count({ where }),
    ]);

    return {
      activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get activity statistics
   */
  static async getActivityStats(
    userId?: string,
    days: number = 30
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where: any = {
      createdAt: {
        gte: startDate,
      },
    };

    if (userId) {
      where.userId = userId;
    }

    const [totalActivities, categoryStats, recentActivities] = await Promise.all([
      prisma.userActivity.count({ where }),
      prisma.userActivity.groupBy({
        by: ['category'],
        where,
        _count: {
          category: true,
        },
      }),
      prisma.userActivity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      totalActivities,
      categoryStats: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.category,
      })),
      recentActivities,
    };
  }
}

/**
 * Helper function to extract IP address and user agent from request
 */
export function extractRequestInfo(request: Request) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Helper function to extract IP address and user agent from Next.js request
 */
export function extractNextRequestInfo(request: any) {
  const ipAddress = request?.ip || 
                   request?.headers?.['x-forwarded-for'] || 
                   request?.headers?.['x-real-ip'] || 
                   'unknown';
  const userAgent = request?.headers?.['user-agent'] || 'unknown';
  
  return { ipAddress, userAgent };
}
