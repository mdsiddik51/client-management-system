'use client';

import { useSession } from '@/lib/auth';

export function useAuth() {
  const { data: session, isPending: isLoading } = useSession();

  const user = session?.user || null;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isClient = user?.role === 'CLIENT';

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    isClient,
  };
}

export default useAuth;
