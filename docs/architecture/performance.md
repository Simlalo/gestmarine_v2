# Performance Optimization Patterns

This guide outlines performance optimization patterns and best practices used in the GestMarine application.

## Core Principles

1. Minimize Re-renders
2. Optimize Bundle Size
3. Efficient Data Loading
4. Caching Strategies
5. Code Splitting

## Component Optimization

### 1. Memoization

```typescript
// components/features/barques/BarqueList.tsx
const MemoizedBarqueCard = memo(BarqueCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.status === next.status &&
    prev.lastUpdated === next.lastUpdated
  );
});

const BarqueList: React.FC<{ barques: Barque[] }> = ({ barques }) => {
  return (
    <Grid container spacing={2}>
      {barques.map(barque => (
        <Grid item key={barque.id} xs={12} md={6}>
          <MemoizedBarqueCard {...barque} />
        </Grid>
      ))}
    </Grid>
  );
};
```

### 2. Callback Optimization

```typescript
// hooks/features/barques/useBarqueActions.ts
export const useBarqueActions = (barqueId: string) => {
  const updateBarque = useCallback(async (data: BarqueUpdateData) => {
    // Update logic
  }, [barqueId]);

  const deleteBarque = useCallback(async () => {
    // Delete logic
  }, [barqueId]);

  return { updateBarque, deleteBarque };
};
```

## Data Loading Optimization

### 1. Pagination

```typescript
// hooks/common/usePagination.ts
export const usePagination = <T>(
  items: T[],
  itemsPerPage: number = 10
) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, page, itemsPerPage]);

  return {
    items: paginatedItems,
    page,
    setPage,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
```

### 2. Infinite Scroll

```typescript
// hooks/common/useInfiniteScroll.ts
export const useInfiniteScroll = <T>(
  fetchItems: (page: number) => Promise<T[]>
) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newItems = await fetchItems(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, fetchItems]);

  return { items, loadMore, isLoading, hasMore };
};
```

## Bundle Optimization

### 1. Code Splitting

```typescript
// App.tsx
const BarqueManagement = lazy(() => import('./features/barques'));
const GerantManagement = lazy(() => import('./features/gerants'));

const App = () => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      <Route path="/barques/*" element={<BarqueManagement />} />
      <Route path="/gerants/*" element={<GerantManagement />} />
    </Routes>
  </Suspense>
);
```

### 2. Dynamic Imports

```typescript
// components/features/reports/ReportGenerator.tsx
const generatePDF = async (data: ReportData) => {
  const pdfLib = await import('pdf-lib');
  // Generate PDF logic
};
```

## Caching Strategies

### 1. API Response Caching

```typescript
// utils/cache.ts
export class APICache {
  private cache = new Map<string, {
    data: any;
    timestamp: number;
  }>();
  
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

### 2. Query Caching

```typescript
// hooks/common/useQuery.ts
export const useQuery = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    staleTime?: number;
  }
) => {
  const cache = useContext(QueryCacheContext);
  const [data, setData] = useState<T | null>(cache.get(key));
  const [isLoading, setIsLoading] = useState(!data);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetcher();
        setData(result);
        cache.set(key, result);
      } finally {
        setIsLoading(false);
      }
    };

    if (!data || isStale(key, options?.staleTime)) {
      loadData();
    }
  }, [key]);

  return { data, isLoading };
};
```

## Virtual Lists

```typescript
// components/common/VirtualList.tsx
export const VirtualList = <T,>({
  items,
  height,
  itemHeight,
  renderItem
}: VirtualListProps<T>) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleItems = Math.ceil(height / itemHeight);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  }, [itemHeight]);

  const visibleData = useMemo(() => {
    return items.slice(
      startIndex,
      startIndex + visibleItems + 1
    );
  }, [items, startIndex, visibleItems]);

  return (
    <div
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight }}>
        <div style={{
          transform: `translateY(${startIndex * itemHeight}px)`
        }}>
          {visibleData.map(renderItem)}
        </div>
      </div>
    </div>
  );
};
```

## Performance Monitoring

```typescript
// utils/performance.ts
export const measurePerformance = (
  componentName: string,
  operation: string
) => {
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > 16) { // More than 1 frame (60fps)
        console.warn(
          `Slow ${operation} in ${componentName}: ${duration.toFixed(2)}ms`
        );
      }
    }
  };
};
```

## Best Practices

1. **Component Optimization**
   - Use memo for expensive renders
   - Optimize callback functions
   - Avoid inline styles and functions

2. **Data Management**
   - Implement proper caching
   - Use pagination/infinite scroll
   - Optimize API calls

3. **Bundle Size**
   - Use code splitting
   - Implement lazy loading
   - Optimize dependencies

4. **Resource Loading**
   - Lazy load images
   - Use proper asset optimization
   - Implement preloading

5. **Monitoring**
   - Track performance metrics
   - Set up monitoring tools
   - Analyze bottlenecks

Remember to:
- Profile before optimizing
- Measure impact of changes
- Focus on user experience
- Consider mobile performance
