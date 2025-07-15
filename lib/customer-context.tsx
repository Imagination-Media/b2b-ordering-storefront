"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface ActiveCustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface CustomerContextType {
  activeCustomer: ActiveCustomer | null;
  setActiveCustomer: (customer: ActiveCustomer) => void;
  clearActiveCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [activeCustomer, setActiveCustomerState] =
    useState<ActiveCustomer | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCustomer = localStorage.getItem("activeCustomer");
      if (storedCustomer) {
        try {
          setActiveCustomerState(JSON.parse(storedCustomer));
        } catch (error) {
          console.error("Error parsing stored customer:", error);
          localStorage.removeItem("activeCustomer");
        }
      }
    }
  }, []);

  const setActiveCustomer = (customer: ActiveCustomer) => {
    setActiveCustomerState(customer);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeCustomer", JSON.stringify(customer));
    }
  };

  const clearActiveCustomer = () => {
    setActiveCustomerState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("activeCustomer");
    }
  };

  return (
    <CustomerContext.Provider
      value={{ activeCustomer, setActiveCustomer, clearActiveCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useActiveCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error("useActiveCustomer must be used within a CustomerProvider");
  }
  return context;
};
