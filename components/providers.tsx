'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../lib/auth-context';
import client from '../lib/apollo-client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  );
}
