import { gql } from "@apollo/client";
import { PaginationResults } from "./customers";

export const GET_CARTS = gql`
  query getCarts(
    $getCartsId: [Int]
    $customerId: [Int]
    $location: [String]
    $name: [String]
    $pagination: Pagination
    $sortOrder: SortOrderInput
  ) {
    getCarts(
      id: $getCartsId
      customerId: $customerId
      location: $location
      name: $name
      pagination: $pagination
      sortOrder: $sortOrder
    ) {
      carts {
        id
        createdAt
        updatedAt
        name
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
        items {
          id
          cartId
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

export interface CartItemProduct {
  id: number;
  sku: string;
  name: string;
  type: string;
  indexPrice: number;
  thumbnailImage: string;
  variationInfo?: string;
}

export interface CartItem {
  id?: number;
  cartId: number;
  product: CartItemProduct;
  qty: number;
  customPrice?: number;
  sidemark?: string;
}

export interface Cart {
  id?: number;
  name: string;
  customer: CustomerInfo;
  location: {
    id: number;
    name: string;
    code: string;
  };
  createdAt?: string;
  updatedAt?: string;
  items?: CartItem[];
}

export interface CartResult {
  carts: Cart[];
  pagination: PaginationResults;
}
