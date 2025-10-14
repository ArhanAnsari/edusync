import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For GitHub OAuth, redirect to role selection page
    // The client-side code will handle checking if user exists
    const selectRoleUrl = new URL('/auth/select-role', request.url);
    selectRoleUrl.searchParams.set('fromOAuth', 'true');
    
    return NextResponse.redirect(selectRoleUrl);
  } catch (error: any) {
    console.error('GitHub OAuth callback error:', error);
    
    // Redirect to login with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'oauth_failed');
    
    return NextResponse.redirect(loginUrl);
  }
}
