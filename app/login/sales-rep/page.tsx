'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from 'components/auth/auth-context';
import { authenticateSalesRep } from 'lib/b2b';
import { toast } from 'sonner';

export default function SalesRepLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authenticateSalesRep(email, password);
      login(response.token, response.salesRep, 'salesRep');
      toast.success('Login successful');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="mb-6 text-2xl font-bold">Sales Rep Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-neutral-200 px-4 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
