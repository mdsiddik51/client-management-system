'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  Moon,
  Sun,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/components/ui/ThemeProvider';
import { useToast } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@example.com');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const { error } = await api.patch('/api/users/profile', { name });
    if (error) {
      toastError('Update Failed', error);
    } else {
      success('Profile Saved', 'Your profile details have been updated.');
    }
    setSavingProfile(false);
  };

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
    // Call change password
    const { error } = await api.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });

    if (error) {
      toastError('Password Change Failed', error);
    } else {
      success('Password Updated', 'Your account credentials have been refreshed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure profile data, access credentials, and application themes.
        </p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#0A84FF]" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                helper="Contact root admin to change primary address"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={savingProfile} size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0A84FF]" />
            <span>Security & Password</span>
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

      {/* Appearance & Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Appearance & Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode Interface</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Switch between high-contrast dark mode and clean daylight theme
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0A84FF]" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Digest</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Receive summary reports on project milestones</p>
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
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Task Deadline Reminders</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Automated nudges 24 hours prior to due dates</p>
            </div>
            <input
              type="checkbox"
              checked={taskReminders}
              onChange={(e) => setTaskReminders(e.target.checked)}
              className="rounded text-[#0A84FF] focus:ring-[#0A84FF] w-4 h-4"
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
