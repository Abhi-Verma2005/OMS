'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'date';
  searchable?: boolean;
}

export interface SearchResult<T = any> {
  id: string;
  [key: string]: any;
}

export interface SearchConfig<T = any> {
  // API endpoint for search
  endpoint: string;
  // Fields to search in
  searchFields: SearchField[];
  // Primary display field
  displayField: string;
  // Secondary display field (optional)
  secondaryField?: string;
  // Fields to show in results
  resultFields: SearchField[];
  // Custom result renderer
  renderResult?: (item: T) => React.ReactNode;
  // Custom empty state
  emptyMessage?: string;
  // Debounce delay in ms
  debounceMs?: number;
  // Minimum characters to trigger search
  minSearchLength?: number;
  // Maximum results to show
  maxResults?: number;
  // Show pagination
  showPagination?: boolean;
  // Items per page
  itemsPerPage?: number;
  // Additional query parameters
  additionalParams?: Record<string, string>;
  // Custom search function
  customSearch?: (query: string, page?: number) => Promise<{
    results: T[];
    total: number;
    page: number;
    totalPages: number;
  }>;
}

interface GenericSearchProps<T = any> {
  config: SearchConfig<T>;
  onSelect?: (item: T) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
  disabled?: boolean;
}

export function GenericSearch<T = any>({
  config,
  onSelect,
  placeholder,
  className,
  showResults = true,
  disabled = false,
}: GenericSearchProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    endpoint,
    searchFields,
    displayField,
    secondaryField,
    resultFields,
    renderResult,
    emptyMessage = 'No results found',
    debounceMs = 300,
    minSearchLength = 1,
    maxResults = 10,
    showPagination = false,
    itemsPerPage = 10,
    additionalParams = {},
    customSearch,
  } = config;

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, pageNum: number = 1) => {
      if (searchQuery.length < minSearchLength) {
        setResults([]);
        setTotal(0);
        setTotalPages(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResult;

        if (customSearch) {
          searchResult = await customSearch(searchQuery, pageNum);
        } else {
          const params = new URLSearchParams({
            search: searchQuery,
            page: pageNum.toString(),
            limit: itemsPerPage.toString(),
            ...additionalParams,
          });

          const response = await fetch(`${endpoint}?${params}`);
          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }

          const data = await response.json();
          searchResult = {
            results: data.results || data.data || data,
            total: data.total || data.count || 0,
            page: data.page || pageNum,
            totalPages: data.totalPages || Math.ceil((data.total || data.count || 0) / itemsPerPage),
          };
        }

        setResults(searchResult.results.slice(0, maxResults));
        setTotal(searchResult.total);
        setTotalPages(searchResult.totalPages);
        setPage(searchResult.page);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [endpoint, searchFields, minSearchLength, maxResults, itemsPerPage, additionalParams, customSearch, debounceMs]
  );

  // Handle search input change
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
    if (value.trim()) {
      setIsOpen(true);
      debouncedSearch(value, 1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  // Handle result selection
  const handleResultSelect = (item: T) => {
    setQuery(getDisplayValue(item));
    setIsOpen(false);
    onSelect?.(item);
  };

  // Get display value for an item
  const getDisplayValue = (item: T): string => {
    const primary = (item as any)[displayField];
    const secondary = secondaryField ? (item as any)[secondaryField] : null;
    return secondary ? `${primary} (${secondary})` : primary || '';
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    debouncedSearch(query, newPage);
  };

  // Render individual result item
  const renderItem = (item: T, index: number) => {
    if (renderResult) {
      return (
        <div key={(item as any).id || index} onClick={() => handleResultSelect(item)}>
          {renderResult(item)}
        </div>
      );
    }

    return (
      <div
        key={(item as any).id || index}
        className="p-3 hover:bg-muted cursor-pointer rounded-md transition-colors"
        onClick={() => handleResultSelect(item)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">
              {(item as any)[displayField] || 'Unknown'}
            </div>
            {secondaryField && (item as any)[secondaryField] && (
              <div className="text-xs text-muted-foreground truncate">
                {(item as any)[secondaryField]}
              </div>
            )}
            {resultFields.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {resultFields.slice(0, 3).map((field) => {
                  const value = (item as any)[field.key];
                  if (!value) return null;
                  return (
                    <Badge key={field.key} variant="outline" className="text-xs">
                      {field.label}: {String(value).slice(0, 20)}
                      {String(value).length > 20 ? '...' : ''}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder || `Search ${searchFields.map(f => f.label).join(', ')}...`}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          className="pl-10 pr-10"
          disabled={disabled}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {loading && (
          <Loader2 className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Search Results */}
      {showResults && isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <div className="text-sm text-destructive">{error}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => debouncedSearch(query, page)}
                >
                  Try Again
                </Button>
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {query.length < minSearchLength
                  ? `Enter at least ${minSearchLength} character${minSearchLength > 1 ? 's' : ''} to search`
                  : emptyMessage}
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.map((item, index) => renderItem(item, index))}
                
                {/* Pagination */}
                {showPagination && totalPages > 1 && (
                  <div className="border-t p-3 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Showing {results.length} of {total} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-xs">
                        {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Hook for using the search component
export function useGenericSearch<T = any>(config: SearchConfig<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < (config.minSearchLength || 1)) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let searchResult;

        if (config.customSearch) {
          searchResult = await config.customSearch(searchQuery);
        } else {
          const params = new URLSearchParams({
            search: searchQuery,
            ...config.additionalParams,
          });

          const response = await fetch(`${config.endpoint}?${params}`);
          if (!response.ok) {
            throw new Error(`Search failed: ${response.statusText}`);
          }

          const data = await response.json();
          searchResult = {
            results: data.results || data.data || data,
            total: data.total || data.count || 0,
          };
        }

        setResults(searchResult.results);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [config]
  );

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  };
}
