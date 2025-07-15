"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth-context";
import {
  Building2,
  FileText,
  Heart,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Companies",
    href: "/dashboard/companies",
    icon: Building2,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Carts",
    href: "/dashboard/carts",
    icon: ShoppingCart,
  },
  {
    title: "Quotes",
    href: "/dashboard/quotes",
    icon: FileText,
  },
  {
    title: "Wishlists",
    href: "/dashboard/wishlists",
    icon: Heart,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const getFilteredNavItems = () => {
    if (user?.userType === "salesRep") {
      return navItems;
    }
    return navItems;
  };

  const filteredNavItems = getFilteredNavItems();

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div
          className="cursor-pointer"
          onClick={() => handleNavigation("/dashboard")}
        >
          <h1 className="text-xl font-bold text-gray-900">B2B Dashboard</h1>
        </div>
        <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1 py-4">
          {filteredNavItems.map((item) => (
            <button
              key={item.href}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleNavigation(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t px-3 py-4">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 bg-white border-r lg:block">
        <NavContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <NavContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
