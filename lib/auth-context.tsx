"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  User,
  SalesRepLoginResponse,
  SalesRepLoginVariables,
} from "./apollo-client";

const SALES_REP_LOGIN_MUTATION = gql`
  mutation AuthenticateSalesRep($email: String!, $password: String!) {
    authenticateSalesRep(email: $email, password: $password) {
      token
      salesRep {
        id
        email
        firstName
        lastName
        code
        phone
      }
    }
  }
`;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    userType: "salesRep" | "customer",
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [salesRepLogin, { loading: salesRepLoading }] = useMutation<
    SalesRepLoginResponse,
    SalesRepLoginVariables
  >(SALES_REP_LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data?.authenticateSalesRep?.[0]?.token) {
        const salesRepData = data.authenticateSalesRep[0];
        const token = salesRepData.token;
        const userData: User = {
          ...salesRepData.salesRep,
          userType: "salesRep",
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setError(null);
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    },
    onError: (error) => {
      console.error("Sales rep login error:", error);
      setError("Authentication failed. Please check your credentials.");
    },
  });

  const login = async (
    email: string,
    password: string,
    userType: "salesRep" | "customer",
  ) => {
    setError(null);

    if (userType === "customer") {
      setError("Customer authentication is coming soon.");
      return;
    }

    if (userType === "salesRep") {
      await salesRepLogin({
        variables: { email, password },
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData && isTokenValid(token)) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          logout();
        }
      } else if (token) {
        logout();
      }

      setIsLoading(false);
    };

    initializeAuth();

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token && !isTokenValid(token)) {
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || salesRepLoading,
    login,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
