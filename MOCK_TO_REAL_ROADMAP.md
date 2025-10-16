# Mock Data to Real Database Conversion Roadmap

## Status: NOT YET STARTED
Priority: HIGH | Impact: Production-Ready | Effort: 3-4 hours

---

## Overview
Currently, all API endpoints and integration endpoints return **hardcoded demo/mock data** instead of querying the real Appwrite database. This document outlines the conversion plan.

### Current Architecture Issues
```
❌ /api/v1/user → Returns { demo user object }
❌ /api/v1/quizzes → Returns [ fake quizzes ]
❌ /api/integrations/google-calendar → Returns [ mock events ]
✅ Frontend components → Call these endpoints (correctly structured)
```

### Required Changes
Convert all endpoints to query real Appwrite collections and connect to real services.

---

## Part 1: API v1 Endpoints (9 files)

### Scope
These endpoints are called by frontend components. Currently return mock data, need real DB queries.

### Files to Convert
1. `app/api/v1/user/route.ts` - Get current user profile
2. `app/api/v1/user/profile/route.ts` - Update user profile
3. `app/api/v1/materials/route.ts` - List teaching materials
4. `app/api/v1/materials/[id]/route.ts` - Delete material
5. `app/api/v1/quizzes/route.ts` - List quizzes for student
6. `app/api/v1/quizzes/[id]/route.ts` - Get specific quiz
7. `app/api/v1/assignments/route.ts` - List assignments
8. `app/api/v1/assignments/[id]/route.ts` - Get specific assignment
9. `app/api/v1/submissions/route.ts` - Get student submissions

### Conversion Pattern

#### BEFORE (Current):
```typescript
// app/api/v1/user/route.ts
export async function GET(request: Request) {
  return Response.json({
    id: 'demo-user-123',
    name: 'Demo Student',
    email: 'demo@example.com',
    role: 'student',
  });
}
```

#### AFTER (Real):
```typescript
// app/api/v1/user/route.ts
import { auth, databases, config } from '@/lib/appwrite';

export async function GET(request: Request) {
  try {
    const session = await auth.getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await databases.getDocument(
      config.databaseId,
      config.collections.users,
      session.userId
    );

    return Response.json(userProfile);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
```

### Endpoints Details

#### 1. GET /api/v1/user
**Current**: Returns demo user object
**Convert to**: Query `users` collection by session userId
**Used by**: Student dashboard, user profile page

#### 2. PATCH /api/v1/user/profile
**Current**: Logs update, returns success
**Convert to**: Update `users` document in Appwrite
**Used by**: Profile settings page

#### 3. GET /api/v1/materials
**Current**: Returns array of demo materials
**Convert to**: Query `materials` collection, filter by creatorId (teacher)
**Used by**: Teacher materials list

#### 4. DELETE /api/v1/materials/[id]
**Current**: Logs delete, returns success
**Convert to**: Delete document from `materials` collection
**Used by**: Teacher deletes material

#### 5. GET /api/v1/quizzes
**Current**: Returns array of demo quizzes
**Convert to**: Query `quizzes` collection (for teacher) OR `quizzes` where creatorId matches (student)
**Used by**: Both teacher and student quiz lists

#### 6. GET /api/v1/quizzes/[id]
**Current**: Returns demo quiz details
**Convert to**: Get specific quiz document from `quizzes` collection
**Used by**: Quiz detail page

#### 7. GET /api/v1/assignments
**Current**: Returns array of demo assignments
**Convert to**: Query `assignments` collection (filter by teacher for teacher view, all for student view)
**Used by**: Assignment list pages

#### 8. GET /api/v1/assignments/[id]
**Current**: Returns demo assignment
**Convert to**: Get specific assignment from `assignments` collection
**Used by**: Assignment detail page

#### 9. POST /api/v1/submissions
**Current**: Returns demo submission list
**Convert to**: Query `submissions` collection, filter by student userId
**Used by**: Student submissions history

---

## Part 2: Integration Endpoints (5 files)

### Scope
These provide integration with third-party services. Currently return mock data, need real API calls.

### Files to Convert
1. `app/api/integrations/google-calendar/route.ts` - Get Google Calendar events
2. `app/api/integrations/zoom/route.ts` - Get Zoom meetings
3. `app/api/integrations/slack/route.ts` - Send Slack messages
4. `app/api/integrations/github/route.ts` - Get GitHub repos
5. `app/api/integrations/stripe/route.ts` - Process Stripe payments

### Conversion Details

#### Google Calendar Integration
```
BEFORE: Return fake events [ { title: 'Demo Event' } ]
AFTER: 
  1. Get user's Google OAuth token from Appwrite
  2. Call Google Calendar API: GET /calendar/v3/calendars/primary/events
  3. Return real calendar events
  NEEDS: google_auth_token stored in user profile
```

#### Zoom Integration
```
BEFORE: Return fake meetings [ { id: 'meeting-123' } ]
AFTER:
  1. Use Zoom API credentials
  2. Call GET /users/me/meetings
  3. Return real scheduled meetings
  NEEDS: Zoom API key and secret in environment
```

#### Slack Integration
```
BEFORE: Return { success: true } after logging
AFTER:
  1. Verify Slack token from user profile
  2. Call Slack API: POST /chat.postMessage
  3. Send message to configured channel
  NEEDS: slack_auth_token in user profile
```

#### GitHub Integration
```
BEFORE: Return fake repos [ { name: 'demo-repo' } ]
AFTER:
  1. Get user's GitHub OAuth token
  2. Call GitHub API: GET /user/repos
  3. Return real repositories
  NEEDS: github_auth_token in user profile
```

#### Stripe Integration
```
BEFORE: Return { transactionId: 'demo-123' }
AFTER:
  1. Create payment intent via Stripe API
  2. Process payment
  3. Store transaction record in Appwrite
  4. Return payment confirmation
  NEEDS: Stripe API key, public key, webhook endpoint
```

### Implementation Order
1. **Phase 1**: Google Calendar (most frequently used)
2. **Phase 2**: Zoom (important for education)
3. **Phase 3**: Slack (optional for team communication)
4. **Phase 4**: GitHub (for coding assignments)
5. **Phase 5**: Stripe (for premium features)

---

## Part 3: Collaboration Features (5 pages)

### Scope
Currently show demo UIs without real-time synchronization. Needs Socket.io or similar.

### Files to Update
1. `app/features/collaboration/documents/page.tsx` - Real-time document editor
2. `app/features/collaboration/video/page.tsx` - Real-time video conference
3. `app/features/collaboration/whiteboard/page.tsx` - Real-time drawing canvas
4. `app/features/collaboration/chat/page.tsx` - Real-time chat
5. `app/features/collaboration/screen-sharing/page.tsx` - Real-time screen share

### Required Packages
```bash
npm install socket.io-client yjs y-websocket y-protocols
npm install daily-js # For video conferencing
```

### Implementation Pattern
```typescript
// Before: Demo UI with no sync
<textarea value={demoContent} />

// After: Real-time sync with Socket.io
useEffect(() => {
  const socket = io('/collaboration');
  socket.on('document:update', (data) => {
    setContent(data.content);
  });
  socket.emit('document:edit', { id, content });
  return () => socket.disconnect();
}, []);
```

---

## Implementation Checklist

### Phase 1: API v1 Endpoints (3-4 hours)
- [ ] GET /api/v1/user - Query user profile
- [ ] PATCH /api/v1/user/profile - Update profile
- [ ] GET /api/v1/materials - List materials
- [ ] DELETE /api/v1/materials/[id] - Delete material
- [ ] GET /api/v1/quizzes - List quizzes
- [ ] GET /api/v1/quizzes/[id] - Get quiz details
- [ ] GET /api/v1/assignments - List assignments
- [ ] GET /api/v1/assignments/[id] - Get assignment details
- [ ] POST /api/v1/submissions - List submissions
- [ ] Test all endpoints with real data

### Phase 2: Integration Endpoints (2-3 hours)
- [ ] Setup Google Calendar integration
- [ ] Setup Zoom integration
- [ ] Setup Slack integration
- [ ] Setup GitHub integration
- [ ] Setup Stripe integration
- [ ] Store integration tokens securely
- [ ] Test each integration

### Phase 3: Collaboration Features (2-3 hours, future)
- [ ] Setup Socket.io server
- [ ] Implement real-time document sync
- [ ] Implement video conferencing
- [ ] Implement whiteboard sync
- [ ] Implement chat sync
- [ ] Implement screen share
- [ ] Add user presence indicators

---

## Environment Variables Needed

For integrations to work, add these to `.env.local`:

```
# Google Calendar
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Zoom
ZOOM_API_KEY=xxx
ZOOM_API_SECRET=xxx

# Slack
SLACK_BOT_TOKEN=xxx

# GitHub OAuth (already configured)
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=xxx
STRIPE_SECRET_KEY=xxx

# Socket.io (for real-time features)
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:3000
```

---

## Testing Strategy

### Unit Testing
```typescript
// Test each endpoint with mocked Appwrite
jest.mock('@/lib/appwrite', () => ({
  databases: {
    getDocument: jest.fn(),
  },
}));

test('GET /api/v1/user returns user profile', async () => {
  databases.getDocument.mockResolvedValue(mockUser);
  const response = await GET(request);
  expect(response.status).toBe(200);
});
```

### Integration Testing
1. Create test user in Appwrite
2. Call endpoints and verify real data returned
3. Verify database writes work
4. Verify error handling

### Performance Testing
- Measure response times with real data
- Optimize queries with indexes if needed
- Implement caching if necessary

---

## Success Metrics

- [ ] All 9 API endpoints return real Appwrite data
- [ ] All 5 integration endpoints connect to real services
- [ ] No hardcoded demo values
- [ ] Error handling for API failures
- [ ] Response times < 500ms (optimized)
- [ ] Zero console errors
- [ ] Production-ready data flow

---

## Estimated Timeline
- **Today**: Quiz fix ✅ + OAuth form ✅
- **This week**: API v1 endpoints conversion (3-4 hours)
- **Next week**: Integration endpoints (2-3 hours)
- **Future**: Real-time collaboration (2-3 hours)

**Total effort**: ~8-10 hours to full production readiness

---

## Risk Mitigation

### Data Migration
- Backup production data before changes
- Test with staging database first
- Implement gradual rollout if possible

### Performance
- Add indexes to Appwrite collections
- Implement caching for frequently accessed data
- Rate limit API calls

### Security
- Validate all user inputs
- Check permissions before database operations
- Store API keys securely (never in code)
- Use HTTPS for all API calls

---

## Notes

### Why Mock Data Was Used Initially
- Faster initial development
- No need for backend setup during UI development
- Easy to test different scenarios
- Demo purposes for stakeholders

### Benefits of Real Data Conversion
- Production-ready application
- Real data flow testing
- User data safety
- Compliance with data requirements
- Better performance optimization opportunities

### Recommendations
1. Convert API endpoints first (lower risk, high impact)
2. Test thoroughly before integration changes
3. Add monitoring/logging for troubleshooting
4. Document API contracts for frontend
5. Consider API versioning for future changes
