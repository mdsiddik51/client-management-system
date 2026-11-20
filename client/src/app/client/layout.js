'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ClientSidebar } from '@/components/layout/ClientSidebar';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ToastProvider } from '@/components/ui/Toast';

export default function ClientLayout({ children }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isClient, isAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login?from=/client/dashboard');
      }
      // If user is ADMIN, they are allowed or can switch, but if not authenticated redirect
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#0A84FF] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ToastProvider>
      <DashboardLayout sidebar={ClientSidebar}>
        {children}
      </DashboardLayout>
    </ToastProvider>
  );
}
