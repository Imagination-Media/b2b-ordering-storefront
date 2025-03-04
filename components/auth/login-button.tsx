'use client';

import React from 'react';
import { useAuth } from './auth-context';
import Link from 'next/link';

export default function LoginButton() {
  const { authState, logout } = useAuth();

  if (authState.isAuthenticated) {
    return (
      <div className="flex items-center">
        <span className="mr-2 text-sm">
          {authState.user?.firstName} {authState.user?.lastName}
        </span>
        <button
          onClick={logout}
          className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/login/sales-rep"
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        Sales Rep Login
      </Link>
      <span className="text-neutral-500">|</span>
      <Link
        href="/login/customer"
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        Customer Login
      </Link>
    </div>
  );
}
