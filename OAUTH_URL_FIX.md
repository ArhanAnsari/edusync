# GitHub OAuth URL Fix

## Problem
GitHub OAuth callback URLs were not working correctly in production mode. After successful login, the redirect URL was incorrect, causing issues with the role selection flow.

## Solution
Implemented environment-based URL handling that uses:
- **Production**: `https://edusync.appwrite.network`
- **Development**: `http://localhost:3000`

## Changes Made

### 1. Added `getBaseUrl()` Utility Function (`lib/utils.ts`)
```typescript
/**
 * Get the base URL for the application based on environment
 * Production: https://edusync.appwrite.network
 * Development: http://localhost:3000
 */
export function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_APP_URL || 'https://edusync.appwrite.network';
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
```

### 2. Updated `loginWithGitHub()` Function (`lib/auth.ts`)
- Now uses `getBaseUrl()` to determine the correct callback URL
- Automatically switches between production and development URLs

### 3. Updated GitHub Callback Route (`app/auth/callback/github/route.ts`)
- Added environment-aware URL detection
- Uses `NODE_ENV` to determine production vs development
- Consistent redirect URLs for both success and error cases

### 4. Added Environment Variable (`NEXT_PUBLIC_APP_URL`)
- Added to `.env.local` and `.env.example`
- Set to production URL: `https://edusync.appwrite.network`
- Automatically falls back to localhost in development

## How It Works

### Development Mode (`NODE_ENV=development`)
```
GitHub OAuth Callback URL: http://localhost:3000/auth/callback/github
Redirect to: http://localhost:3000/auth/select-role?fromOAuth=true
```

### Production Mode (`NODE_ENV=production`)
```
GitHub OAuth Callback URL: https://edusync.appwrite.network/auth/callback/github
Redirect to: https://edusync.appwrite.network/auth/select-role?fromOAuth=true
```

## Configuration

### Environment Variables
Add to your `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=https://edusync.appwrite.network
```

### GitHub OAuth Settings
Make sure your GitHub OAuth app has both URLs configured:
- **Development**: `http://localhost:3000/auth/callback/github`
- **Production**: `https://edusync.appwrite.network/auth/callback/github`

## Testing

### Development
```bash
npm run dev
# GitHub OAuth will use http://localhost:3000
```

### Production
```bash
npm run build
npm run start
# GitHub OAuth will use https://edusync.appwrite.network
```

## Benefits

✅ **Automatic Environment Detection**: No manual URL changes needed
✅ **Consistent Behavior**: Same code works in both environments
✅ **Easy Configuration**: Single environment variable controls everything
✅ **Production-Ready**: Proper URLs in production deployment
✅ **Developer-Friendly**: Works with localhost in development

## Related Files
- `lib/utils.ts` - Added `getBaseUrl()` utility
- `lib/auth.ts` - Updated `loginWithGitHub()` function
- `app/auth/callback/github/route.ts` - Updated callback handler
- `.env.local` - Added `NEXT_PUBLIC_APP_URL`
- `.env.example` - Added documentation for `NEXT_PUBLIC_APP_URL`
