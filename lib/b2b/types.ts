export type SalesRep = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  code: string;
  phone?: string;
  groupId: number;
  tokens?: string[];
};

export type SalesRepAuthenticationResponse = {
  token: string;
  salesRep: SalesRep;
};

export type AuthState = {
  isAuthenticated: boolean;
  user?: SalesRep;
  token?: string;
  userType?: 'salesRep' | 'customer';
};
