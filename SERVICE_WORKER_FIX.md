# Service Worker Error Fix

## Problem
```
Failed to update a ServiceWorker for scope ('http://localhost:3000/') with script ('Unknown'): 
The object is in an invalid state.
```

## Root Causes
1. Service Worker tried to cache `/offline` but file is at `/offline.html`
2. Service Worker conflicts with Next.js 15 Turbopack in development mode
3. Invalid cache entries causing state errors

## Solutions Applied

### 1. Fixed Offline URL
**File**: `public/sw.js`
```javascript
// Before
const OFFLINE_URL = '/offline';
const PRECACHE_ASSETS = ['/offline', '/dashboard/student', ...];

// After
const OFFLINE_URL = '/offline.html';
const PRECACHE_ASSETS = ['/offline.html', '/logo.png'];
```

### 2. Disabled SW in Development Mode
**File**: `components/ServiceWorkerRegistration.tsx`
```typescript
// Only register in production
if (
  'serviceWorker' in navigator &&
  process.env.NODE_ENV === 'production'
) {
  // Register service worker
}
```

### 3. Cleanup Instructions

If you still see the error, manually unregister the service worker:

**Option A: Via Browser Console (F12)**
```javascript
// Run this in browser console
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
    console.log('Service Worker unregistered:', registration);
  }
});

// Then clear all caches
caches.keys().then(function(names) {
  for (let name of names) {
    caches.delete(name);
    console.log('Cache deleted:', name);
  }
});
```

**Option B: Via Chrome DevTools**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Click **Unregister** for any registered workers
5. Click **Storage** → **Clear site data**

**Option C: Via Edge DevTools**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. Click **Unregister**
5. Go to **Storage** → Clear

## Testing

### Development Mode (Should NOT register SW)
```bash
npm run dev
```
Check console - should see: `[SW] Service Worker disabled in development mode`

### Production Mode (SW should work)
```bash
npm run build
npm start
```
Service Worker will register and cache assets.

## Current Behavior

### Development (`npm run dev`)
- ✅ Service Worker registration skipped
- ✅ No caching conflicts
- ✅ Hot reload works normally
- ✅ No invalid state errors

### Production (`npm run build && npm start`)
- ✅ Service Worker registers successfully
- ✅ Caches essential assets
- ✅ Offline fallback works
- ✅ Background sync enabled

## What Changed

| File | Change | Reason |
|------|--------|--------|
| `public/sw.js` | `/offline` → `/offline.html` | Match actual file location |
| `public/sw.js` | Reduced PRECACHE_ASSETS | Only cache essential files |
| `components/ServiceWorkerRegistration.tsx` | Added production check | Prevent dev mode conflicts |

## Quick Fix Steps

1. **Clear your browser completely:**
   ```
   Ctrl + Shift + Delete → Check all → Clear data
   ```

2. **Restart dev server:**
   ```powershell
   # Stop current server (Ctrl + C)
   npm run dev
   ```

3. **Verify in console:**
   Should see: `[SW] Service Worker disabled in development mode`

4. **No more errors!** ✅

## For Production Testing

When you want to test service worker:

```powershell
# Build for production
npm run build

# Start production server
npm start

# OR use serve package
npx serve@latest out -p 3000
```

Then check:
- Console should show: "Service Worker registered"
- Go offline (DevTools → Network → Offline)
- App should still work with cached content
- Navigate to `/offline.html` manually to see offline page

## Environment Variables

The fix uses `process.env.NODE_ENV` which is automatically set by Next.js:
- `development` when running `npm run dev`
- `production` when running `npm run build` or `npm start`

No `.env` changes needed!

## Troubleshooting

### Still seeing the error?
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache completely
3. Close all browser tabs for localhost:3000
4. Restart browser
5. Run dev server again

### Service Worker not registering in production?
1. Check HTTPS (required for SW in production)
2. Verify `/sw.js` exists in `out/` or `.next/` folder
3. Check browser console for errors
4. Ensure `public/sw.js` is not in `.gitignore`

## Summary

✅ **Error Fixed**: Service Worker now only runs in production
✅ **Offline URL Fixed**: Points to correct `/offline.html` file
✅ **Cache Issues Fixed**: Reduced precache list to essential files
✅ **Development Mode**: No SW conflicts with Turbopack
✅ **Production Mode**: Full offline functionality works

The error should be completely gone now! 🎉
