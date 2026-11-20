'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  FolderKanban,
  CheckSquare,
  ShieldAlert,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users2 },
  { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/admin/tasks', icon: CheckSquare },
  { name: 'Users', href: '/admin/users', icon: ShieldAlert },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/60 dark:border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 font-semibold text-gray-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-[#0A84FF] flex items-center justify-center text-white shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <span className="tracking-tight text-base font-bold">ClientHub</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-[#0A84FF] dark:bg-blue-900/40 dark:text-blue-300">
            Admin
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#0A84FF] text-white shadow-sm font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/60 dark:hover:bg-gray-800/60'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-gray-200/60 dark:border-gray-800">
        <div className="p-2.5 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/60 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={user?.name || 'Admin'} src={user?.image} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.name || 'Administrator'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Badge variant="ADMIN" className="text-[10px] px-1.5 py-0 leading-none">
                  ADMIN
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-[280px] max-w-[80vw] h-full z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
