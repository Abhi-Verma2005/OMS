'use client';

import { GenericSearch, SearchConfig, useGenericSearch } from '@/components/ui/generic-search';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield, Activity } from 'lucide-react';

// Example 1: User Search (as implemented in activities management)
export function UserSearchExample() {
  const userSearchConfig: SearchConfig = {
    endpoint: '/api/admin/users/search',
    searchFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
    ],
    displayField: 'name',
    secondaryField: 'email',
    resultFields: [
      { key: 'email', label: 'Email' },
      { key: 'createdAt', label: 'Joined' },
    ],
    maxResults: 5,
    minSearchLength: 1,
    debounceMs: 300,
    renderResult: (user) => (
      <div className="flex items-center space-x-3 p-2">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {user.name || 'No name'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {user.email}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {user._count?.userRoles || 0} role{(user._count?.userRoles || 0) !== 1 ? 's' : ''}
        </Badge>
      </div>
    ),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Search Example</CardTitle>
        <CardDescription>
          Search users by name or email with custom result rendering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenericSearch
          config={userSearchConfig}
          onSelect={(user) => console.log('Selected user:', user)}
          placeholder="Search users by name or email..."
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

// Example 2: Simple Product Search (if you had products)
export function ProductSearchExample() {
  const productSearchConfig: SearchConfig = {
    endpoint: '/api/products/search', // This would need to be created
    searchFields: [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
    ],
    displayField: 'name',
    secondaryField: 'price',
    resultFields: [
      { key: 'category', label: 'Category' },
      { key: 'stock', label: 'Stock' },
    ],
    maxResults: 8,
    minSearchLength: 2,
    debounceMs: 500,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Search Example</CardTitle>
        <CardDescription>
          Simple product search with default rendering
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenericSearch
          config={productSearchConfig}
          onSelect={(product) => console.log('Selected product:', product)}
          placeholder="Search products..."
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

// Example 3: Activity Search with Custom Search Function
export function ActivitySearchExample() {
  const activitySearchConfig: SearchConfig = {
    endpoint: '/api/admin/activities', // Using existing endpoint
    searchFields: [
      { key: 'activity', label: 'Activity', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ],
    displayField: 'activity',
    secondaryField: 'category',
    resultFields: [
      { key: 'category', label: 'Category' },
      { key: 'createdAt', label: 'Date' },
    ],
    maxResults: 6,
    minSearchLength: 2,
    debounceMs: 400,
    additionalParams: {
      limit: '6', // Limit results from API
    },
    renderResult: (activity) => (
      <div className="flex items-center space-x-3 p-2">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Activity className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {activity.activity}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {activity.description || 'No description'}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {activity.category}
        </Badge>
      </div>
    ),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Search Example</CardTitle>
        <CardDescription>
          Search activities with custom rendering and additional parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenericSearch
          config={activitySearchConfig}
          onSelect={(activity) => console.log('Selected activity:', activity)}
          placeholder="Search activities..."
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

// Example 4: Role Search with Pagination
export function RoleSearchExample() {
  const roleSearchConfig: SearchConfig = {
    endpoint: '/api/admin/roles/search', // This would need to be created
    searchFields: [
      { key: 'name', label: 'Role Name', type: 'text' },
      { key: 'displayName', label: 'Display Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
    ],
    displayField: 'displayName',
    secondaryField: 'name',
    resultFields: [
      { key: 'description', label: 'Description' },
    ],
    maxResults: 10,
    minSearchLength: 1,
    debounceMs: 300,
    showPagination: true,
    itemsPerPage: 5,
    renderResult: (role) => (
      <div className="flex items-center space-x-3 p-2">
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <Shield className="h-4 w-4 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {role.displayName}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {role.name}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {role._count?.rolePermissions || 0} permission{(role._count?.rolePermissions || 0) !== 1 ? 's' : ''}
        </Badge>
      </div>
    ),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Search with Pagination</CardTitle>
        <CardDescription>
          Search roles with pagination enabled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenericSearch
          config={roleSearchConfig}
          onSelect={(role) => console.log('Selected role:', role)}
          placeholder="Search roles..."
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}

// Example 5: Using the Hook
export function HookExample() {
  const { query, setQuery, results, loading, error, search } = useGenericSearch({
    endpoint: '/api/admin/users/search',
    searchFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
    ],
    displayField: 'name',
    secondaryField: 'email',
    resultFields: [],
    maxResults: 5,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Using the Hook</CardTitle>
        <CardDescription>
          Example of using the useGenericSearch hook for custom implementations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              search(e.target.value);
            }}
            placeholder="Search users..."
            className="w-full p-2 border rounded"
          />
          
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          
          <div className="space-y-2">
            {results.map((user, index) => (
              <div key={user.id || index} className="p-2 border rounded">
                <div className="font-medium">{user.name || 'No name'}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Examples Component
export function SearchExamples() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Generic Search Component Examples</h1>
        <p className="text-muted-foreground mt-2">
          Various examples of how to use the GenericSearch component
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <UserSearchExample />
        <ProductSearchExample />
        <ActivitySearchExample />
        <RoleSearchExample />
        <HookExample />
      </div>
    </div>
  );
}
