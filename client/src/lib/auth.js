import { createAuthClient } from 'better-auth/react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const baseURL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '') || 'http://localhost:5000';

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
