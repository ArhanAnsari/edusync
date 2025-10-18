# 🔗 EduSync Integrations Setup Guide

Complete guide to setting up all 5 third-party integrations in EduSync.

## 📋 Table of Contents

1. [GitHub Integration](#1-github-integration)
2. [Google Calendar Integration](#2-google-calendar-integration)
3. [Slack Integration](#3-slack-integration)
4. [Stripe Payment Integration](#4-stripe-payment-integration)
5. [Zoom Integration](#5-zoom-integration)
6. [Testing Integrations](#testing-integrations)
7. [Troubleshooting](#troubleshooting)

---

## 1. GitHub Integration

Connect GitHub repositories to your assignments and track student code submissions.

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: EduSync
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**

### Step 2: Generate Personal Access Token

1. Go to [GitHub Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token" → "Generate new token (classic)"**
3. Give it a descriptive name (e.g., "EduSync Integration")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:user` (Read user profile data)
   - ✅ `user:email` (Access user email addresses)
5. Click **"Generate token"** and copy it immediately

### Step 3: Add to Environment Variables

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GITHUB_CALLBACK_URL=http://localhost:3000/auth/callback/github
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
```

### Features Enabled

✅ Link repositories to assignments  
✅ Fetch user repositories  
✅ Create assignment repositories  
✅ View commit history  
✅ Track student code submissions

---

## 2. Google Calendar Integration

Automatically sync assignments, quizzes, and class events to Google Calendar.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Calendar API**:
   - Search for "Google Calendar API" in the API Library
   - Click **"Enable"**

### Step 2: Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"Create Credentials" → "OAuth client ID"**
3. Configure consent screen if prompted:
   - User Type: **External**
   - App name: **EduSync**
   - Add scopes: `https://www.googleapis.com/auth/calendar.events`
4. Choose **"Web application"**
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback/google`
6. Copy **Client ID** and **Client Secret**

### Step 3: (Optional) Create API Key

1. In Credentials, click **"Create Credentials" → "API key"**
2. Restrict the key to **Google Calendar API** only
3. Copy the API key

### Step 4: Add to Environment Variables

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google
GOOGLE_CALENDAR_API_KEY=your_api_key (optional)
```

### Features Enabled

✅ Create calendar events for assignments  
✅ Sync quiz deadlines  
✅ Schedule class sessions  
✅ Send deadline reminders  
✅ View upcoming events

---

## 3. Slack Integration

Send notifications and updates to your Slack workspace.

### Step 1: Create Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App" → "From scratch"**
3. Enter app name: **EduSync Notifications**
4. Choose your workspace
5. Click **"Create App"**

### Step 2: Configure Bot Permissions

1. Go to **"OAuth & Permissions"** in the sidebar
2. Scroll to **"Scopes" → "Bot Token Scopes"**
3. Add the following scopes:
   - ✅ `chat:write` (Send messages)
   - ✅ `chat:write.public` (Send messages to channels without joining)
   - ✅ `channels:read` (View basic channel info)
   - ✅ `groups:read` (View private channels)
4. Scroll up and click **"Install to Workspace"**
5. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### Step 3: Get Signing Secret

1. Go to **"Basic Information"** in the sidebar
2. Scroll to **"App Credentials"**
3. Copy the **Signing Secret**

### Step 4: Add to Environment Variables

```env
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your_signing_secret
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
SLACK_DEFAULT_CHANNEL=general
```

### Features Enabled

✅ Send assignment notifications  
✅ Announce new quizzes  
✅ Share grading updates  
✅ Custom channel messages  
✅ List workspace channels

---

## 4. Stripe Payment Integration

Accept payments for premium features and course subscriptions.

### Step 1: Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a new account
3. Complete business verification (for live mode)

### Step 2: Get API Keys

1. Go to [API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. **Important**: Use test keys for development!

### Step 3: Create Products and Prices

1. Go to **Products** in the dashboard
2. Click **"Add product"** for each plan:

   **Basic Plan**:
   - Name: Basic
   - Description: Access to all courses
   - Price: $9.99/month
   - Copy the Price ID (starts with `price_`)

   **Premium Plan**:
   - Name: Premium
   - Price: $19.99/month
   - Copy the Price ID

   **Enterprise Plan**:
   - Name: Enterprise
   - Price: $49.99/month
   - Copy the Price ID

### Step 4: Set up Webhooks (Optional but Recommended)

1. Go to **Developers → Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/integrations/stripe` (webhook handler)
4. Select events to listen for:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### Step 5: Add to Environment Variables

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic_plan_id
STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id
```

### Features Enabled

✅ Accept one-time payments  
✅ Subscription management  
✅ Automatic billing  
✅ Payment history  
✅ Webhook event handling

### ⚠️ Production Checklist

- [ ] Switch to live API keys (`pk_live_` and `sk_live_`)
- [ ] Complete Stripe account verification
- [ ] Set up proper webhook endpoint
- [ ] Configure tax settings
- [ ] Enable fraud prevention
- [ ] Set up business details

---

## 5. Zoom Integration

Create and manage virtual classroom meetings.

### Step 1: Create Zoom Account

1. Sign up at [Zoom](https://zoom.us/signup)
2. Verify your email
3. Upgrade to Pro if you need meetings longer than 40 minutes

### Step 2: Create OAuth App (Recommended)

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **"Develop" → "Build App"**
3. Choose **"OAuth"** app type
4. Fill in app information:
   - **App Name**: EduSync
   - **Choose app type**: Account-level app
   - **Would you like to publish this app?**: No (keep it private)
5. Fill in developer contact information
6. On the **App Credentials** page:
   - Copy **Client ID** and **Client Secret**
   - Add OAuth Redirect URL: `http://localhost:3000/auth/callback/zoom`
7. On the **Scopes** page, add:
   - ✅ `meeting:write:admin` (Create meetings)
   - ✅ `meeting:read:admin` (View meetings)
   - ✅ `user:read:admin` (View user info)
8. Click **"Continue"** and **"Activate your app"**

### Step 3: (Alternative) Server-to-Server OAuth

For automated meeting creation without user authentication:

1. In Zoom Marketplace, choose **"Server-to-Server OAuth"**
2. Fill in app information
3. Copy:
   - Account ID
   - Client ID
   - Client Secret
4. Add scopes (same as above)

### Step 4: Add to Environment Variables

```env
# For OAuth
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_REDIRECT_URI=http://localhost:3000/auth/callback/zoom

# For Server-to-Server OAuth
ZOOM_ACCOUNT_ID=your_zoom_account_id
ZOOM_CLIENT_ID_S2S=your_server_to_server_client_id
ZOOM_CLIENT_SECRET_S2S=your_server_to_server_client_secret
```

### Features Enabled

✅ Create scheduled meetings  
✅ Create instant meetings  
✅ Update meeting details  
✅ Delete meetings  
✅ Generate join links  
✅ Password-protected meetings

---

## Testing Integrations

### 1. GitHub Testing

```bash
# Test fetching repositories
curl -X POST http://localhost:3000/api/integrations/github \
  -H "Content-Type: application/json" \
  -d '{"action": "fetch_repos", "token": "YOUR_GITHUB_TOKEN"}'
```

### 2. Google Calendar Testing

```bash
# Test creating an event
curl -X POST http://localhost:3000/api/integrations/google-calendar \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_event",
    "eventTitle": "Test Assignment",
    "startTime": "2025-01-15T10:00:00Z",
    "endTime": "2025-01-15T11:00:00Z"
  }'
```

### 3. Slack Testing

```bash
# Test sending a message
curl -X POST http://localhost:3000/api/integrations/slack \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_message",
    "botToken": "YOUR_BOT_TOKEN",
    "channel": "general",
    "message": "Test notification from EduSync"
  }'
```

### 4. Stripe Testing

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### 5. Zoom Testing

```bash
# Test creating a meeting
curl -X POST http://localhost:3000/api/integrations/zoom \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_meeting",
    "topic": "Test Class",
    "duration": 60
  }'
```

---

## Troubleshooting

### Common Issues

#### GitHub Integration

**Problem**: "Bad credentials" error
- **Solution**: Check that your Personal Access Token is correct and has the required scopes

**Problem**: Can't fetch repositories
- **Solution**: Ensure the token has `repo` scope enabled

#### Google Calendar

**Problem**: "Invalid grant" error
- **Solution**: Regenerate OAuth credentials and update callback URL

**Problem**: Events not showing
- **Solution**: Check that Google Calendar API is enabled in your project

#### Slack

**Problem**: "not_in_channel" error
- **Solution**: Invite the bot to the channel first, or use `chat:write.public` scope

**Problem**: Messages not sending
- **Solution**: Verify the bot token starts with `xoxb-` (not `xoxp-`)

#### Stripe

**Problem**: Checkout session fails
- **Solution**: Ensure you're using test mode keys in development

**Problem**: Webhook not receiving events
- **Solution**: Use ngrok or similar tool to expose localhost for testing

#### Zoom

**Problem**: "Invalid access token"
- **Solution**: Regenerate the access token (they expire after 1 hour in OAuth flow)

**Problem**: Can't create meetings
- **Solution**: Check that account has meeting creation permissions

### Environment Variable Issues

**Problem**: Variables not loading
- **Solution**: 
  1. Restart your development server
  2. Check `.env.local` file exists
  3. Verify variable names match exactly (including `NEXT_PUBLIC_` prefix where needed)

**Problem**: Variables undefined in browser
- **Solution**: Only `NEXT_PUBLIC_*` variables are available in browser code

---

## 🎯 Quick Start Checklist

### Minimal Setup (App Works Without These)

- [x] Appwrite configured
- [x] Basic authentication working
- [x] Database collections created

### Optional Integrations (Enable As Needed)

- [ ] GitHub - for repository linking
- [ ] Google Calendar - for event syncing
- [ ] Slack - for notifications
- [ ] Stripe - for payments (students only)
- [ ] Zoom - for meetings

### Production Deployment

- [ ] Switch all test keys to production keys
- [ ] Update callback URLs to production domain
- [ ] Enable webhook endpoints
- [ ] Test all integrations in production
- [ ] Monitor error logs

---

## 📚 Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google Calendar API Docs](https://developers.google.com/calendar/api/guides/overview)
- [Slack API Documentation](https://api.slack.com/docs)
- [Stripe Integration Guide](https://stripe.com/docs/payments/accept-a-payment)
- [Zoom API Documentation](https://developers.zoom.us/docs/api/)

---

## 🆘 Support

If you encounter issues:

1. Check the browser console for error messages
2. Check the server logs (`npm run dev` output)
3. Verify all environment variables are set correctly
4. Review the API documentation for the specific integration
5. Check the [GitHub Issues](https://github.com/ArhanAnsari/edusync/issues) page

---

**Last Updated**: January 2025  
**Version**: 1.0.0
