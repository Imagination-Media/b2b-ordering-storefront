import { gql } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query getCustomers(
    $pagination: Pagination
    $id: [Int]
    $firstName: String
    $lastName: String
    $email: String
    $customerNumber: String
    $channels: [Int]
    $customerGroups: [Int]
    $customFieldsFilter: [CustomFieldFilterInput]
    $sortOrder: SortOrderInput
  ) {
    getCustomers(
      pagination: $pagination
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      customerNumber: $customerNumber
      channel: $channels
      customerGroups: $customerGroups
      customFieldsFilter: $customFieldsFilter
      sortOrder: $sortOrder
    ) {
      customers {
        id
        firstName
        middleName
        lastName
        email
        createdAt
        updatedAt
        customerNumber
        netTerms
        companyName
        addresses {
          id
          customerId
          region
          country
          street
          company
          telephone
          postcode
          city
          firstName
          lastName
          middleName
          defaultShipping
          defaultBilling
        }
        customerGroup {
          id
          name
          taxClassId
        }
        channels {
          id
          name
          code
        }
        creditCards {
          paymentMethodType
          paymentProvider
          last4
          id
          holderName
          expYear
          expMonth
          customerId
          cardType
          billingAddressId
        }
        fields {
          id
          customerId
          name
          value
          labelName
          labelValue
        }
      }
      pagination {
        totalItems
        totalItemOnPage
        totalPages
        currentPage
        pageSize
      }
    }
  }
`;

export const GET_CUSTOMER = gql`
  query getCustomer($id: [Int]!) {
    getCustomers(id: $id) {
      customers {
        id
        firstName
        middleName
        lastName
        email
        createdAt
        updatedAt
        customerNumber
        netTerms
        companyName
        addresses {
          id
          customerId
          region
          country
          street
          company
          telephone
          postcode
          city
          firstName
          lastName
          middleName
          defaultShipping
          defaultBilling
        }
        customerGroup {
          id
          name
          taxClassId
        }
        channels {
          id
          name
          code
        }
        salesReps {
          id
          firstName
          lastName
          code
          email
        }
        creditCards {
          paymentMethodType
          paymentProvider
          last4
          id
          holderName
          expYear
          expMonth
          customerId
          cardType
          billingAddressId
        }
        fields {
          id
          customerId
          name
          value
          labelName
          labelValue
        }
      }
      pagination {
        totalItems
        totalItemOnPage
        totalPages
        currentPage
        pageSize
      }
    }
  }
`;

export interface Address {
  id?: number;
  customerId?: number;
  region: string;
  country: string;
  street: string[];
  company?: string;
  telephone?: string;
  postcode: string;
  city: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
}

export interface CreditCard {
  id?: number;
  paymentMethodType?: string;
  paymentProvider?: string;
  customerId?: number;
  cardType: string;
  last4: number;
  expMonth: number;
  expYear: number;
  holderName: string;
  billingAddressId?: number;
}

export interface CustomerField {
  id?: number;
  name: string;
  value: string;
  labelName?: string;
  labelValue?: string;
}

export interface Channel {
  id: number;
  name: string;
  code: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  taxClassId?: number;
}

export interface Customer {
  id?: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  addresses?: Address[];
  customerNumber?: string;
  netTerms?: string;
  companyName?: string;
  customerGroup?: CustomerGroup;
  channels?: Channel[];
  salesReps?: {
    id: number;
    firstName: string;
    lastName: string;
    code: string;
    email: string;
  }[];
  creditCards?: CreditCard[];
  fields?: CustomerField[];
}

export interface PaginationResults {
  totalItems: number;
  totalItemOnPage: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetCustomersResponse {
  customers: Customer[];
  pagination: PaginationResults;
}
