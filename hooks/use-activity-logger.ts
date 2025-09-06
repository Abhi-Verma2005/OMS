'use client';

import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { ActivityCategory } from '@prisma/client';

interface ActivityLogData {
  activity: string;
  category: ActivityCategory;
  description?: string;
  metadata?: Record<string, any>;
}

export function useActivityLogger() {
  const { data: session } = useSession();

  const logActivity = useCallback(async (data: ActivityLogData) => {
    if (!session?.user?.id) {
      console.warn('Cannot log activity: User not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/activity/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error('Failed to log activity:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [session?.user?.id]);

  const logAuth = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'AUTHENTICATION',
      description,
      metadata,
    });
  }, [logActivity]);

  const logNavigation = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'NAVIGATION',
      description,
      metadata,
    });
  }, [logActivity]);

  const logOrder = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'ORDER',
      description,
      metadata,
    });
  }, [logActivity]);

  const logPayment = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'PAYMENT',
      description,
      metadata,
    });
  }, [logActivity]);

  const logCart = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'CART',
      description,
      metadata,
    });
  }, [logActivity]);

  const logProfile = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'PROFILE',
      description,
      metadata,
    });
  }, [logActivity]);

  const logAdmin = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'ADMIN',
      description,
      metadata,
    });
  }, [logActivity]);

  const logApi = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'API',
      description,
      metadata,
    });
  }, [logActivity]);

  const logError = useCallback((activity: string, description?: string, metadata?: Record<string, any>) => {
    return logActivity({
      activity,
      category: 'ERROR',
      description,
      metadata,
    });
  }, [logActivity]);

  return {
    logActivity,
    logAuth,
    logNavigation,
    logOrder,
    logPayment,
    logCart,
    logProfile,
    logAdmin,
    logApi,
    logError,
  };
}
