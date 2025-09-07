'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/auth/user-menu';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Search - Hidden on mobile */}
        <div className="hidden md:flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, roles, permissions..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Mobile Title */}
        <div className="md:hidden flex items-center">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
