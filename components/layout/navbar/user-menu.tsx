"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../../../lib/auth-context";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative ml-4">
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {user.firstName} {user.lastName}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDashboard}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-4 flex space-x-2">
      <Link
        href="/login/sales-rep"
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sales Rep Login
      </Link>
      <Link
        href="/login/customer"
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        Customer Login
      </Link>
    </div>
  );
}
