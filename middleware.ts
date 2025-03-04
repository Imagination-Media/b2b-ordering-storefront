// Next.js middleware for handling authentication and protected routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we're not implementing any protected routes
  // This will be expanded when we add more authentication features
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add protected routes here when needed
  ],
};
