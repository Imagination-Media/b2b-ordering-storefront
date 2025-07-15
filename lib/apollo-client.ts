import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://b2bapp-api.imdigital.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export default client;

export interface SalesRepLoginResponse {
  authenticateSalesRep: Array<{
    token: string;
    salesRep: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      code: string;
      phone?: string;
    };
  }>;
}

export interface SalesRepLoginVariables {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  authenticateAdminUser: Array<{
    token: string;
    adminUser: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      username: string;
    };
  }>;
}

export interface AdminLoginVariables {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: "salesRep" | "customer" | "admin";
  code?: string;
  phone?: string;
  username?: string;
}
