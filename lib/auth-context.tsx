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
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Auth: Login mutation completed with full response:",
          JSON.stringify(data, null, 2),
        );
        console.log(
          "Auth: authenticateSalesRep structure:",
          data?.authenticateSalesRep,
        );
        console.log(
          "Auth: Is array?",
          Array.isArray(data?.authenticateSalesRep),
        );
        if (data?.authenticateSalesRep) {
          console.log("Auth: First element:", data.authenticateSalesRep[0]);
        }
      }

      if (data?.authenticateSalesRep?.[0]?.token) {
        const salesRepData = data.authenticateSalesRep[0];
        const token = salesRepData.token;
        const userData: User = {
          ...salesRepData.salesRep,
          userType: "salesRep",
        };

        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: Saving to localStorage:", {
            token: token.substring(0, 20) + "...",
            userData,
          });
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setError(null);

        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: Successfully saved to localStorage");
          console.log(
            "Auth: Verification - token in localStorage:",
            localStorage.getItem("token") ? "EXISTS" : "NULL",
          );
          console.log(
            "Auth: Verification - user in localStorage:",
            localStorage.getItem("user") ? "EXISTS" : "NULL",
          );
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "Auth: No token found in response structure. Full data:",
            data,
          );
          console.log(
            "Auth: Expected path data?.authenticateSalesRep?.[0]?.token failed",
          );
        }
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const isTokenValid = (token: string): boolean => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      const parts = token.split(".");
      if (parts.length !== 3 || !parts[1]) {
        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: Invalid token format");
        }
        return false;
      }
      const payload = JSON.parse(window.atob(parts[1]));

      if (process.env.NODE_ENV !== "production") {
        console.log("Auth: Token payload:", payload);
      }

      if (!payload.exp) {
        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: Token has no expiration, considering valid");
        }
        return true;
      }

      const currentTime = Date.now() / 1000;
      const isValid = payload.exp > currentTime;

      if (process.env.NODE_ENV !== "production") {
        console.log("Auth: Token validation:", {
          exp: payload.exp,
          currentTime,
          isValid,
          timeUntilExpiry: payload.exp - currentTime,
        });
      }

      return isValid;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Auth: Token validation error:", error);
      }
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window === "undefined") {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "Auth: Server-side rendering, skipping auth initialization",
          );
        }
        setIsLoading(false);
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.log("Auth: Initializing authentication...");
      }

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (process.env.NODE_ENV !== "production") {
        console.log("Auth: Retrieved from localStorage:", {
          hasToken: !!token,
          hasUserData: !!userData,
          tokenLength: token?.length || 0,
        });
      }

      if (token && userData && isTokenValid(token)) {
        try {
          const parsedUser = JSON.parse(userData);
          if (process.env.NODE_ENV !== "production") {
            console.log(
              "Auth: Successfully restored user session:",
              parsedUser,
            );
          }
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          if (process.env.NODE_ENV !== "production") {
            console.log("Auth: Failed to parse user data, logging out");
          }
          logout();
        }
      } else if (token) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "Auth: Token exists but is invalid or missing user data, logging out",
          );
        }
        logout();
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: No token found, user not authenticated");
        }
      }

      setIsLoading(false);
    };

    initializeAuth();

    const checkTokenExpiration = () => {
      if (typeof window === "undefined") {
        return;
      }
      const token = localStorage.getItem("token");
      if (token && !isTokenValid(token)) {
        if (process.env.NODE_ENV !== "production") {
          console.log("Auth: Token expired, logging out");
        }
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
