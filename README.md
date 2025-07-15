# B2B Ordering Storefront

A high-performance, server-rendered Next.js App Router B2B ecommerce application with dual authentication system.

This application connects to the Imagination Media B2B ordering middleware API and provides separate login interfaces for sales representatives and customers. Built with React Server Components, Server Actions, `Suspense`, Apollo Client, and modern authentication patterns.

## Features

### Dual Authentication System

- **Sales Representative Login**: Full access to sales dashboard with customer management, orders, quotes, and more
- **Customer Login**: Coming soon - dedicated customer portal for order management and account access
- **Protected Routes**: Automatic redirection based on user type and authentication status
- **JWT Token Management**: Secure authentication with automatic token validation and refresh

### Sales Representative Dashboard

- Customer management and company oversight
- Order tracking and management
- Quote generation and management
- Cart and wishlist oversight
- Responsive design with mobile-friendly navigation

### API Integration

- **GraphQL API**: Connects to Imagination Media B2B ordering middleware
- **Apollo Client**: Robust GraphQL client with caching and error handling
- **Real-time Updates**: Automatic data synchronization with backend systems

### Modern Architecture

- **Next.js 15**: Latest App Router with React Server Components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with responsive design
- **Server Actions**: Optimized server-side operations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm package manager
- Access to the B2B ordering middleware API

### Environment Setup

1. Copy the environment variables from `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Configure the required environment variables in `.env.local`:

```bash
COMPANY_NAME="Your Company Name"
SITE_NAME="B2B Ordering Storefront"
NEXT_PUBLIC_API_URL="https://b2bapp-api.imdigital.com/graphql"
```

> Note: You should not commit your `.env.local` file as it may contain sensitive configuration.

### Installation and Development

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Authentication Flow

#### Sales Representative Login

1. Navigate to `/login/sales-rep`
2. Enter your sales representative credentials
3. Access the sales dashboard at `/dashboard`

#### Customer Login

1. Navigate to `/login/customer`
2. Currently shows "Coming Soon" - customer authentication will be available soon
3. Sign up for notifications when customer portal is ready

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prettier:check` - Check code formatting

## API Integration

This application connects to the Imagination Media B2B ordering middleware API using GraphQL. The API provides:

- Sales representative authentication
- Customer and company management
- Order and quote processing
- Cart and wishlist functionality
- Product catalog access

### GraphQL Endpoint

The default API endpoint is configured to use the demo environment:

```
https://b2bapp-api.imdigital.com/graphql
```

For production deployments, update the `NEXT_PUBLIC_API_URL` environment variable to point to your production API endpoint.

## Deployment

This application can be deployed to any platform that supports Next.js applications:

- **Vercel**: Recommended for seamless deployment with automatic builds
- **Netlify**: Alternative hosting with similar features
- **Docker**: Containerized deployment for custom infrastructure

Make sure to configure the environment variables in your deployment platform to match your production API endpoints.
