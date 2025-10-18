# 🤖 AI Features - Complete Setup & Implementation Guide

## Overview

EduSync now includes comprehensive AI-powered features using **Google Gemini** via the **Vercel AI SDK**. This document provides complete setup instructions and technical implementation details.

---

## 📋 Table of Contents

1. [Quick Setup](#quick-setup)
2. [AI Features Overview](#ai-features-overview)
3. [Installation & Configuration](#installation--configuration)
4. [API Reference](#api-reference)
5. [Component Usage](#component-usage)
6. [Integration Guide](#integration-guide)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup

### 1. Install Required Packages

```bash
npm install ai @ai-sdk/google zod @radix-ui/react-scroll-area @radix-ui/react-select
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment Variables

Add to your `.env.local`:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

### 4. Verify Installation

```bash
npm run dev
```

Navigate to:
- **Teacher Dashboard → Quizzes → Create Quiz** (AI Generate button)
- **Student Dashboard** (AI Study Assistant floating button)

---

## 🎯 AI Features Overview

### For Teachers

#### 1. **AI Quiz Generator** ⭐ Most Popular
- **Location**: Teacher Dashboard → Quizzes → Create Quiz → "AI Generate" button
- **Functionality**: Generate 1-20 quiz questions from any topic
- **Features**:
  - Multiple choice questions with 4 options
  - Automatic correct answer selection
  - Detailed explanations
  - Difficulty levels (Easy/Medium/Hard)
  - Point assignment (5/10/15 based on difficulty)

#### 2. **AI Assignment Helper**
- **API**: `POST /api/ai/assignment-helper`
- **Functionality**: Generate assignment suggestions
- **Output**:
  - Title and description
  - Learning objectives
  - Difficulty level
  - Estimated completion time
  - Suggested deadline

#### 3. **AI Grading Assistant**
- **API**: `POST /api/ai/grading-assistant`
- **Functionality**: Get grading feedback and suggestions
- **Output**:
  - Suggested score (0-100)
  - List of strengths (3-5 items)
  - Areas for improvement (2-4 items)
  - Specific suggestions
  - Overall constructive comment

### For Students

#### 1. **AI Study Assistant (Chatbot)** ⭐ Most Popular
- **Location**: Student Dashboard (floating button bottom-right)
- **Functionality**: 24/7 AI tutor for homework help
- **Capabilities**:
  - Explain concepts
  - Solve problems step-by-step
  - Study tips and strategies
  - Review material
  - Answer questions

#### 2. **Content Summarizer**
- **API**: `POST /api/ai/content-summarizer`
- **Functionality**: Summarize study materials
- **Output**:
  - 4-6 main points
  - 3-5 key takeaways
  - Concise summary
  - Related topics

#### 3. **Study Recommendations**
- **API**: `POST /api/ai/study-recommendations`
- **Functionality**: Personalized study plan
- **Based on**:
  - Current topics
  - Struggling areas
  - Personal interests
  - Upcoming tests

#### 4. **Concept Explainer**
- **API**: `POST /api/ai/explain-concept`
- **Functionality**: Explain any concept at 3 levels
- **Levels**:
  - Simple: Easy language with analogies
  - Detailed: Comprehensive with examples
  - Advanced: Technical details and theory

---

## 🛠️ Installation & Configuration

### Package Installation

```bash
# Core AI packages
npm install ai @ai-sdk/google zod

# UI components (if not already installed)
npm install @radix-ui/react-scroll-area @radix-ui/react-select

# Verify installation
npm list ai @ai-sdk/google zod
```

### Expected Package Versions

```json
{
  "ai": "^5.0.76",
  "@ai-sdk/google": "^2.0.23",
  "zod": "^4.1.12"
}
```

### Environment Variables

**Required:**
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

**Optional (with defaults):**
```env
GEMINI_MODEL=gemini-1.5-flash        # Default model
GEMINI_MAX_TOKENS=8192               # Max response length
GEMINI_TEMPERATURE=0.7               # Response creativity (0-1)
```

### Gemini API Key Setup

1. **Free Tier Limits**:
   - 15 requests per minute
   - 1 million tokens per minute
   - 1,500 requests per day

2. **Pricing** (as of 2024):
   - Gemini 1.5 Flash: Free up to 15 RPM
   - Paid plans available for higher limits

3. **Best Practices**:
   - Implement rate limiting in your app
   - Cache responses when possible
   - Use appropriate max_tokens to reduce costs
   - Monitor usage in Google AI Studio

---

## 📚 API Reference

### 1. Quiz Generator

**Endpoint**: `POST /api/ai/quiz-generator`

**Request:**
```typescript
{
  topic: string;              // Required: Topic for quiz questions
  numberOfQuestions: number;  // Optional: 1-20 (default: 5)
  difficulty: 'easy' | 'medium' | 'hard'; // Optional (default: 'medium')
}
```

**Response:**
```typescript
{
  success: true,
  topic: string,
  numberOfQuestions: number,
  difficulty: string,
  questions: Array<{
    question: string;
    options: string[4];       // Exactly 4 options
    correctAnswer: number;    // Index 0-3
    explanation: string;
    difficulty: string;
    points: number;           // 5/10/15 based on difficulty
  }>
}
```

**Example:**
```javascript
const response = await fetch('/api/ai/quiz-generator', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'JavaScript Promises',
    numberOfQuestions: 10,
    difficulty: 'medium'
  })
});

const data = await response.json();
console.log(data.questions); // Array of 10 questions
```

### 2. Assignment Helper

**Endpoint**: `POST /api/ai/assignment-helper`

**Request:**
```typescript
{
  topic: string;              // Required
  studentLevel: 'beginner' | 'intermediate' | 'advanced'; // Optional
  numberOfSuggestions: number; // Optional: 1-10 (default: 3)
}
```

**Response:**
```typescript
{
  success: true,
  topic: string,
  studentLevel: string,
  numberOfSuggestions: number,
  suggestions: Array<{
    title: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    learningObjectives: string[];
    suggestedDeadline: string;
  }>
}
```

### 3. Grading Assistant

**Endpoint**: `POST /api/ai/grading-assistant`

**Request:**
```typescript
{
  assignmentPrompt: string;   // Required: Original assignment
  studentSubmission: string;  // Required: Student's work
  rubric?: string;            // Optional: Grading rubric
}
```

**Response:**
```typescript
{
  success: true,
  feedback: {
    score: number;            // 0-100
    strengths: string[];      // 3-5 items
    weaknesses: string[];     // 2-4 items
    suggestions: string[];    // Actionable improvements
    overallComment: string;   // Constructive feedback
  },
  timestamp: string;
}
```

### 4. Content Summarizer

**Endpoint**: `POST /api/ai/content-summarizer`

**Request:**
```typescript
{
  content: string;            // Required: Min 50 characters
  contentType: 'article' | 'video-transcript' | 'lecture-notes' | 'textbook';
}
```

**Response:**
```typescript
{
  success: true,
  contentType: string,
  contentLength: number,
  summary: {
    mainPoints: string[];     // 4-6 items
    keyTakeaways: string[];   // 3-5 items
    summary: string;          // 2-3 sentences
    relatedTopics: string[];  // 3-4 items
  },
  timestamp: string;
}
```

### 5. Study Recommendations

**Endpoint**: `POST /api/ai/study-recommendations`

**Request:**
```typescript
{
  currentTopics: string[];    // Required: Non-empty array
  strugglingWith?: string[];  // Optional
  interests?: string[];       // Optional
  upcomingTests?: string[];   // Optional
}
```

**Response:**
```typescript
{
  success: true,
  recommendations: Array<{
    topic: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    resources: string[];
    estimatedTime: string;
  }>,
  timestamp: string;
}
```

### 6. Concept Explainer

**Endpoint**: `POST /api/ai/explain-concept`

**Request:**
```typescript
{
  concept: string;            // Required: Min 2 characters
  context?: string;           // Optional: Additional context
  level: 'simple' | 'detailed' | 'advanced'; // Optional (default: 'detailed')
}
```

**Response:**
```typescript
{
  success: true,
  concept: string,
  level: string,
  context?: string,
  explanation: string,        // Detailed explanation
  timestamp: string;
}
```

### 7. Answer Question

**Endpoint**: `POST /api/ai/answer-question`

**Request:**
```typescript
{
  question: string;           // Required: Min 3 characters
  context?: string;           // Optional: Reference material
  previousMessages?: Array<{  // Optional: Conversation history
    role: 'user' | 'assistant';
    content: string;
  }>;
}
```

**Response:**
```typescript
{
  success: true,
  question: string,
  answer: string,             // AI response
  timestamp: string;
}
```

### 8. Chat (Streaming)

**Endpoint**: `POST /api/ai/chat`

**Request:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: string;           // Optional: System context
}
```

**Response**: Streaming text response

**Note**: This endpoint returns a streaming response for real-time chat. Not currently used by the ChatBot component (using answer-question instead).

---

## 🧩 Component Usage

### QuizGenerator Component

**Location**: `components/ai/QuizGenerator.tsx`

**Props:**
```typescript
interface QuizGeneratorProps {
  onQuestionsGenerated?: (questions: QuizQuestion[]) => void;
  defaultTopic?: string;
}
```

**Usage:**
```tsx
import { QuizGenerator } from '@/components/ai/QuizGenerator';

<QuizGenerator 
  onQuestionsGenerated={(questions) => {
    console.log('Generated:', questions);
    // Add to your quiz
  }}
  defaultTopic="JavaScript"
/>
```

### AIChatbot Component

**Location**: `components/ai/ChatBot.tsx`

**Props:**
```typescript
interface AIChatbotProps {
  context?: string;
  placeholder?: string;
  title?: string;
  minimized?: boolean;
}
```

**Usage:**
```tsx
import { AIChatbot } from '@/components/ai/ChatBot';

// Floating button (minimized)
<AIChatbot 
  context="Student learning math"
  title="Math Tutor"
  placeholder="Ask me about math..."
  minimized={true}
/>

// Inline chat
<AIChatbot 
  context="Programming concepts"
  minimized={false}
/>
```

### AIAssistant Component

**Location**: `components/ai/AIAssistant.tsx`

**Props:**
```typescript
interface AIAssistantCardProps {
  features: AIFeature[];
  title?: string;
  description?: string;
}
```

**Usage:**
```tsx
import { AIAssistantCard, teacherAIFeatures } from '@/components/ai/AIAssistant';

<AIAssistantCard 
  features={teacherAIFeatures((type) => {
    if (type === 'quiz') {
      // Open quiz generator
    }
  })}
  title="AI Teaching Tools"
  description="Powered by Google Gemini"
/>
```

---

## 🔗 Integration Guide

### Adding AI to Teacher Quiz Page

```tsx
import { QuizGenerator } from '@/components/ai/QuizGenerator';
import { Sparkles } from 'lucide-react';

// In your component
const [showAIGenerator, setShowAIGenerator] = useState(false);

const handleAIGenerated = (aiQuestions) => {
  // Convert AI questions to your quiz format
  const formatted = aiQuestions.map(q => ({
    id: generateId(),
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
  }));
  
  // Add to existing questions
  setQuestions([...questions, ...formatted]);
  setShowAIGenerator(false);
};

// In JSX
<Button onClick={() => setShowAIGenerator(!showAIGenerator)}>
  <Sparkles className="w-4 h-4 mr-2" />
  AI Generate
</Button>

{showAIGenerator && (
  <QuizGenerator 
    onQuestionsGenerated={handleAIGenerated}
    defaultTopic={quizName}
  />
)}
```

### Adding AI to Student Dashboard

```tsx
import { AIChatbot } from '@/components/ai/ChatBot';

// Add at the end of your dashboard
<AIChatbot 
  context={`Student: ${user?.name}\\nHelp with studies`}
  title="AI Study Assistant"
  minimized={true}
/>
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find module 'ai'" Error

**Solution:**
```bash
npm install ai @ai-sdk/google zod
```

#### 2. Radix UI Component Errors

**Solution:**
```bash
npm install @radix-ui/react-scroll-area @radix-ui/react-select
```

#### 3. API Key Not Working

**Check:**
- API key is correctly set in `.env.local`
- Variable name is exactly `GOOGLE_GENERATIVE_AI_API_KEY`
- Restart dev server after adding env variables
- API key has no extra spaces or quotes

**Test:**
```bash
# In terminal
echo $GOOGLE_GENERATIVE_AI_API_KEY  # Linux/Mac
echo %GOOGLE_GENERATIVE_AI_API_KEY% # Windows
```

#### 4. Rate Limit Errors

**Free tier limits:**
- 15 requests per minute
- 1,500 requests per day

**Solutions:**
- Implement request caching
- Add rate limiting middleware
- Upgrade to paid plan
- Use exponential backoff for retries

#### 5. PowerShell Script Execution Error

**Error:** "running scripts is disabled on this system"

**Solution:**
```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Git Bash / WSL instead of PowerShell.

---

## 📊 Performance Optimization

### Best Practices

1. **Caching**:
```typescript
// Cache AI responses for common questions
const cache = new Map<string, string>();

async function getCachedResponse(question: string) {
  if (cache.has(question)) {
    return cache.get(question);
  }
  
  const response = await fetchAI(question);
  cache.set(question, response);
  return response;
}
```

2. **Rate Limiting**:
```typescript
// Implement rate limiting
const rateLimit = {
  requests: 0,
  resetTime: Date.now() + 60000, // 1 minute
  limit: 15,
};

function checkRateLimit() {
  if (Date.now() > rateLimit.resetTime) {
    rateLimit.requests = 0;
    rateLimit.resetTime = Date.now() + 60000;
  }
  
  if (rateLimit.requests >= rateLimit.limit) {
    throw new Error('Rate limit exceeded');
  }
  
  rateLimit.requests++;
}
```

3. **Error Handling**:
```typescript
try {
  const result = await generateQuizQuestions(topic, count, difficulty);
  return result;
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Show user-friendly message
    return { error: 'Too many requests. Please wait a moment.' };
  }
  // Handle other errors
  return { error: 'Failed to generate questions. Please try again.' };
}
```

---

## 🚀 Next Steps

1. **Test All Features**:
   - Generate a quiz
   - Chat with AI assistant
   - Get assignment suggestions
   - Try grading assistant

2. **Customize**:
   - Adjust system prompts in `lib/ai.ts`
   - Modify temperature for creativity
   - Change max tokens for length

3. **Monitor**:
   - Check API usage in Google AI Studio
   - Watch for rate limit errors
   - Track response times

4. **Deploy**:
   - Add `GOOGLE_GENERATIVE_AI_API_KEY` to production env
   - Test in production environment
   - Monitor error rates with Sentry

---

## 📞 Support

**Having issues?**
- Check [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- Review [Google AI Studio](https://aistudio.google.com/)
- Open an issue on GitHub
- Contact: arhanansari2009@gmail.com

---

**AI Features Status**: ✅ Production Ready | 🚀 Fully Integrated | 🤖 Powered by Google Gemini
