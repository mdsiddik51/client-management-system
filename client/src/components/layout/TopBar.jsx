'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Bell, User, Settings, LogOut, Check } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem, DropdownDivider } from '@/components/ui/Dropdown';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { useApi } from '@/hooks/useApi';

export function TopBar({ onMenuClick, title }) {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  
  // Optionally fetch unread notifications count
  const { data: notificationsData } = useApi('/api/notifications', { immediate: true });
  const notifications = notificationsData?.data || [];
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const profileHref = isAdmin ? '/admin/settings' : '/client/profile';
  const settingsHref = isAdmin ? '/admin/settings' : '/client/settings';

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification Bell Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0A84FF] ring-2 ring-white dark:ring-gray-900" />
              )}
            </button>
          }
        >
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </span>
            <span className="text-[11px] text-gray-400">
              {unreadCount} unread
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <div key={n._id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-xs">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{n.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </Dropdown>

        {/* User Avatar Menu */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#0A84FF]/20 transition-all">
              <Avatar name={user?.name || 'User'} src={user?.image} size="sm" />
            </button>
          }
        >
          <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || ''}
            </p>
          </div>
          <DropdownItem onClick={() => router.push(profileHref)}>
            <User className="w-4 h-4 text-gray-500" />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem onClick={() => router.push(settingsHref)}>
            <Settings className="w-4 h-4 text-gray-500" />
            <span>Settings</span>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem destructive onClick={handleSignOut}>
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign out</span>
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}

export default TopBar;
