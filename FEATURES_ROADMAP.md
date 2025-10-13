# EduSync Features Roadmap

## ✅ Completed (7/10 Issues Fixed)

### 1. ✅ Quiz Attempts Bug - FIXED
- **Issue**: Quiz attempts counting globally instead of per-student
- **Solution**: Added `Query.equal('userId', user.$id)` filter
- **File**: `app/dashboard/student/quizzes/page.tsx`

### 2. ✅ Dark Theme on Teacher Quizzes - FIXED
- **Issue**: White background breaking dark theme
- **Solution**: Applied `bg-gray-800` and dark theme classes
- **File**: `app/dashboard/teacher/quizzes/page.tsx`

### 3. ✅ Live Chat Positioning - FIXED
- **Issue**: Chat button hidden behind Sentry button
- **Solution**: Moved to `bottom-6 right-24` with `z-40`
- **File**: `components/LiveChat.tsx`

### 4. ✅ Live Chat Functionality - FIXED
- **Issue**: Only simulated responses
- **Solution**: Created API endpoint with smart auto-responses
- **Files**: `app/api/chat/route.ts`, `components/LiveChat.tsx`

### 5. ✅ Newsletter with Resend - FIXED
- **Issue**: No email sending
- **Solution**: Implemented Resend with HTML emails (no React Email dependency)
- **File**: `app/api/newsletter/route.ts`

### 6. ✅ Offline Functionality - FIXED
- **Issue**: App broken offline
- **Solution**: Service worker, IndexedDB, background sync
- **Files**: `public/sw.js`, `public/offline.html`, `components/ServiceWorkerRegistration.tsx`

### 7. ✅ Build Error - FIXED
- **Issue**: `Module not found: Can't resolve '@react-email/render'`
- **Solution**: Switched from React templates to HTML strings
- **File**: `app/api/newsletter/route.ts`

---

## 🚧 Remaining Features to Implement

### 8. Collaboration Features
**User Requirements:**
- ✅ Real-time document editing
- ✅ Video conferencing
- ✅ Screen sharing
- ✅ Chat rooms
- ✅ Whiteboard

**Recommended Tech Stack:**
```typescript
// Real-time Document Editing
- Yjs or Y-websocket for CRDT
- TipTap or Quill editor
- WebSocket for real-time sync

// Video Conferencing
- Daily.co API (easiest)
- Agora.io
- OR Jitsi (open source)

// Screen Sharing
- WebRTC Screen Capture API
- getUserMedia() with displayMedia

// Chat Rooms
- Socket.io or Pusher
- Real-time message sync

// Whiteboard
- Excalidraw (open source)
- TLDraw
- Fabric.js
```

**Implementation Steps:**
1. Create `/app/features/collaboration/[featureId]/page.tsx` for each feature
2. Set up WebSocket server (Socket.io)
3. Implement real-time state sync with Yjs
4. Add video conferencing with Daily.co
5. Integrate Excalidraw for whiteboard
6. Create chat rooms with Socket.io

**Files to Create:**
- `app/features/collaboration/documents/page.tsx` - Real-time editing
- `app/features/collaboration/video/page.tsx` - Video conferencing
- `app/features/collaboration/whiteboard/page.tsx` - Collaborative whiteboard
- `app/features/collaboration/chat/page.tsx` - Group chat rooms
- `lib/socket.ts` - Socket.io client setup
- `lib/websocket-server.ts` - WebSocket server (or use separate Node server)

---

### 9. Integration Features
**User Requirements:**
- ✅ Google Calendar
- ✅ Zoom
- ✅ Slack
- ✅ GitHub/GitLab
- ✅ Payment gateways (Stripe/PayPal)

**Recommended Approach:**
```typescript
// Google Calendar Integration
import { google } from 'googleapis';
const calendar = google.calendar('v3');

// Zoom Integration
import { Zoom } from '@zoom/meetingsdk';

// Slack Integration
import { WebClient } from '@slack/web-api';

// GitHub/GitLab
import { Octokit } from '@octokit/rest';

// Payment Gateways
import Stripe from 'stripe';
```

**Implementation Steps:**

#### Google Calendar
1. Set up Google Cloud Project
2. Enable Calendar API
3. Create OAuth 2.0 credentials
4. Implement calendar sync for assignments/quizzes
5. Add "Add to Calendar" button

#### Zoom
1. Create Zoom OAuth app
2. Implement meeting creation
3. Add "Start Meeting" button on dashboard
4. Store meeting links in Appwrite

#### Slack
1. Create Slack app
2. Add slash commands `/edusync`
3. Send notifications for new assignments
4. Create announcement channels

#### GitHub/GitLab
1. OAuth integration
2. Link repos to projects
3. Show commit history
4. Auto-create issues for assignments

#### Payment Gateway
1. Set up Stripe account
2. Create payment endpoints
3. Add subscription plans
4. Implement checkout flow

**Files to Create:**
- `app/api/integrations/google-calendar/route.ts`
- `app/api/integrations/zoom/route.ts`
- `app/api/integrations/slack/route.ts`
- `app/api/integrations/github/route.ts`
- `app/api/integrations/stripe/route.ts`
- `lib/integrations/google-calendar.ts`
- `lib/integrations/zoom.ts`
- `lib/integrations/slack.ts`
- `components/IntegrationCard.tsx`

---

### 10. API Endpoints Implementation
**Current Status**: `/api` page exists but endpoints are placeholders

**Endpoints Listed on `/app/api/page.tsx`:**
```typescript
GET  /api/v1/user                    - Get current user info
GET  /api/v1/materials               - List all learning materials
POST /api/v1/materials               - Create new material
GET  /api/v1/quizzes                 - List all quizzes
POST /api/v1/quizzes                 - Create new quiz
GET  /api/v1/assignments             - List all assignments
POST /api/v1/assignments             - Submit assignment
PUT  /api/v1/user/profile            - Update user profile
DELETE /api/v1/materials/:id         - Delete material
```

**Implementation Required:**
1. Create API route files for each endpoint
2. Add authentication middleware
3. Implement CRUD operations with Appwrite
4. Add rate limiting
5. Add API key generation
6. Create API documentation

**Files to Create:**
- `app/api/v1/user/route.ts`
- `app/api/v1/materials/route.ts`
- `app/api/v1/materials/[id]/route.ts`
- `app/api/v1/quizzes/route.ts`
- `app/api/v1/assignments/route.ts`
- `app/api/v1/user/profile/route.ts`
- `middleware/api-auth.ts`
- `middleware/rate-limit.ts`
- `lib/api-keys.ts`

**Example Implementation:**
```typescript
// app/api/v1/user/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await auth.getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: user.$id,
      email: user.email,
      name: user.name,
      role: user.labels?.[0] || 'student',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

## Priority Order

### Phase 1: API Endpoints (1-2 days)
- Implement all 9 API v1 endpoints
- Add authentication
- Create API documentation
- Test with Postman/Thunder Client

### Phase 2: Integrations (3-5 days)
- Start with Google Calendar (most requested)
- Add Zoom meetings
- Implement Stripe payments
- Add Slack notifications
- GitHub/GitLab integration

### Phase 3: Collaboration (5-7 days)
- Real-time document editing (highest priority)
- Video conferencing
- Group chat rooms
- Whiteboard
- Screen sharing

---

## Environment Variables Needed

Add to `.env.local`:
```bash
# Already have
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
RESEND_API_KEY=

# Need to add
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ZOOM_CLIENT_ID=
ZOOM_CLIENT_SECRET=
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
DAILY_API_KEY=  # For video conferencing
```

---

## Estimated Timeline

- **API Endpoints**: 1-2 days
- **Google Calendar**: 1 day
- **Zoom Integration**: 1 day
- **Stripe Payments**: 1-2 days
- **Slack Notifications**: 1 day
- **GitHub Integration**: 1 day
- **Real-time Editing**: 2-3 days
- **Video Conferencing**: 2 days
- **Whiteboard**: 1-2 days
- **Chat Rooms**: 1-2 days
- **Screen Sharing**: 1 day

**Total Estimated Time**: 14-20 days

---

## Next Steps

1. **Immediate**: Verify all 7 completed fixes work correctly
2. **Short-term**: Implement API v1 endpoints (foundation for everything)
3. **Medium-term**: Add critical integrations (Calendar, Zoom, Payments)
4. **Long-term**: Build collaboration features (real-time editing, video, whiteboard)

---

## Testing Checklist

### Before Starting New Features:
- [ ] Newsletter sends emails correctly
- [ ] Service worker registers
- [ ] Offline mode works
- [ ] Quiz attempts are per-student
- [ ] Dark theme consistent everywhere
- [ ] Live chat functional
- [ ] Build completes without errors

### After Each Feature:
- [ ] Create unit tests
- [ ] Test authentication
- [ ] Check error handling
- [ ] Verify mobile responsiveness
- [ ] Update documentation
- [ ] Add to changelog
