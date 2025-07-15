"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";
import { GET_CUSTOMERS } from "../../../lib/api/customers";
import { Customer, PaginationResults } from "../../../lib/api/customers";
import { useActiveCustomer } from "../../../lib/customer-context";
import {
  ExportDialog,
  ExportOptions,
} from "../../../components/ui/export-dialog";
import { Download, Plus, Search, Pencil, UserCheck } from "lucide-react";
import { format } from "date-fns";

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";

  try {
    let dateObj;

    if (
      typeof dateString === "string" &&
      dateString.match(/^\d{4}-\d{2}-\d{2}/)
    ) {
      dateObj = new Date(dateString);
    } else if (typeof dateString === "string" && !isNaN(Number(dateString))) {
      dateObj = new Date(Number(dateString));
    } else {
      dateObj = new Date(dateString);
    }

    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return format(dateObj, "MMM d, yyyy h:mm a");
  } catch {
    return "-";
  }
};

function CustomersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setActiveCustomer } = useActiveCustomer();
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = 10;

  // Sort and filter state
  const [sortField, setSortField] = useState<string>(
    searchParams.get("sortField") ?? "id",
  );
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">(
    (searchParams.get("sortDirection") as "ASC" | "DESC") ?? "ASC",
  );
  const [filterValue, setFilterValue] = useState<string>(
    searchParams.get("filterValue") ?? "",
  );
  const [filterField, setFilterField] = useState<string>(
    searchParams.get("filterField") ?? "id",
  );
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // Update URL when sort changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (sortField) params.set("sortField", sortField);
    if (sortDirection) params.set("sortDirection", sortDirection);
    router.push(`/dashboard/customers?${params.toString()}`);
  }, [sortField, sortDirection, page, searchParams, router]);

  // Get filter values from URL params
  const urlFilterValue = searchParams.get("filterValue") ?? "";
  const urlFilterField = searchParams.get("filterField") ?? "id";

  // Prepare query variables
  const queryVariables: {
    pagination: { currentPage: number; pageSize: number };
    id?: number[];
    firstName?: string;
    lastName?: string;
    email?: string;
    customerNumber?: string;
    sortOrder?: { field: string; direction: "ASC" | "DESC" };
  } = {
    pagination: {
      currentPage: page,
      pageSize: pageSize,
    },
  };

  // Add filter variables if filter is applied from URL params
  if (urlFilterValue) {
    if (urlFilterField === "id" && !isNaN(parseInt(urlFilterValue))) {
      queryVariables.id = [parseInt(urlFilterValue)];
    } else if (urlFilterField === "firstName") {
      queryVariables.firstName = `%${urlFilterValue}%`;
    } else if (urlFilterField === "lastName") {
      queryVariables.lastName = `%${urlFilterValue}%`;
    } else if (urlFilterField === "email") {
      queryVariables.email = `%${urlFilterValue}%`;
    } else if (urlFilterField === "customerNumber") {
      queryVariables.customerNumber = `%${urlFilterValue}%`;
    }
  }

  // Add sort order if sort field is specified
  if (sortField && sortDirection) {
    queryVariables.sortOrder = {
      field: sortField,
      direction: sortDirection,
    };
  }

  const { data, loading, error } = useQuery(GET_CUSTOMERS, {
    variables: queryVariables,
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500">
        Error loading customers: {error.message}
      </div>
    );

  const customers: Customer[] = data?.getCustomers?.customers || [];
  const pagination: PaginationResults = data?.getCustomers?.pagination;

  const handleExport = async (options: ExportOptions) => {
    console.log("Export options:", options);
  };

  const handleMakeActive = (customer: Customer) => {
    if (customer.id) {
      setActiveCustomer({
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      });
    }
  };

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/dashboard/customers?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
        <div className="flex gap-2">
          {customers.length > 0 && (
            <button
              onClick={() => setExportDialogOpen(true)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
          )}
          <button
            onClick={() => router.push("/dashboard/customers/new")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Sort and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-[180px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="id">ID</option>
            <option value="firstName">Name</option>
            <option value="email">Email</option>
            <option value="createdAt">Created At</option>
            <option value="updatedAt">Updated At</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as "ASC" | "DESC")}
            className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by:</span>
          <select
            value={filterField}
            onChange={(e) => setFilterField(e.target.value)}
            className="w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="id">ID</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
            <option value="customerNumber">Customer Number</option>
          </select>

          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="pl-8 w-[200px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateSearchParams({
                      filterValue: filterValue,
                      filterField: filterField,
                      page: "1",
                    });
                  }
                }}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              className="ml-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => {
                updateSearchParams({
                  filterValue: filterValue,
                  filterField: filterField,
                  page: "1",
                });
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer Number
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Net Terms
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company Name
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer Group
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Channel
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.length > 0 ? (
              customers.map((customer: Customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.email}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.customerNumber || "-"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.netTerms || "-"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.companyName || "-"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.customerGroup
                      ? `${customer.customerGroup.name} (${customer.customerGroup.id})`
                      : "-"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.channels
                      ?.map((c) => `${c.name} (${c.id})`)
                      .join(", ") || "-"}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(customer.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/customers/${customer.id}/edit`,
                          )
                        }
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMakeActive(customer)}
                        className="flex items-center px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Make Active
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No customers found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (page > 1) {
                updateSearchParams({ page: (page - 1).toString() });
              }
            }}
            disabled={page === 1}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
            Page {page} of {pagination?.totalPages || 1}
          </span>
          <button
            onClick={() => {
              if (!pagination || page < pagination.totalPages) {
                updateSearchParams({ page: (page + 1).toString() });
              }
            }}
            disabled={!pagination || page >= pagination.totalPages}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        hasPagination={!!pagination}
        currentPage={pagination?.currentPage || 1}
        totalPages={pagination?.totalPages || 1}
      />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersPageContent />
    </Suspense>
  );
}
