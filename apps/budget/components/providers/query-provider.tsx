'use client';

import { authApi } from '@/lib/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Don't retry on auth errors
              if (
                error instanceof Error &&
                error.message.includes('Unauthorized')
              ) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            onError: (error) => {
              // Handle 401 errors globally - redirect to login
              if (
                error instanceof Error &&
                error.message.includes('Unauthorized')
              ) {
                authApi.logout();
                window.location.href = '/login';
              }
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
