# 🔗 Integration Setup Guide - Appwrite & External Providers

Complete guide for setting up all 5 third-party integrations in EduSync: GitHub, Google Calendar, Slack, Stripe, and Zoom.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Appwrite Database Setup](#appwrite-database-setup)
3. [GitHub Integration](#1-github-integration)
4. [Google Calendar Integration](#2-google-calendar-integration)
5. [Slack Integration](#3-slack-integration)
6. [Stripe Integration](#4-stripe-integration)
7. [Zoom Integration](#5-zoom-integration)
8. [Environment Variables](#environment-variables)
9. [Testing Integration APIs](#testing-integration-apis)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

EduSync supports 5 powerful integrations to enhance the learning experience:

| Integration | Purpose | Collections Required |
|------------|---------|---------------------|
| **GitHub** | Repository linking, assignment repos, commit tracking | `integrations` |
| **Google Calendar** | Event creation, assignment/quiz syncing | `calendar_events` |
| **Slack** | Notifications, announcements, grade alerts | `notifications` |
| **Stripe** | Payment processing, subscriptions | `payments` |
| **Zoom** | Meeting creation, video conferencing | `meetings` |

### 🔑 Key Features:
- ✅ **Graceful Fallback**: All integrations work without API keys (manual mode)
- ✅ **Database Storage**: All actions are tracked in Appwrite
- ✅ **OAuth Support**: Secure authentication for all providers
- ✅ **Role-Based Access**: Teachers have elevated permissions

---

## 🗄️ Appwrite Database Setup

### Prerequisites
- Appwrite project created at https://cloud.appwrite.io
- Database ID configured in `.env.local` as `NEXT_PUBLIC_APPWRITE_DATABASE_ID`

### Required Collections

You need to create the following collections in your Appwrite database:

---

#### **1. Integrations Collection** (for GitHub)

**Collection ID**: `integrations`

**Attributes**:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true,
    "array": false
  },
  "type": {
    "type": "string",
    "size": 50,
    "required": true,
    "array": false
  },
  "repoUrl": {
    "type": "string",
    "size": 500,
    "required": false,
    "array": false
  },
  "repoName": {
    "type": "string",
    "size": 255,
    "required": false,
    "array": false
  },
  "linkedAt": {
    "type": "string",
    "size": 100,
    "required": true,
    "array": false
  },
  "status": {
    "type": "string",
    "size": 50,
    "required": true,
    "array": false,
    "default": "active"
  }
}
```

**Indexes**:
- `userId_idx` → Key: `userId` (ASC)
- `type_idx` → Key: `type` (ASC)
- `status_idx` → Key: `status` (ASC)

**Permissions**:
- **Read**: Users can read their own documents (`read("user:[userId]")`)
- **Create**: Any authenticated user
- **Update**: Document owner only
- **Delete**: Document owner only

---

#### **2. Calendar Events Collection** (for Google Calendar)

**Collection ID**: `calendar_events`

**Attributes**:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "eventId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "title": {
    "type": "string",
    "size": 500,
    "required": true
  },
  "description": {
    "type": "string",
    "size": 2000,
    "required": false
  },
  "startTime": {
    "type": "string",
    "size": 100,
    "required": true
  },
  "endTime": {
    "type": "string",
    "size": 100,
    "required": true
  },
  "googleEventLink": {
    "type": "string",
    "size": 500,
    "required": false
  },
  "assignmentId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "quizId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "createdAt": {
    "type": "string",
    "size": 100,
    "required": true
  }
}
```

**Indexes**:
- `userId_idx` → Key: `userId` (ASC)
- `eventId_idx` → Key: `eventId` (ASC)

**Permissions**:
- **Read**: User's own events
- **Create/Update/Delete**: Document owner

---

#### **3. Notifications Collection** (for Slack)

**Collection ID**: `notifications`

**Attributes**:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "type": {
    "type": "string",
    "size": 50,
    "required": true
  },
  "channel": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "message": {
    "type": "string",
    "size": 5000,
    "required": false
  },
  "slackTs": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "status": {
    "type": "string",
    "size": 50,
    "required": true,
    "default": "pending"
  },
  "createdAt": {
    "type": "string",
    "size": 100,
    "required": true
  }
}
```

**Indexes**:
- `userId_idx` → Key: `userId` (ASC)
- `type_idx` → Key: `type` (ASC)
- `status_idx` → Key: `status` (ASC)

**Permissions**:
- **Read**: User's own notifications
- **Create/Update/Delete**: Document owner

---

#### **4. Payments Collection** (for Stripe)

**Collection ID**: `payments`

**Attributes**:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "sessionId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "amount": {
    "type": "integer",
    "required": true,
    "min": 0
  },
  "currency": {
    "type": "string",
    "size": 10,
    "required": true,
    "default": "usd"
  },
  "description": {
    "type": "string",
    "size": 1000,
    "required": false
  },
  "plan": {
    "type": "string",
    "size": 100,
    "required": false
  },
  "status": {
    "type": "string",
    "size": 50,
    "required": true,
    "default": "pending"
  },
  "checkoutUrl": {
    "type": "string",
    "size": 500,
    "required": false
  },
  "paidAt": {
    "type": "string",
    "size": 100,
    "required": false
  },
  "createdAt": {
    "type": "string",
    "size": 100,
    "required": true
  }
}
```

**Indexes**:
- `userId_idx` → Key: `userId` (ASC)
- `sessionId_idx` → Key: `sessionId` (ASC)
- `status_idx` → Key: `status` (ASC)

**Permissions**:
- **Read**: User's own payments
- **Create**: Any authenticated user
- **Update**: Server-side only (for webhooks)
- **Delete**: Admin only

---

#### **5. Meetings Collection** (for Zoom)

**Collection ID**: `meetings`

**Attributes**:
```json
{
  "userId": {
    "type": "string",
    "size": 255,
    "required": true
  },
  "meetingId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "topic": {
    "type": "string",
    "size": 500,
    "required": true
  },
  "agenda": {
    "type": "string",
    "size": 2000,
    "required": false
  },
  "duration": {
    "type": "integer",
    "required": true,
    "default": 60
  },
  "startTime": {
    "type": "string",
    "size": 100,
    "required": true
  },
  "joinUrl": {
    "type": "string",
    "size": 500,
    "required": false
  },
  "password": {
    "type": "string",
    "size": 100,
    "required": false
  },
  "hostEmail": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "status": {
    "type": "string",
    "size": 50,
    "required": true,
    "default": "pending"
  },
  "type": {
    "type": "string",
    "size": 50,
    "required": true
  },
  "assignmentId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "quizId": {
    "type": "string",
    "size": 255,
    "required": false
  },
  "createdAt": {
    "type": "string",
    "size": 100,
    "required": true
  }
}
```

**Indexes**:
- `userId_idx` → Key: `userId` (ASC)
- `meetingId_idx` → Key: `meetingId` (ASC)
- `type_idx` → Key: `type` (ASC)

**Permissions**:
- **Read**: User's own meetings + teachers can read all
- **Create**: Teachers only
- **Update/Delete**: Document owner (teacher)

---

### 📝 Quick Setup Script

Run this in Appwrite Console → Database → Your Database → Settings → Run Function:

```javascript
// This is pseudocode - create collections via Appwrite Console UI
const collections = [
  { id: 'integrations', name: 'Integrations' },
  { id: 'calendar_events', name: 'Calendar Events' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'payments', name: 'Payments' },
  { id: 'meetings', name: 'Meetings' }
];

// Create each collection and add attributes as shown above
```

---

## 1️⃣ GitHub Integration

### 📌 Purpose
- Link student repositories to assignments
- Track commits and code submissions
- Create assignment repositories automatically
- Fetch user repositories

### 🔧 Appwrite Setup
✅ **Collection Required**: `integrations`

### 🌐 GitHub Provider Setup

#### Option A: Personal Access Token (Quick Setup)

1. **Go to GitHub Settings**:
   - Navigate to https://github.com/settings/tokens
   - Click "Generate new token (classic)"

2. **Configure Token**:
   - **Note**: "EduSync Integration"
   - **Expiration**: 90 days (or custom)
   - **Scopes** (required):
     - ✅ `repo` (Full control of private repositories)
     - ✅ `read:user` (Read user profile data)
     - ✅ `user:email` (Access user email)

3. **Copy Token**:
   - Save the token securely (you won't see it again!)
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxx`

4. **Use in API Calls**:
   ```javascript
   const response = await fetch('/api/integrations/github', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       action: 'fetch_repos',
       token: 'ghp_your_token_here'
     })
   });
   ```

#### Option B: OAuth App (Production Setup)

1. **Create GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - **Application Name**: "EduSync"
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization Callback URL**: `https://yourdomain.com/api/auth/github/callback`

2. **Get Credentials**:
   - **Client ID**: `Ov23xxxxxxxxxxxxx`
   - **Client Secret**: (Generate one)

3. **Add to `.env.local`**:
   ```bash
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

4. **OAuth Flow**:
   - Redirect user to: `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo,user:email`
   - Handle callback and exchange code for access token
   - Use token in API calls

### 📡 API Endpoints

**Base URL**: `/api/integrations/github`

#### Actions:

**1. Link Repository**
```javascript
POST /api/integrations/github
{
  "action": "link_repo",
  "repoUrl": "https://github.com/username/repo",
  "repoName": "username/repo"
}
```

**2. Fetch User Repositories**
```javascript
POST /api/integrations/github
{
  "action": "fetch_repos",
  "token": "ghp_your_personal_access_token"
}
```

**3. Create Assignment Repository**
```javascript
POST /api/integrations/github
{
  "action": "create_assignment_repo",
  "token": "ghp_your_token",
  "assignmentId": "assignment_doc_id"
}
```

**4. Fetch Commits**
```javascript
POST /api/integrations/github
{
  "action": "fetch_commits",
  "token": "ghp_your_token",
  "repoName": "username/repo"
}
```

**5. List Linked Repositories**
```javascript
GET /api/integrations/github?action=linked_repos
```

**6. Unlink Repository**
```javascript
DELETE /api/integrations/github?id=integration_doc_id
```

### ✅ Testing
```bash
# Test repository fetch
curl -X POST http://localhost:3000/api/integrations/github \
  -H "Content-Type: application/json" \
  -d '{"action":"fetch_repos","token":"ghp_your_token"}'
```

---

## 2️⃣ Google Calendar Integration

### 📌 Purpose
- Create calendar events for assignments and quizzes
- Sync due dates automatically
- Set reminders for students
- List upcoming events

### 🔧 Appwrite Setup
✅ **Collection Required**: `calendar_events`

### 🌐 Google Cloud Setup

#### Step-by-Step Configuration:

1. **Create Google Cloud Project**:
   - Go to https://console.cloud.google.com/
   - Click "New Project"
   - **Project Name**: "EduSync"
   - Click "Create"

2. **Enable Google Calendar API**:
   - In your project, go to "APIs & Services" → "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

3. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - **Application type**: "Web application"
   - **Name**: "EduSync Web Client"
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback`
     - `https://yourdomain.com/api/auth/google/callback`

4. **Get Credentials**:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`

5. **Configure OAuth Consent Screen**:
   - Go to "OAuth consent screen"
   - **User Type**: External
   - **App Name**: "EduSync"
   - **User support email**: your@email.com
   - **Developer contact**: your@email.com
   - **Scopes**: Add `https://www.googleapis.com/auth/calendar`

6. **Add to `.env.local`**:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### 📡 API Endpoints

**Base URL**: `/api/integrations/google-calendar`

#### Actions:

**1. Create Calendar Event**
```javascript
POST /api/integrations/google-calendar
{
  "action": "create_event",
  "accessToken": "ya29.a0AfB_...",
  "eventTitle": "Assignment Due: Math Homework",
  "eventDescription": "Complete exercises 1-10",
  "startTime": "2025-10-20T10:00:00Z",
  "endTime": "2025-10-20T11:00:00Z",
  "attendees": ["student1@example.com", "student2@example.com"]
}
```

**Response (without token - manual mode)**:
```json
{
  "success": true,
  "manual": true,
  "calendarLink": "https://calendar.google.com/calendar/render?action=TEMPLATE&...",
  "message": "Calendar link generated. Configure Google OAuth for automatic event creation."
}
```

**2. List Calendar Events**
```javascript
POST /api/integrations/google-calendar
{
  "action": "list_events",
  "accessToken": "ya29.a0AfB_..."
}
```

**3. Sync Assignment to Calendar**
```javascript
POST /api/integrations/google-calendar
{
  "action": "sync_assignment",
  "accessToken": "ya29.a0AfB_...",
  "assignmentId": "assignment_doc_id"
}
```

**4. Sync Quiz to Calendar**
```javascript
POST /api/integrations/google-calendar
{
  "action": "sync_quiz",
  "accessToken": "ya29.a0AfB_...",
  "quizId": "quiz_doc_id"
}
```

**5. Get Synced Events**
```javascript
GET /api/integrations/google-calendar?action=synced_events
```

**6. Delete Event**
```javascript
DELETE /api/integrations/google-calendar?id=event_id&token=access_token
```

### 🔑 Getting Access Token (OAuth Flow)

```javascript
// 1. Redirect user to Google OAuth
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${REDIRECT_URI}` +
  `&response_type=code` +
  `&scope=https://www.googleapis.com/auth/calendar` +
  `&access_type=offline`;

// 2. Handle callback and exchange code for token
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: authCode,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  })
});

const { access_token } = await tokenResponse.json();
```

---

## 3️⃣ Slack Integration

### 📌 Purpose
- Send assignment notifications to Slack channels
- Announce new quizzes
- Grade notifications
- Custom announcements

### 🔧 Appwrite Setup
✅ **Collection Required**: `notifications`

### 🌐 Slack Workspace Setup

#### Step-by-Step Configuration:

1. **Create Slack App**:
   - Go to https://api.slack.com/apps
   - Click "Create New App"
   - Choose "From scratch"
   - **App Name**: "EduSync Bot"
   - **Workspace**: Select your workspace

2. **Configure OAuth & Permissions**:
   - Go to "OAuth & Permissions"
   - **Bot Token Scopes** (add these):
     - ✅ `chat:write` (Send messages)
     - ✅ `chat:write.public` (Send to public channels)
     - ✅ `channels:read` (View channels)
     - ✅ `groups:read` (View private channels)
     - ✅ `im:write` (Send DMs)

3. **Install App to Workspace**:
   - Scroll up to "OAuth Tokens for Your Workspace"
   - Click "Install to Workspace"
   - Authorize the app

4. **Get Bot Token**:
   - Copy the **Bot User OAuth Token**
   - Format: `xoxb-xxxxxxxxxxxxx-xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx`

5. **Invite Bot to Channels**:
   - In Slack, go to the channel you want to use
   - Type: `/invite @EduSync Bot`
   - Or mention the bot: `@EduSync Bot`

6. **Add to `.env.local`** (optional):
   ```bash
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   ```

### 📡 API Endpoints

**Base URL**: `/api/integrations/slack`

#### Actions:

**1. Send Message**
```javascript
POST /api/integrations/slack
{
  "action": "send_message",
  "botToken": "xoxb-your-bot-token",
  "channel": "general",
  "message": "Hello from EduSync! 👋"
}
```

**2. Notify Assignment**
```javascript
POST /api/integrations/slack
{
  "action": "notify_assignment",
  "botToken": "xoxb-your-bot-token",
  "channel": "assignments",
  "assignmentId": "assignment_doc_id"
}
```

**3. Notify Quiz**
```javascript
POST /api/integrations/slack
{
  "action": "notify_quiz",
  "botToken": "xoxb-your-bot-token",
  "channel": "quizzes",
  "quizId": "quiz_doc_id"
}
```

**4. Notify Grade**
```javascript
POST /api/integrations/slack
{
  "action": "notify_grade",
  "botToken": "xoxb-your-bot-token",
  "channel": "grades",
  "studentId": "student_doc_id",
  "assignmentId": "assignment_doc_id"
}
```

**5. List Channels**
```javascript
POST /api/integrations/slack
{
  "action": "list_channels",
  "botToken": "xoxb-your-bot-token"
}
```

**6. Send with Rich Formatting (Blocks)**
```javascript
POST /api/integrations/slack
{
  "action": "send_message",
  "botToken": "xoxb-your-bot-token",
  "channel": "general",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*New Assignment Posted* 📚\n\n*Title:* Math Homework\n*Due:* Oct 25, 2025"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Assignment" },
          "url": "https://edusync.com/assignments/123"
        }
      ]
    }
  ]
}
```

**7. Get Notification History**
```javascript
GET /api/integrations/slack?action=notifications
```

**8. Delete Notification**
```javascript
DELETE /api/integrations/slack?id=notification_doc_id
```

### 📱 Finding Channel IDs

```javascript
// Use list_channels action to get channel IDs
const response = await fetch('/api/integrations/slack', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'list_channels',
    botToken: 'xoxb-your-token'
  })
});

// Response: { channels: [{ id: 'C123456', name: 'general', ... }] }
```

---

## 4️⃣ Stripe Integration

### 📌 Purpose
- Process premium subscription payments
- Create checkout sessions
- Handle payment intents
- Verify payments via webhooks

### 🔧 Appwrite Setup
✅ **Collection Required**: `payments`

### 🌐 Stripe Account Setup

#### Step-by-Step Configuration:

1. **Create Stripe Account**:
   - Go to https://stripe.com
   - Click "Sign up"
   - Complete account registration

2. **Get API Keys**:
   - Go to Dashboard → Developers → API keys
   - **Publishable Key** (public): `pk_test_xxxxxxxxxxxxx`
   - **Secret Key** (private): `sk_test_xxxxxxxxxxxxx`
   - For production, use live keys: `pk_live_xxx` and `sk_live_xxx`

3. **Create Products & Prices**:
   - Go to Products → Add Product
   - **Example Product**: "EduSync Premium"
   - **Price**: $9.99/month
   - Copy the **Price ID**: `price_xxxxxxxxxxxxx`

4. **Configure Webhooks** (for payment verification):
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - **Endpoint URL**: `https://yourdomain.com/api/integrations/stripe` (PUT method)
   - **Events to send**:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
   - Copy the **Webhook Signing Secret**: `whsec_xxxxxxxxxxxxx`

5. **Add to `.env.local`**:
   ```bash
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 📡 API Endpoints

**Base URL**: `/api/integrations/stripe`

#### Actions:

**1. Create Checkout Session (One-time Payment)**
```javascript
POST /api/integrations/stripe
{
  "action": "create_checkout_session",
  "secretKey": "sk_test_your_secret",
  "amount": 29.99,
  "currency": "usd",
  "description": "EduSync Premium - Monthly",
  "plan": "premium",
  "successUrl": "https://yourdomain.com/dashboard/student?payment=success",
  "cancelUrl": "https://yourdomain.com/dashboard/student?payment=cancel"
}
```

**Response**:
```json
{
  "success": true,
  "sessionId": "cs_test_xxxxxxxxxxxxx",
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_xxx#fidkdWxO...",
  "message": "Checkout session created successfully"
}
```

**2. Create Subscription**
```javascript
POST /api/integrations/stripe
{
  "action": "create_subscription",
  "secretKey": "sk_test_your_secret",
  "priceId": "price_xxxxxxxxxxxxx",
  "successUrl": "https://yourdomain.com/dashboard/student?subscription=success",
  "cancelUrl": "https://yourdomain.com/dashboard/student?subscription=cancel"
}
```

**3. Create Payment Intent**
```javascript
POST /api/integrations/stripe
{
  "action": "create_payment_intent",
  "secretKey": "sk_test_your_secret",
  "amount": 19.99,
  "currency": "usd",
  "description": "EduSync Course Access"
}
```

**Response**:
```json
{
  "success": true,
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxxxxxxxxxxxx"
}
```

**4. Verify Payment**
```javascript
POST /api/integrations/stripe
{
  "action": "verify_payment",
  "secretKey": "sk_test_your_secret",
  "sessionId": "cs_test_xxxxxxxxxxxxx"
}
```

**5. Get Payment History**
```javascript
GET /api/integrations/stripe?action=payment_history
```

**6. Get Subscription Status**
```javascript
GET /api/integrations/stripe?action=subscription_status&secretKey=sk_test_xxx
```

### 🔔 Webhook Handler

The API automatically handles Stripe webhooks at the PUT endpoint:

```javascript
// Stripe will send POST requests to your webhook URL
// The API converts them and handles as PUT internally

// Events handled:
// - checkout.session.completed → Update payment status to "completed"
// - payment_intent.succeeded → Log successful payment
// - customer.subscription.created/updated → Track subscription changes
```

### 💳 Frontend Integration (Stripe.js)

```html
<!-- Add Stripe.js to your page -->
<script src="https://js.stripe.com/v3/"></script>

<script>
  const stripe = Stripe('pk_test_your_publishable_key');
  
  // After creating checkout session
  const response = await fetch('/api/integrations/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_checkout_session',
      secretKey: 'sk_test_xxx', // Store server-side, pass via authenticated endpoint
      amount: 29.99,
      currency: 'usd'
    })
  });
  
  const { sessionId } = await response.json();
  
  // Redirect to Stripe Checkout
  await stripe.redirectToCheckout({ sessionId });
</script>
```

---

## 5️⃣ Zoom Integration

### 📌 Purpose
- Create scheduled meetings for classes
- Generate instant meeting links
- Link meetings to assignments/quizzes
- Manage meeting details

### 🔧 Appwrite Setup
✅ **Collection Required**: `meetings`

### 🌐 Zoom Account Setup

#### Step-by-Step Configuration:

1. **Create Zoom Account**:
   - Go to https://zoom.us
   - Sign up or log in
   - Upgrade to Pro or higher (required for API access)

2. **Create Zoom App**:
   - Go to https://marketplace.zoom.us/
   - Click "Develop" → "Build App"
   - Choose **"OAuth"** app type
   - **App Name**: "EduSync"
   - Click "Create"

3. **Configure OAuth App**:
   - **App Type**: "User-managed app"
   - **Would you like to publish?**: No (internal use)
   - **Redirect URL**: 
     - `http://localhost:3000/api/auth/zoom/callback`
     - `https://yourdomain.com/api/auth/zoom/callback`
   - **Whitelist URL**: `https://yourdomain.com`

4. **Add Scopes**:
   Go to "Scopes" tab and add:
   - ✅ `meeting:write:admin` (Create meetings)
   - ✅ `meeting:read:admin` (Read meeting details)
   - ✅ `meeting:update:admin` (Update meetings)
   - ✅ `meeting:delete:admin` (Delete meetings)
   - ✅ `user:read:admin` (Read user info)

5. **Get Credentials**:
   - **Client ID**: `xxxxxxxxxxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

6. **Add to `.env.local`**:
   ```bash
   ZOOM_CLIENT_ID=your_client_id
   ZOOM_CLIENT_SECRET=your_client_secret
   ```

7. **Alternative: Server-to-Server OAuth** (Simpler for internal apps):
   - Go to https://marketplace.zoom.us/
   - Create "Server-to-Server OAuth" app instead
   - **Account ID**, **Client ID**, **Client Secret** provided
   - No redirect URL needed
   - Use for backend-only API calls

### 📡 API Endpoints

**Base URL**: `/api/integrations/zoom`

#### Actions:

**1. Create Scheduled Meeting**
```javascript
POST /api/integrations/zoom
{
  "action": "create_meeting",
  "accessToken": "your_zoom_access_token",
  "topic": "Mathematics Class - Week 5",
  "duration": 60,
  "startTime": "2025-10-25T14:00:00Z",
  "agenda": "Today we'll cover algebra basics",
  "timezone": "America/New_York",
  "password": "securepass123",
  "waitingRoom": true
}
```

**Response**:
```json
{
  "success": true,
  "meeting": {
    "id": 123456789,
    "topic": "Mathematics Class - Week 5",
    "joinUrl": "https://zoom.us/j/123456789?pwd=xxxxx",
    "password": "securepass123",
    "startTime": "2025-10-25T14:00:00Z",
    "duration": 60
  }
}
```

**Response (without token - manual mode)**:
```json
{
  "success": true,
  "manual": true,
  "meeting": { /* stored in database */ },
  "message": "Meeting intent stored. Configure Zoom OAuth for automatic meeting creation."
}
```

**2. Create Instant Meeting**
```javascript
POST /api/integrations/zoom
{
  "action": "create_instant_meeting",
  "accessToken": "your_zoom_access_token",
  "topic": "Quick Office Hours"
}
```

**3. Update Meeting**
```javascript
POST /api/integrations/zoom
{
  "action": "update_meeting",
  "accessToken": "your_zoom_access_token",
  "meetingId": "123456789",
  "updates": {
    "topic": "Updated Meeting Title",
    "duration": 90,
    "start_time": "2025-10-26T15:00:00Z"
  }
}
```

**4. Get Meeting Details**
```javascript
POST /api/integrations/zoom
{
  "action": "get_meeting_details",
  "accessToken": "your_zoom_access_token",
  "meetingId": "123456789"
}
```

**5. List Meetings**
```javascript
GET /api/integrations/zoom?action=list_meetings&accessToken=your_token
```

**Response (with token)**:
```json
{
  "success": true,
  "meetings": [
    {
      "id": 123456789,
      "topic": "Math Class",
      "startTime": "2025-10-25T14:00:00Z",
      "duration": 60,
      "joinUrl": "https://zoom.us/j/123456789",
      "status": "waiting"
    }
  ]
}
```

**Response (without token - local database)**:
```json
{
  "success": true,
  "local": true,
  "meetings": [ /* from Appwrite */ ],
  "message": "Showing locally stored meetings. Configure Zoom OAuth to sync with Zoom."
}
```

**6. Delete Meeting**
```javascript
DELETE /api/integrations/zoom?id=123456789&accessToken=your_token
```

### 🔑 Getting Access Token (OAuth Flow)

```javascript
// 1. Redirect user to Zoom OAuth
const authUrl = `https://zoom.us/oauth/authorize?` +
  `response_type=code` +
  `&client_id=${ZOOM_CLIENT_ID}` +
  `&redirect_uri=${REDIRECT_URI}`;

// 2. Handle callback and exchange code for token
const tokenResponse = await fetch('https://zoom.us/oauth/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI
  })
});

const { access_token } = await tokenResponse.json();
```

---

## 🔐 Environment Variables

Create or update your `.env.local` file:

```bash
# ==========================================
# APPWRITE CONFIGURATION
# ==========================================
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=EduSync
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id

# Collection IDs (optional - defaults shown in code)
NEXT_PUBLIC_APPWRITE_INTEGRATIONS_COLLECTION_ID=integrations
NEXT_PUBLIC_APPWRITE_CALENDAR_EVENTS_COLLECTION_ID=calendar_events
NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID=notifications
NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID=payments
NEXT_PUBLIC_APPWRITE_MEETINGS_COLLECTION_ID=meetings

# ==========================================
# GITHUB INTEGRATION
# ==========================================
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# ==========================================
# GOOGLE CALENDAR INTEGRATION
# ==========================================
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret

# ==========================================
# SLACK INTEGRATION
# ==========================================
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token

# ==========================================
# STRIPE INTEGRATION
# ==========================================
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==========================================
# ZOOM INTEGRATION
# ==========================================
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# ==========================================
# AI FEATURES
# ==========================================
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

---

## 🧪 Testing Integration APIs

### Using cURL

```bash
# 1. GitHub - Fetch Repos
curl -X POST http://localhost:3000/api/integrations/github \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{"action":"fetch_repos","token":"ghp_your_token"}'

# 2. Google Calendar - Create Event
curl -X POST http://localhost:3000/api/integrations/google-calendar \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "action":"create_event",
    "eventTitle":"Test Event",
    "startTime":"2025-10-25T10:00:00Z",
    "endTime":"2025-10-25T11:00:00Z"
  }'

# 3. Slack - Send Message
curl -X POST http://localhost:3000/api/integrations/slack \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "action":"send_message",
    "botToken":"xoxb-your-token",
    "channel":"general",
    "message":"Test from EduSync!"
  }'

# 4. Stripe - Create Checkout
curl -X POST http://localhost:3000/api/integrations/stripe \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "action":"create_checkout_session",
    "secretKey":"sk_test_your_key",
    "amount":29.99,
    "currency":"usd"
  }'

# 5. Zoom - Create Meeting
curl -X POST http://localhost:3000/api/integrations/zoom \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "action":"create_meeting",
    "topic":"Test Meeting",
    "duration":60,
    "startTime":"2025-10-25T14:00:00Z"
  }'
```

### Using JavaScript/TypeScript

```typescript
// Example: Test all integrations
async function testIntegrations() {
  // 1. GitHub
  const githubRepos = await fetch('/api/integrations/github', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'fetch_repos',
      token: 'ghp_your_token'
    })
  });
  
  // 2. Google Calendar
  const calendarEvent = await fetch('/api/integrations/google-calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_event',
      eventTitle: 'Test Event',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 90000000).toISOString()
    })
  });
  
  // 3. Slack
  const slackMessage = await fetch('/api/integrations/slack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'send_message',
      channel: 'general',
      message: '🎉 Integration test successful!'
    })
  });
  
  // 4. Stripe
  const stripeCheckout = await fetch('/api/integrations/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_checkout_session',
      amount: 9.99,
      currency: 'usd'
    })
  });
  
  // 5. Zoom
  const zoomMeeting = await fetch('/api/integrations/zoom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create_meeting',
      topic: 'Test Meeting',
      duration: 30,
      startTime: new Date(Date.now() + 86400000).toISOString()
    })
  });
  
  console.log('All integrations tested!');
}
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **401 Unauthorized Error**
```json
{"error": "Unauthorized"}
```
**Solution**: 
- Ensure user is logged in
- Check session cookie is present
- Verify Appwrite session is active

#### 2. **403 Forbidden (Teachers Only)**
```json
{"error": "Only teachers can create meetings"}
```
**Solution**:
- Verify user has `teacher` role/label in Appwrite
- Check `user.labels?.[0]` contains `'teacher'`

#### 3. **GitHub "Bad credentials" Error**
**Solution**:
- Check token is valid: `ghp_` prefix
- Token hasn't expired
- Required scopes (`repo`, `user`) are enabled

#### 4. **Google Calendar "Invalid credentials"**
**Solution**:
- Access token expired (refresh it)
- OAuth scopes include `https://www.googleapis.com/auth/calendar`
- API is enabled in Google Cloud Console

#### 5. **Slack "channel_not_found" Error**
**Solution**:
- Bot must be invited to channel: `/invite @YourBot`
- Use channel ID instead of name: `C123456`
- Bot has `chat:write.public` scope

#### 6. **Stripe "No such price" Error**
**Solution**:
- Price ID exists in Stripe Dashboard
- Using correct environment (test vs live keys)
- Price ID format: `price_xxxxxxxxxxxxx`

#### 7. **Zoom "Invalid access token"**
**Solution**:
- Token expired (Zoom tokens last 1 hour)
- Refresh token to get new access token
- Correct API scopes configured

#### 8. **Appwrite Collection Not Found**
```json
{"error": "Collection with the requested ID could not be found"}
```
**Solution**:
- Create missing collection in Appwrite Console
- Collection ID matches environment variable
- Database ID is correct

#### 9. **Manual Mode Activated (No API Key)**
```json
{"success": true, "manual": true, "message": "..."}
```
**Not an error!** This is expected when API keys aren't configured. The system stores the intent in Appwrite and provides manual alternatives (calendar links, etc.).

---

## 📊 Integration Status Check

Create a test page to verify all integrations:

```typescript
// app/test-integrations/page.tsx
export default function TestIntegrationsPage() {
  const [status, setStatus] = useState({});

  const testAll = async () => {
    const tests = {
      github: await fetch('/api/integrations/github'),
      calendar: await fetch('/api/integrations/google-calendar'),
      slack: await fetch('/api/integrations/slack'),
      stripe: await fetch('/api/integrations/stripe'),
      zoom: await fetch('/api/integrations/zoom')
    };

    const results = {};
    for (const [key, response] of Object.entries(tests)) {
      results[key] = await response.json();
    }

    setStatus(results);
  };

  return (
    <div>
      <h1>Integration Status</h1>
      <button onClick={testAll}>Test All Integrations</button>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
```

---

## 🎓 Best Practices

### Security
1. **Never expose secret keys in frontend code**
2. Store tokens securely (use Appwrite sessions)
3. Validate all user inputs
4. Use HTTPS in production
5. Rotate API keys regularly

### Performance
1. Cache access tokens (with expiration)
2. Use webhooks instead of polling
3. Batch API calls when possible
4. Implement rate limiting
5. Store frequently accessed data in Appwrite

### Error Handling
1. Always catch and log errors
2. Provide user-friendly error messages
3. Implement retry logic for transient failures
4. Use graceful fallbacks (manual mode)
5. Monitor integration health

---

## 📚 Additional Resources

### Documentation Links

- **GitHub API**: https://docs.github.com/rest
- **Google Calendar API**: https://developers.google.com/calendar
- **Slack API**: https://api.slack.com/docs
- **Stripe API**: https://stripe.com/docs/api
- **Zoom API**: https://marketplace.zoom.us/docs/api-reference
- **Appwrite Docs**: https://appwrite.io/docs

### Support

- **EduSync Issues**: [GitHub Issues](https://github.com/ArhanAnsari/edusync/issues)
- **Appwrite Discord**: https://discord.gg/appwrite
- **Community Forum**: Create discussions for integration help

---

## ✅ Quick Setup Checklist

### Appwrite Setup
- [ ] Create 5 collections: integrations, calendar_events, notifications, payments, meetings
- [ ] Configure permissions for each collection
- [ ] Add indexes for userId, type, status fields
- [ ] Update collection IDs in `.env.local`

### GitHub Setup
- [ ] Create Personal Access Token or OAuth App
- [ ] Enable repo and user scopes
- [ ] Test token with fetch_repos action

### Google Calendar Setup
- [ ] Create Google Cloud Project
- [ ] Enable Calendar API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth credentials
- [ ] Test with create_event action

### Slack Setup
- [ ] Create Slack App
- [ ] Add bot token scopes
- [ ] Install app to workspace
- [ ] Invite bot to channels
- [ ] Test with send_message action

### Stripe Setup
- [ ] Create Stripe account
- [ ] Get API keys (test mode)
- [ ] Create products and prices
- [ ] Configure webhooks
- [ ] Test with create_checkout_session action

### Zoom Setup
- [ ] Create Zoom account (Pro+)
- [ ] Create OAuth or Server-to-Server app
- [ ] Add meeting scopes
- [ ] Get credentials
- [ ] Test with create_meeting action

---

**🎉 Congratulations!** All integrations are now configured and ready to use in EduSync.

**Next Steps**:
1. Build UI components for each integration
2. Implement OAuth flows for automatic token management
3. Add error handling and user feedback
4. Test in production environment
5. Monitor integration usage and performance

---

**Last Updated**: October 18, 2025  
**Version**: 1.0  
**Maintained by**: EduSync Team
