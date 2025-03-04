'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, SalesRep } from '../../lib/b2b/types';

interface AuthContextType {
  authState: AuthState;
  login: (token: string, user: SalesRep, userType: 'salesRep' | 'customer') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    const userType = localStorage.getItem('userType') as 'salesRep' | 'customer' | undefined;

    if (token && userStr && userType) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          token,
          user,
          userType,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
      }
    }
  }, []);

  const login = (token: string, user: SalesRep, userType: 'salesRep' | 'customer') => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);

    setAuthState({
      isAuthenticated: true,
      token,
      user,
      userType,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');

    setAuthState({
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
