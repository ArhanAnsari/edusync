# 🔄 Migration Guide: LiveChat → AI Smart Assistant

## Overview

The `LiveChat` component has been upgraded to **AI Smart Assistant** with full AI-powered capabilities using Google Gemini. This guide helps you migrate from the old LiveChat to the new intelligent assistant.

---

## 🆕 What's New?

### Before (LiveChat)
- Generic chat interface
- Basic API endpoint (`/api/chat`)
- Simple message exchange
- No context awareness
- Basic UI

### After (AI Smart Assistant)
- **AI-powered** responses via Google Gemini
- **Role-based** features (student/teacher)
- **Quick action** buttons
- **Streaming** responses
- **Context-aware** conversations
- **Suggested prompts**
- **Beautiful glassmorphism** UI
- **Smart animations**

---

## 📦 Migration Steps

### Step 1: Update Imports (Optional)

The old `LiveChat` component automatically forwards to `AISmartAssistant`, so **no changes required** if you're using:

```tsx
import LiveChat from '@/components/LiveChat';
<LiveChat />
```

**But we recommend** updating to the new import for clarity:

```tsx
// Old
import LiveChat from '@/components/LiveChat';

// New (recommended)
import AISmartAssistant from '@/components/AISmartAssistant';
```

### Step 2: Environment Setup

Add Google Gemini API key to `.env.local`:

```bash
# Required for AI features
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

**Get your API key**:
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy and paste into `.env.local`

### Step 3: Update Layout (if needed)

If you're using the old import in `app/layout.tsx`:

```tsx
// Before
import LiveChat from '@/components/LiveChat';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <LiveChat />
      </body>
    </html>
  );
}
```

```tsx
// After (recommended)
import AISmartAssistant from '@/components/AISmartAssistant';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AISmartAssistant />
      </body>
    </html>
  );
}
```

### Step 4: Set User Role (Important!)

For best AI experience, set the user role after login:

```typescript
// After successful login
localStorage.setItem('userRole', user.role); // 'student' or 'teacher'

// Example in login handler
const handleLogin = async (credentials) => {
  const user = await loginUser(credentials);
  
  // Store role for AI assistant
  localStorage.setItem('userRole', user.role);
  
  router.push('/dashboard');
};
```

### Step 5: Test the New Features

1. **Open the assistant**: Click the purple floating button
2. **Try quick actions**: Click one of the quick action buttons
3. **Send a message**: Ask a question and see AI response
4. **Test role-based features**: Login as student/teacher to see different features

---

## 🔄 API Endpoint Changes

### Old Endpoint
```typescript
// /api/chat/route.ts (deprecated)
POST /api/chat
{
  "message": "Hello",
  "sessionId": "session_123"
}
```

### New Endpoint
```typescript
// /api/ai/chat/route.ts (new)
POST /api/ai/chat
{
  "message": "Hello",
  "context": "User role: student. Provide helpful responses."
}
```

**Note**: The old endpoint is still functional but the new AI assistant uses `/api/ai/chat` for better AI integration.

---

## 🎨 UI/UX Changes

| Feature | Old (LiveChat) | New (AI Smart Assistant) |
|---------|---------------|-------------------------|
| **Button Color** | Blue gradient | Purple gradient |
| **Icon** | MessageCircle | Bot + Sparkles |
| **Animation** | Basic pulse | Advanced glow animation |
| **Window Design** | Simple card | Glassmorphism with gradients |
| **Messages** | Basic bubbles | Gradient bubbles with AI badge |
| **Typing Indicator** | "..." | Animated dots with sparkles |
| **Quick Actions** | None | Role-based action buttons |
| **Suggested Prompts** | None | Context-aware suggestions |

---

## ⚙️ Configuration Changes

### Old Configuration
```typescript
// LiveChat had minimal configuration
<LiveChat />
```

### New Configuration Options

```typescript
// Basic usage (auto-detects role)
<AISmartAssistant />

// You can customize by forking the component:
// - Quick actions (edit `quickActions` array)
// - Suggested prompts (edit `suggestedPrompts` conditional)
// - UI colors (edit Tailwind classes)
// - Role detection (modify `useEffect` for role)
```

---

## 🔌 Integration with Other Components

### Student Dashboard

```tsx
// app/dashboard/student/page.tsx
import AISmartAssistant from '@/components/AISmartAssistant';

export default function StudentDashboard() {
  // Set role explicitly if not in localStorage
  useEffect(() => {
    localStorage.setItem('userRole', 'student');
  }, []);

  return (
    <div>
      <h1>Student Dashboard</h1>
      {/* ... dashboard content ... */}
      <AISmartAssistant />
    </div>
  );
}
```

### Teacher Dashboard

```tsx
// app/dashboard/teacher/page.tsx
import AISmartAssistant from '@/components/AISmartAssistant';

export default function TeacherDashboard() {
  useEffect(() => {
    localStorage.setItem('userRole', 'teacher');
  }, []);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      {/* ... dashboard content ... */}
      <AISmartAssistant />
    </div>
  );
}
```

### Global Layout (Recommended)

```tsx
// app/layout.tsx
import AISmartAssistant from '@/components/AISmartAssistant';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {/* Available on all pages */}
        <AISmartAssistant />
      </body>
    </html>
  );
}
```

---

## 🧪 Testing Migration

### Checklist

- [ ] **Visual Check**: Purple floating button appears
- [ ] **Open/Close**: Button opens chat window
- [ ] **Send Message**: Can send and receive messages
- [ ] **AI Response**: Gets intelligent AI responses
- [ ] **Quick Actions**: Action buttons visible and working
- [ ] **Role Detection**: Shows correct prompts for user role
- [ ] **Streaming**: Sees message build in real-time
- [ ] **Animations**: Smooth animations and transitions
- [ ] **Mobile**: Works on mobile devices
- [ ] **Error Handling**: Shows friendly errors if API fails

### Manual Test Script

```bash
# 1. Start dev server
npm run dev

# 2. Open browser to http://localhost:3000

# 3. Test floating button
- Click purple bot button
- Window should open with animation

# 4. Test AI response
- Type: "Explain photosynthesis"
- Press Enter
- Should see streaming AI response

# 5. Test quick actions
- Click "Explain Concept" button
- Should auto-fill prompt and get response

# 6. Test role switching
- Open browser console
- Run: localStorage.setItem('userRole', 'teacher')
- Refresh page
- Should see teacher-specific prompts

# 7. Test error handling
- Stop the AI API (or disconnect internet)
- Send a message
- Should see friendly error message
```

---

## 🐛 Common Migration Issues

### Issue 1: "Component not found"

**Error**:
```
Module not found: Can't resolve '@/components/AISmartAssistant'
```

**Solution**:
- File is at: `components/AISmartAssistant.tsx`
- Check import path matches exactly
- Restart dev server: `npm run dev`

### Issue 2: "AI not responding"

**Error**: Messages send but no AI response

**Solution**:
```bash
# Check environment variable
cat .env.local | grep GOOGLE_GENERATIVE_AI_API_KEY

# Should see:
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# If missing, add it and restart server
```

### Issue 3: "Role detection not working"

**Error**: Shows wrong quick actions or prompts

**Solution**:
```typescript
// Manually set role after login
localStorage.setItem('userRole', 'student'); // or 'teacher'

// Check in browser console
console.log(localStorage.getItem('userRole'));
```

### Issue 4: "Old LiveChat still showing"

**Cause**: Browser cache

**Solution**:
```bash
# Clear cache
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Or clear cache in browser settings
```

### Issue 5: "Styling looks wrong"

**Cause**: Tailwind CSS not compiled

**Solution**:
```bash
# Rebuild
npm run build

# Or restart dev server
npm run dev
```

---

## 📊 Feature Comparison

| Feature | LiveChat | AI Smart Assistant | Status |
|---------|----------|-------------------|--------|
| Real-time chat | ✅ | ✅ | Same |
| Floating button | ✅ | ✅ | Enhanced |
| Message history | ✅ | ✅ | Same |
| Animations | ⚠️ Basic | ✅ Advanced | Improved |
| AI responses | ❌ | ✅ | **New** |
| Role-based features | ❌ | ✅ | **New** |
| Quick actions | ❌ | ✅ | **New** |
| Suggested prompts | ❌ | ✅ | **New** |
| Streaming responses | ❌ | ✅ | **New** |
| Context awareness | ❌ | ✅ | **New** |
| Glassmorphism UI | ❌ | ✅ | **New** |
| Auto-hide on scroll | ✅ | ✅ | Same |
| Mobile responsive | ✅ | ✅ | Enhanced |

---

## 🎓 Training Users

### For Students

**Key Benefits**:
- Get instant homework help
- Explain difficult concepts
- Create study plans
- Summarize content

**How to Use**:
1. Click the purple bot button
2. Click "Homework Help" or type your question
3. Get AI-powered explanations
4. Ask follow-up questions

### For Teachers

**Key Benefits**:
- Generate quiz questions automatically
- Get assignment ideas
- Receive grading assistance
- Find teaching resources

**How to Use**:
1. Click the purple bot button
2. Click "Generate Quiz" for instant questions
3. Ask for assignment ideas
4. Get feedback suggestions

---

## 📚 Additional Resources

- **Full Guide**: [AI_SMART_ASSISTANT_GUIDE.md](./AI_SMART_ASSISTANT_GUIDE.md)
- **AI Features**: [AI_FEATURES_GUIDE.md](./AI_FEATURES_GUIDE.md)
- **API Docs**: [API_IMPLEMENTATION_GUIDE.md](./API_IMPLEMENTATION_GUIDE.md)
- **Troubleshooting**: See AI_SMART_ASSISTANT_GUIDE.md → Troubleshooting section

---

## ✅ Migration Complete!

Once you've completed these steps:

1. ✅ Updated imports (optional but recommended)
2. ✅ Added `GOOGLE_GENERATIVE_AI_API_KEY` to `.env.local`
3. ✅ Set user roles via `localStorage.setItem('userRole', ...)`
4. ✅ Tested all features
5. ✅ Cleared browser cache

Your migration is complete! Enjoy the new AI-powered assistant! 🎉

---

## 🆘 Need Help?

If you encounter issues during migration:

1. **Check Logs**: Open browser console (F12) for errors
2. **Read Docs**: See [AI_SMART_ASSISTANT_GUIDE.md](./AI_SMART_ASSISTANT_GUIDE.md)
3. **Contact Support**: support@edusync.com
4. **GitHub Issues**: https://github.com/ArhanAnsari/edusync/issues

---

**Migration Date**: October 18, 2025  
**Version**: LiveChat v1.0 → AI Smart Assistant v2.0  
**Status**: ✅ Complete
