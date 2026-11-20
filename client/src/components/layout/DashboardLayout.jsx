'use client';

import React, { useState } from 'react';
import { TopBar } from './TopBar';

export function DashboardLayout({ sidebar: SidebarComponent, children, title }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex">
      {/* Sidebar (Desktop sticky & Mobile drawer) */}
      {SidebarComponent && (
        <SidebarComponent
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          title={title}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
