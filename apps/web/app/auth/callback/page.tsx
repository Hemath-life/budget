'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(token, user);
        // Invalidate all queries to refetch with new auth token
        queryClient.invalidateQueries();
        router.push('/dashboard');
      } catch (error) {
        console.error('Failed to parse user data:', error);
        router.push('/login?error=auth_failed');
      }
    } else {
      // No token received, redirect to login with error
      router.push('/login?error=auth_failed');
    }
  }, [searchParams, login, router, queryClient]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <p className="mt-4 text-muted-foreground">Completing sign in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
