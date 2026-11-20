'use client';

import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function AuthLayout({ children }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50/60 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-blue-500/20">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-[#0A84FF] flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <span className="tracking-tight text-2xl font-bold">ClientHub</span>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-white dark:bg-gray-900 py-8 px-6 sm:px-10 shadow-apple dark:shadow-apple-dark border border-gray-200/80 dark:border-gray-800 rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
