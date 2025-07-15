"use client";

import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import UserMenu from "./user-menu";
import { useAuth } from "../../../lib/auth-context";
import { useActiveCustomer } from "../../../lib/customer-context";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "B2B Store";

interface MenuItem {
  title: string;
  path: string;
}

export function Navbar() {
  const { user } = useAuth();
  const { activeCustomer } = useActiveCustomer();

  const menu: MenuItem[] = [
    { title: "Products", path: "/search" },
    { title: "Collections", path: "/search" },
  ];

  return (
    <nav className="relative flex flex-col">
      {/* Active Customer Bar */}
      {user && activeCustomer && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-4 py-2">
          <div className="flex items-center justify-center">
            <Link
              href={`/dashboard/customers/${activeCustomer.id}/edit`}
              className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 hover:underline"
            >
              Active Customer: {activeCustomer.firstName}{" "}
              {activeCustomer.lastName} &lt;{activeCustomer.email}&gt;
            </Link>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <LogoSquare />
              <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
                {SITE_NAME}
              </div>
            </Link>
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item: MenuItem) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <div className="flex justify-end md:w-1/3">
            <CartModal />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
