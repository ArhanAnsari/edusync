# 📦 AI Features - Final Installation Instructions

## Quick Installation Steps

Follow these steps to complete the AI integration setup:

---

## Step 1: Fix PowerShell Execution Policy

**Issue**: PowerShell blocked npm installation due to execution policy.

**Solution** (Choose one):

### Option A: Use Git Bash or WSL (Recommended)
```bash
# Open Git Bash or WSL terminal instead of PowerShell
npm install @radix-ui/react-scroll-area @radix-ui/react-select
```

### Option B: Change PowerShell Policy
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then install packages
npm install @radix-ui/react-scroll-area @radix-ui/react-select
```

---

## Step 2: Install Missing Packages

```bash
npm install @radix-ui/react-scroll-area @radix-ui/react-select
```

**Expected Output**:
```
added 2 packages, and audited X packages in Ys

X packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

---

## Step 3: Get Google Gemini API Key

1. **Visit**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click**: "Create API Key"
4. **Copy** the generated key

**Free Tier Limits**:
- 15 requests per minute
- 1,500 requests per day
- Perfect for development and testing

---

## Step 4: Configure Environment Variable

Edit `.env.local` and add:

```env
# Add this line
GOOGLE_GENERATIVE_AI_API_KEY=AIza...your_actual_key_here

# Make sure it's on a new line after other variables
```

**Important**:
- No spaces around the `=` sign
- No quotes around the API key
- Restart dev server after adding this

---

## Step 5: Verify Installation

```bash
# Restart development server
npm run dev
```

**Expected Output**:
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Turbopack (beta) compiled successfully
```

---

## Step 6: Test AI Features

### Test 1: Teacher Quiz Generator

1. **Navigate**: http://localhost:3000/dashboard/teacher/quizzes
2. **Click**: "Create Quiz"
3. **Fill**: Quiz Name (e.g., "JavaScript Quiz")
4. **Click**: "AI Generate" button (purple, with sparkle icon)
5. **Enter**:
   - Topic: "JavaScript Promises"
   - Number: 5 questions
   - Difficulty: Medium
6. **Click**: "Generate Quiz Questions"
7. **Wait**: 5-10 seconds
8. **Verify**: Questions appear below with:
   - Question text
   - 4 options
   - Correct answer marked green
   - Explanation

### Test 2: Student AI Chatbot

1. **Navigate**: http://localhost:3000/dashboard/student
2. **Look for**: Floating button (bottom-right corner, chat icon)
3. **Click**: The floating button
4. **Type**: "Explain photosynthesis in simple terms"
5. **Press**: Enter or click Send
6. **Verify**: AI responds with explanation

### Test 3: API Health Check

**Create test file**: `test-ai.js`

```javascript
async function testAI() {
  const response = await fetch('http://localhost:3000/api/ai/quiz-generator', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'React Hooks',
      numberOfQuestions: 3,
      difficulty: 'easy'
    })
  });
  
  const data = await response.json();
  console.log(data);
}

testAI();
```

**Run**:
```bash
node test-ai.js
```

**Expected**: JSON with 3 quiz questions

---

## Troubleshooting

### Error: "Cannot find module '@radix-ui/react-scroll-area'"

**Cause**: Packages not installed

**Solution**:
```bash
npm install @radix-ui/react-scroll-area @radix-ui/react-select
```

### Error: "API key not configured"

**Cause**: Environment variable not set or dev server not restarted

**Solution**:
1. Check `.env.local` has `GOOGLE_GENERATIVE_AI_API_KEY=your_key`
2. Restart dev server: `Ctrl+C` then `npm run dev`

### Error: "Rate limit exceeded"

**Cause**: Free tier limit reached (15 requests/minute)

**Solution**:
- Wait 1 minute before trying again
- Reduce number of questions generated
- Consider upgrading to paid plan

### Error: "Failed to generate questions"

**Possible Causes**:
1. **No internet connection** - AI needs internet
2. **Invalid API key** - Check key is correct
3. **Topic too vague** - Try more specific topic
4. **Service down** - Check Google AI Studio status

**Debug**:
```bash
# Check if API key is set
echo $GOOGLE_GENERATIVE_AI_API_KEY  # Linux/Mac/Git Bash
echo %GOOGLE_GENERATIVE_AI_API_KEY% # Windows CMD
$env:GOOGLE_GENERATIVE_AI_API_KEY   # PowerShell
```

---

## Build and Deploy

### Local Build Test

```bash
npm run build
```

**Expected**: Build completes with 0 errors

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add AI features with Google Gemini"
git push origin main
```

2. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `GOOGLE_GENERATIVE_AI_API_KEY` with your API key
   - Redeploy

3. **Test in Production**:
   - Visit your production URL
   - Test quiz generator
   - Test chatbot

---

## Production Checklist

- [ ] Radix UI packages installed
- [ ] API key configured in `.env.local`
- [ ] Dev server runs without errors
- [ ] Quiz generator works
- [ ] Chatbot responds correctly
- [ ] Build completes successfully (`npm run build`)
- [ ] API key added to production environment
- [ ] Production deployment tested
- [ ] Error tracking configured (Sentry)
- [ ] Usage monitoring set up (Google AI Studio)

---

## Usage Monitoring

### Check API Usage

1. Visit: https://aistudio.google.com/app/apikey
2. Click on your API key
3. View usage statistics:
   - Requests per day
   - Requests per minute
   - Token usage

### Set Up Alerts

**In Google AI Studio**:
- Set up alerts for quota limits
- Monitor for errors
- Track response times

**In Your App**:
```typescript
// Add to lib/ai.ts
export function logAIUsage(endpoint: string, tokens: number) {
  console.log(`[AI] ${endpoint}: ${tokens} tokens`);
  // Send to analytics service
}
```

---

## Next Steps

1. **Explore All Features**:
   - Try all 8 AI API endpoints
   - Test with different topics
   - Experiment with difficulty levels

2. **Customize**:
   - Adjust system prompts in `lib/ai.ts`
   - Modify component styling
   - Add your own AI features

3. **Optimize**:
   - Implement response caching
   - Add rate limiting middleware
   - Monitor performance

4. **Extend**:
   - Add AI to more pages
   - Create new AI-powered features
   - Integrate with other services

---

## Support Resources

- **Documentation**: `AI_FEATURES_GUIDE.md` (complete guide)
- **Summary**: `AI_IMPLEMENTATION_SUMMARY.md` (overview)
- **README**: Updated with AI features section
- **Vercel AI SDK**: https://sdk.vercel.ai/docs
- **Google AI Studio**: https://aistudio.google.com/

---

## Files Added/Modified

### New Files (12)
```
lib/ai.ts                                  ✅
app/api/ai/chat/route.ts                   ✅
app/api/ai/quiz-generator/route.ts         ✅
app/api/ai/assignment-helper/route.ts      ✅
app/api/ai/grading-assistant/route.ts      ✅
app/api/ai/content-summarizer/route.ts     ✅
app/api/ai/study-recommendations/route.ts  ✅
app/api/ai/explain-concept/route.ts        ✅
app/api/ai/answer-question/route.ts        ✅
components/ai/ChatBot.tsx                  ✅
components/ai/QuizGenerator.tsx            ✅
components/ai/AIAssistant.tsx              ✅
components/ui/scroll-area.tsx              ✅
components/ui/select.tsx                   ✅
AI_FEATURES_GUIDE.md                       ✅
AI_IMPLEMENTATION_SUMMARY.md               ✅
```

### Modified Files (3)
```
app/dashboard/teacher/quizzes/page.tsx     ✅
app/dashboard/student/page.tsx             ✅
README.md                                  ✅
.env.example                               ✅
```

---

## Quick Command Reference

```bash
# Install packages
npm install @radix-ui/react-scroll-area @radix-ui/react-select

# Start dev server
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint

# View package versions
npm list ai @ai-sdk/google zod

# Test API endpoint
curl -X POST http://localhost:3000/api/ai/quiz-generator \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript","numberOfQuestions":3,"difficulty":"easy"}'
```

---

**Status**: 🎉 AI Features Implemented | 📦 Awaiting Package Installation | 🚀 Ready to Test

**Estimated Time to Complete**: 5-10 minutes

**Questions?** Check `AI_FEATURES_GUIDE.md` or contact arhanansari2009@gmail.com
