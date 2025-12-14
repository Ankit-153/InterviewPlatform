import { clerkMiddleware } from '@clerk/nextjs/server';

// Use the recommended minimal matcher to ensure Clerk detects middleware
export default clerkMiddleware();

export const config = {
  matcher: [
    // Run middleware for all routes except Next.js internals and static files
    '/((?!_next|.*\\..*).*)',
    // Always run for API routes
    '/(api)(.*)'
  ],
};