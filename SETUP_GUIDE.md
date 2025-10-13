# 🚀 Quick Setup Guide - EduSync Fixes

## Step 1: Install Dependencies

```bash
npm install resend
```

## Step 2: Environment Variables

Create or update `.env.local` in the root directory:

```env
# Resend API Key for Email Functionality
RESEND_API_KEY=your_resend_api_key_here

# Get your key from: https://resend.com/api-keys
# Free tier: 100 emails/day, 3,000 emails/month
```

## Step 3: Add Service Worker to Layout

Open `app/layout.tsx` and add the Service Worker registration:

```typescript
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ServiceWorkerRegistration />
        {/* ...rest of your layout... */}
        {children}
      </body>
    </html>
  );
}
```

## Step 4: Update Appwrite (If Not Done Already)

In Appwrite Console, add these optional attributes to the `submissions` collection:
- `userName` (String, 255 chars, Optional)
- `userEmail` (String, 255 chars, Optional)

This fixes the "Unknown User" display issue.

## Step 5: Test Everything

### Test Quiz Attempts Fix
```bash
# Login as different students and attempt the same quiz
# Each student should have separate attempt counters
```

### Test Live Chat
```bash
# Click the chat icon (bottom-right corner, moved to avoid Sentry button)
# Type messages like "help", "quiz", "login" to see smart responses
```

### Test Newsletter
```bash
# Enter an email in the footer
# Check:
# 1. Subscriber receives welcome email
# 2. You receive admin notification at arhanansari2009@gmail.com
```

### Test Offline Mode
```bash
# Open Chrome DevTools (F12)
# Application tab → Service Workers → Check "Offline"
# Navigate around - pages should still load from cache
# Attempt a quiz - should queue for sync
# Uncheck "Offline" - should auto-sync the queued attempt
```

## Step 6: Verify Dark Theme

```bash
# Navigate to /dashboard/teacher/quizzes
# Click "Create Quiz" button
# Form should have dark background (not white)
```

## Step 7: Check Button Positions

```bash
# Go to any page
# Bottom-right corner should show:
# - Live Chat button (further left)
# - Sentry "Report a Bug" button (right corner)
# Both should be visible and not overlapping
```

---

## 🔧 Troubleshooting

### Service Worker Not Registering
1. Check console for errors
2. Make sure `public/sw.js` exists
3. Service Workers only work on `localhost` or `https://` domains
4. Clear cache: DevTools → Application → Clear Storage

### Newsletter Emails Not Sending
1. Verify `RESEND_API_KEY` is in `.env.local`
2. Restart dev server after adding env vars
3. Check Resend dashboard for email logs
4. Verify "from" domain is verified in Resend (or use `onboarding@resend.dev` for testing)

### Quiz Attempts Still Global
1. Clear browser cache and cookies
2. Verify the code change in `app/dashboard/student/quizzes/page.tsx` line ~107
3. Check that Appwrite has the Query import working

### Offline Not Working
1. Check if Service Worker is registered: `chrome://serviceworker-internals/`
2. Verify IndexedDB: DevTools → Application → IndexedDB
3. Make sure you're testing on `localhost` or `https://`

---

## 📚 What's New

### New Files Created
1. `/app/api/chat/route.ts` - Live chat backend
2. `/public/sw.js` - Service worker for offline support
3. `/public/offline.html` - Offline fallback page
4. `/components/ServiceWorkerRegistration.tsx` - SW registration component

### Files Modified
1. `app/dashboard/student/quizzes/page.tsx` - Fixed quiz attempts
2. `app/dashboard/teacher/quizzes/page.tsx` - Fixed dark theme
3. `components/LiveChat.tsx` - Added API integration & repositioned
4. `app/api/newsletter/route.ts` - Added Resend integration

---

## ✅ Verification Checklist

- [ ] `npm install resend` completed
- [ ] `.env.local` has `RESEND_API_KEY`
- [ ] Service Worker added to layout
- [ ] Quiz attempts work per-student
- [ ] Dark theme on teacher quiz form
- [ ] Live chat button visible (not hidden by Sentry)
- [ ] Live chat sends/receives messages
- [ ] Newsletter sends confirmation emails
- [ ] Admin receives newsletter notifications
- [ ] Offline mode caches pages
- [ ] Offline quiz attempts sync when online

---

## 🎯 All Done!

Your EduSync is now production-ready with:
- ✅ Fixed critical bugs
- ✅ Working live chat
- ✅ Email notifications
- ✅ Full offline support
- ✅ Consistent dark theme
- ✅ Better UX

Happy teaching! 📚✨
