'use client';

import React, { useState } from 'react';
import {
  Lock,
  Moon,
  Sun,
  Bell,
  Shield,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/components/ui/ThemeProvider';
import { useToast } from '@/components/ui/Toast';

export default function ClientSettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { success, error: toastError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toastError('Missing fields', 'Please enter your current and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('Mismatch', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toastError('Weak password', 'New password must be at least 8 characters.');
      return;
    }

    setSavingPassword(true);
    const { error } = await api.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (error) {
      toastError('Password Change Failed', error);
    } else {
      success('Password Updated', 'Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Client Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your portal password, notifications, and theme settings.
        </p>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0A84FF]" />
            <span>Change Password</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={savingPassword} size="sm">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Theme Preference</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Interface Mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Switch between modern dark mode and Apple-clean light mode
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0A84FF]" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive alerts when task status changes</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-[#0A84FF] focus:ring-[#0A84FF] w-4 h-4"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer py-1 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Project Milestone Summaries</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Weekly email updates on overall deliverable progress</p>
            </div>
            <input
              type="checkbox"
              checked={projectUpdates}
              onChange={(e) => setProjectUpdates(e.target.checked)}
              className="rounded text-[#0A84FF] focus:ring-[#0A84FF] w-4 h-4"
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
