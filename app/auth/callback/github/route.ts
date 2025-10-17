import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the proper app URL from environment or request headers
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // For GitHub OAuth, redirect to role selection page
    // The client-side code will handle checking if user exists
    const selectRoleUrl = new URL('/auth/select-role', appUrl);
    selectRoleUrl.searchParams.set('fromOAuth', 'true');
    
    return NextResponse.redirect(selectRoleUrl);
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error);
    
    // Get the proper app URL for error redirect
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    // Redirect to login with error
    const loginUrl = new URL('/login', appUrl);
    loginUrl.searchParams.set('error', 'oauth_failed');
    
    return NextResponse.redirect(loginUrl);
  }
}
