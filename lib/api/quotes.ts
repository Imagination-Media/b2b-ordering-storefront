import { gql } from "@apollo/client";
import { PaginationResults } from "./customers";

export const GET_QUOTES = gql`
  query getQuotes(
    $id: [Int]
    $customerId: [Int]
    $salesRepId: [Int]
    $location: [String]
    $pagination: Pagination
    $sortOrder: SortOrderInput
  ) {
    getQuotes(
      id: $id
      customerId: $customerId
      salesRepId: $salesRepId
      location: $location
      pagination: $pagination
      sortOrder: $sortOrder
    ) {
      quotes {
        id
        customer {
          id
          email
          firstName
          middleName
          lastName
          customerNumber
          customerGroupId
        }
        location {
          id
          name
          code
        }
        identifier
        shippingMethod
        shippingCost
        paymentMethod
        notes
        tax
        poNumber
        salesRepId
        items {
          id
          quoteId
          product {
            id
            sku
            name
            type
            indexPrice
            thumbnailImage
            variationInfo
          }
          qty
          customPrice
          sidemark
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

export interface CustomerInfo {
  id: number;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  customerNumber?: string;
  customerGroupId?: number;
}

export interface QuoteItemProduct {
  id: number;
  sku: string;
  name: string;
  type: string;
  indexPrice: number;
  thumbnailImage: string;
  variationInfo?: string;
}

export interface QuoteItem {
  id?: number;
  quoteId?: number;
  product: QuoteItemProduct;
  qty: number;
  customPrice?: number;
  sidemark?: string;
}

export interface Quote {
  id?: number;
  customer: CustomerInfo;
  location: {
    id: number;
    name: string;
    code: string;
  };
  identifier?: string;
  shippingMethod?: string;
  shippingCost?: number;
  paymentMethod?: string;
  notes?: string;
  tax?: number;
  poNumber?: string;
  salesRepId?: number;
  items?: QuoteItem[];
}

export interface GetQuotesResult {
  quotes: Quote[];
  pagination: PaginationResults;
}
