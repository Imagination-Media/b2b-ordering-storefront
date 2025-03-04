import { SalesRep, SalesRepAuthenticationResponse } from './types';

// Use NEXT_PUBLIC prefix for client-side environment variables in Next.js
const B2B_API_ENDPOINT = process.env.NEXT_PUBLIC_B2B_API_ENDPOINT || 'https://b2bapp-api.imdigital.com/';

export async function authenticateSalesRep(email: string, password: string): Promise<SalesRepAuthenticationResponse> {
  try {
    const response = await fetch(B2B_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: {
          email,
          password,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message || 'Authentication failed');
    }

    return result.data.authenticateSalesRep[0];
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}
