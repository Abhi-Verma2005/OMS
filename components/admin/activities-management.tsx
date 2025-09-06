'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Filter, Download, Eye, Calendar, User, Activity } from 'lucide-react';
type ActivityCategory = 'AUTHENTICATION' | 'NAVIGATION' | 'ORDER' | 'PAYMENT' | 'CART' | 'PROFILE' | 'ADMIN' | 'API' | 'ERROR' | 'OTHER';

interface UserActivity {
  id: string;
  activity: string;
  category: ActivityCategory;
  description: string | null;
  metadata: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface ActivityStats {
  totalActivities: number;
  categoryStats: Array<{
    category: ActivityCategory;
    count: number;
  }>;
  recentActivities: UserActivity[];
}

interface ActivitiesResponse {
  activities: UserActivity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function ActivitiesManagement() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [userId, setUserId] = useState('');

  const categories: ActivityCategory[] = [
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

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(search && { search }),
        ...(category && category !== 'all' && { category }),
        ...(userId && { userId }),
      });

      const response = await fetch(`/api/admin/activities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      
      const data: ActivitiesResponse = await response.json();
      setActivities(data.activities);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const params = new URLSearchParams({
        days: '30',
        ...(userId && { userId }),
      });

      const response = await fetch(`/api/admin/activities/stats?${params}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data: ActivityStats = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [page, search, category, userId]);

  useEffect(() => {
    fetchStats();
  }, [userId]);

  const handleSearch = () => {
    setPage(1);
    fetchActivities();
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setUserId('');
    setPage(1);
  };

  const getCategoryColor = (category: ActivityCategory) => {
    const colors = {
      AUTHENTICATION: 'bg-blue-100 text-blue-800',
      NAVIGATION: 'bg-green-100 text-green-800',
      ORDER: 'bg-purple-100 text-purple-800',
      PAYMENT: 'bg-yellow-100 text-yellow-800',
      CART: 'bg-orange-100 text-orange-800',
      PROFILE: 'bg-pink-100 text-pink-800',
      ADMIN: 'bg-red-100 text-red-800',
      API: 'bg-indigo-100 text-indigo-800',
      ERROR: 'bg-red-100 text-red-800',
      OTHER: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Activities</h1>
          <p className="text-muted-foreground">
            Monitor and track all user activities across the platform
          </p>
        </div>
        <Button onClick={() => fetchActivities()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Active Category</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.categoryStats.length > 0 ? stats.categoryStats[0].category : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.categoryStats.length > 0 ? `${stats.categoryStats[0].count} activities` : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(stats.recentActivities.map(a => a.user.id)).size}
              </div>
              <p className="text-xs text-muted-foreground">Recent activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categoryStats.length}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter activities by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">User ID</label>
              <Input
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
          <CardDescription>
            Showing {activities.length} activities (Page {page} of {totalPages})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <Alert>
              <AlertDescription>No activities found matching your criteria.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{activity.user.name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{activity.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{activity.activity}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(activity.category)}>
                          {activity.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {activity.description ? truncateText(activity.description) : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {activity.ipAddress || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
