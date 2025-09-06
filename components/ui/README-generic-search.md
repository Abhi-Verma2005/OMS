# Generic Search Component

A highly reusable, database-integrated search component for React applications. This component provides a consistent search experience across your application with built-in debouncing, pagination, and customizable result rendering.

## Features

- 🔍 **Database Integration**: Fetches search results from API endpoints
- ⚡ **Debounced Search**: Configurable debounce delay for performance
- 🎨 **Customizable Rendering**: Custom result renderers for different data types
- 📄 **Pagination Support**: Built-in pagination for large result sets
- 🔧 **TypeScript Support**: Full TypeScript support with generics
- 🎯 **Flexible Configuration**: Highly configurable for different use cases
- 📱 **Responsive Design**: Works well on all screen sizes

## Basic Usage

```tsx
import { GenericSearch, SearchConfig } from '@/components/ui/generic-search';

const searchConfig: SearchConfig = {
  endpoint: '/api/users/search',
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
  maxResults: 10,
  minSearchLength: 1,
  debounceMs: 300,
};

function MyComponent() {
  return (
    <GenericSearch
      config={searchConfig}
      onSelect={(user) => console.log('Selected:', user)}
      placeholder="Search users..."
      className="w-full"
    />
  );
}
```

## Configuration Options

### SearchConfig Interface

```tsx
interface SearchConfig<T = any> {
  // Required
  endpoint: string;                    // API endpoint for search
  searchFields: SearchField[];        // Fields to search in
  displayField: string;               // Primary display field
  
  // Optional
  secondaryField?: string;            // Secondary display field
  resultFields?: SearchField[];       // Fields to show in results
  renderResult?: (item: T) => React.ReactNode; // Custom result renderer
  emptyMessage?: string;              // Custom empty state message
  debounceMs?: number;                // Debounce delay (default: 300ms)
  minSearchLength?: number;           // Min chars to trigger search (default: 1)
  maxResults?: number;                // Max results to show (default: 10)
  showPagination?: boolean;           // Show pagination (default: false)
  itemsPerPage?: number;              // Items per page (default: 10)
  additionalParams?: Record<string, string>; // Additional query params
  customSearch?: (query: string, page?: number) => Promise<SearchResult>; // Custom search function
}
```

### SearchField Interface

```tsx
interface SearchField {
  key: string;                        // Field key in data
  label: string;                      // Display label
  type?: 'text' | 'email' | 'date';  // Field type
  searchable?: boolean;               // Whether field is searchable (default: true)
}
```

## API Endpoint Requirements

Your API endpoint should accept the following query parameters:

- `search`: The search query string
- `page`: Page number for pagination
- `limit`: Number of results per page

And return a response in this format:

```json
{
  "results": [...],           // Array of search results
  "total": 100,              // Total number of results
  "page": 1,                 // Current page
  "totalPages": 10           // Total number of pages
}
```

### Example API Implementation

```tsx
// app/api/users/search/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search.trim()) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    results: users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
```

## Advanced Usage

### Custom Result Rendering

```tsx
const config: SearchConfig<User> = {
  // ... other config
  renderResult: (user) => (
    <div className="flex items-center space-x-3 p-2">
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </div>
      <Badge variant="outline">{user.role}</Badge>
    </div>
  ),
};
```

### Using the Hook

For more control, you can use the `useGenericSearch` hook:

```tsx
import { useGenericSearch } from '@/components/ui/generic-search';

function MyCustomSearch() {
  const { query, setQuery, results, loading, error, search } = useGenericSearch({
    endpoint: '/api/users/search',
    searchFields: [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
    ],
    displayField: 'name',
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          search(e.target.value);
        }}
        placeholder="Search users..."
      />
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {results.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Custom Search Function

For complex search logic, you can provide a custom search function:

```tsx
const config: SearchConfig = {
  // ... other config
  customSearch: async (query, page = 1) => {
    // Your custom search logic
    const response = await fetch('/api/custom-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, page }),
    });
    return response.json();
  },
};
```

## Styling

The component uses Tailwind CSS classes and can be styled using the `className` prop:

```tsx
<GenericSearch
  config={config}
  className="w-full max-w-md"
  // ... other props
/>
```

## Examples

See `components/examples/search-examples.tsx` for comprehensive examples including:

- User search with custom rendering
- Product search with default rendering
- Activity search with additional parameters
- Role search with pagination
- Hook usage example

## Best Practices

1. **Debounce Configuration**: Use appropriate debounce delays (300-500ms) for better performance
2. **Min Search Length**: Set minimum search length to avoid too many API calls
3. **Result Limits**: Limit results to improve performance and UX
4. **Error Handling**: Always handle search errors gracefully
5. **Loading States**: Show loading indicators for better UX
6. **Accessibility**: Ensure proper keyboard navigation and screen reader support

## TypeScript Support

The component is fully typed with TypeScript generics:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
}

const config: SearchConfig<User> = {
  // ... config
};

<GenericSearch<User>
  config={config}
  onSelect={(user: User) => {
    // user is properly typed
    console.log(user.name);
  }}
/>
```
