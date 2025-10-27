import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

/**
 * Get the base URL for the application based on environment
 */
function getBaseUrl(request: NextRequest): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_APP_URL || "https://edusync.appwrite.network";
  }
  return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function GET(request: NextRequest) {
  try {
    const appUrl = getBaseUrl(request);
    const url = new URL(request.url);

    // Extract OAuth query params from Appwrite redirect
    const userId = url.searchParams.get("userId");
    const secret = url.searchParams.get("secret");

    // If OAuth failed or missing params
    if (!userId || !secret) {
      const loginUrl = new URL("/login", appUrl);
      loginUrl.searchParams.set("error", "missing_oauth_params");
      return NextResponse.redirect(loginUrl);
    }

    // ✅ Create a new session using the OAuth2 token values
    await account.createSession(userId, secret);

    // Redirect to role selection (EduSync flow)
    const selectRoleUrl = new URL("/auth/select-role", appUrl);
    selectRoleUrl.searchParams.set("fromOAuth", "true");
    return NextResponse.redirect(selectRoleUrl);
  } catch (error: any) {
    console.error("GitHub OAuth callback error:", error);
    const appUrl = getBaseUrl(request);
    const loginUrl = new URL("/login", appUrl);
    loginUrl.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(loginUrl);
  }
}
