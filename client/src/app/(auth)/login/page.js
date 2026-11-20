'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn.email({
        email,
        password,
        rememberMe,
      });

      if (res?.error) {
        const errorMsg = res.error.message || res.error.statusText || 'Invalid credentials.';
        setError(errorMsg);
        toastError('Authentication Failed', errorMsg);
        setLoading(false);
        return;
      }

      toastSuccess('Signed in successfully', 'Welcome back!');

      // Retrieve session to determine destination role
      const session = await getSession();
      const role = session?.data?.user?.role;

      if (from) {
        router.push(from);
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred during sign in.');
      toastError('Error', err?.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-[#0A84FF] focus:ring-[#0A84FF] w-4 h-4"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toastError('Password Reset', 'Please contact your administrator to reset credentials.');
            }}
            className="text-[#0A84FF] hover:underline font-medium"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2 font-semibold shadow-sm"
        >
          Sign in
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#0A84FF] font-medium hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
