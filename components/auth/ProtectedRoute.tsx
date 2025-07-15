"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: "salesRep" | "customer";
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  userType,
  fallbackPath,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        if (userType === "salesRep") {
          router.push("/login/sales-rep");
        } else if (userType === "customer") {
          router.push("/login/customer");
        } else if (fallbackPath) {
          router.push(fallbackPath);
        } else {
          router.push("/login/sales-rep");
        }
        return;
      }

      if (userType && user?.userType !== userType) {
        if (user?.userType === "salesRep") {
          router.push("/dashboard");
        } else if (user?.userType === "customer") {
          router.push("/account");
        } else {
          router.push("/login/sales-rep");
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, router, user, userType, fallbackPath]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userType && user?.userType !== userType) {
    return null;
  }

  return <>{children}</>;
}
