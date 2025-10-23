import { NextRequest, NextResponse } from 'next/server';

/**
 * Get the base URL for the application based on environment
 * Production: https://edusync.appwrite.network
 * Development: Uses request host
 */
function getBaseUrl(request: NextRequest): string {
  // Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    // Use the production URL from environment or default to your production domain
    return process.env.NEXT_PUBLIC_APP_URL || 'https://edusync.appwrite.network';
  }
  
  // Development mode: use the request's host
  return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function GET(request: NextRequest) {
  try {
    // Get the proper app URL based on environment
    const appUrl = getBaseUrl(request);
    
    // For GitHub OAuth, redirect to role selection page
    // The client-side code will handle checking if user exists
    const selectRoleUrl = new URL('/auth/select-role', appUrl);
    selectRoleUrl.searchParams.set('fromOAuth', 'true');
    
    return NextResponse.redirect(selectRoleUrl);
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error);
    
    // Get the proper app URL for error redirect
    const appUrl = getBaseUrl(request);
    
    // Redirect to login with error
    const loginUrl = new URL('/login', appUrl);
    loginUrl.searchParams.set('error', 'oauth_failed');
    
    return NextResponse.redirect(loginUrl);
  }
}
