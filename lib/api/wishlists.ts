import { gql } from "@apollo/client";
import { PaginationResults } from "./customers";

export const GET_WISHLISTS = gql`
  query getWishlists(
    $id: [Int]
    $customerId: [Int]
    $pagination: Pagination
    $sortOrder: SortOrderInput
  ) {
    getWishlists(
      id: $id
      customerId: $customerId
      pagination: $pagination
      sortOrder: $sortOrder
    ) {
      wishlists {
        id
        createdAt
        updatedAt
        name
        notes
        customer {
          id
          email
          firstName
          middleName
          lastName
        }
        location {
          id
          name
          code
        }
        items {
          id
          wishlistId
          product {
            id
            sku
            name
            thumbnailImage
            variationInfo
            indexPrice
          }
          qty
          position
          notes
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
}

export interface WishlistItemProduct {
  id: number;
  sku: string;
  name: string;
  thumbnailImage: string;
  variationInfo?: string;
  indexPrice: number;
}

export interface WishlistItem {
  id?: number;
  wishlistId: number;
  product: WishlistItemProduct;
  qty: number;
  position?: number;
  notes?: string;
}

export interface Wishlist {
  id?: number;
  name: string;
  notes?: string;
  customer: CustomerInfo;
  location: {
    id: number;
    name: string;
    code: string;
  };
  createdAt?: string;
  updatedAt?: string;
  items?: WishlistItem[];
}

export interface WishlistResult {
  wishlists: Wishlist[];
  pagination: PaginationResults;
}
