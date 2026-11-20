'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signUp.email({
        name,
        email,
        password,
      });

      if (res?.error) {
        const errorMsg = res.error.message || res.error.statusText || 'Registration failed.';
        setError(errorMsg);
        toastError('Registration Failed', errorMsg);
        setLoading(false);
        return;
      }

      toastSuccess('Account Created!', 'Welcome to ClientHub. Redirecting to your portal...');
      setTimeout(() => {
        router.push('/client/dashboard');
      }, 800);
    } catch (err) {
      setError(err?.message || 'An error occurred during registration.');
      toastError('Error', err?.message || 'Failed to complete sign up.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Create an account
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Get started with your client portal in seconds
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane@company.com"
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
        />

        <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
          By signing up, you agree to our{' '}
          <a href="#" className="text-[#0A84FF] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#0A84FF] hover:underline">
            Privacy Policy
          </a>
          .
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2 font-semibold shadow-sm"
        >
          Create account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-[#0A84FF] font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
