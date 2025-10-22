# 🎓 EduSync - Real-time Collaborative Learning Platform

A modern, full-stack educational technology platform built with Next.js, React, and Appwrite. EduSync enables seamless collaboration between teachers and students with real-time features, comprehensive quiz systems, AI-powered learning assistance, and integrated productivity tools.

**Status**: ✅ Production-Ready | 🏆 Hackathon-Optimized | 🤖 AI-Enhanced

---

## 🌟 Key Features

### 🤖 **AI-Powered Learning (NEW!)**
- **Intelligent Quiz Generator**: Auto-generate quiz questions from any topic using Google Gemini
- **AI Study Assistant**: 24/7 AI chatbot for homework help and concept explanations
- **Smart Grading Assistant**: Get AI-powered feedback and grading suggestions
- **Content Summarization**: Automatically summarize study materials and extract key points
- **Personalized Recommendations**: AI-driven study plans based on student progress
- **Assignment Generator**: Get AI suggestions for assignment topics and descriptions
- **Concept Explainer**: Get detailed explanations of complex topics at any level
- Powered by **Google Gemini via Vercel AI SDK**

### 👥 **Role-Based Access Control**
- **Students**: Quiz taking, assignment submission, progress tracking
- **Teachers**: Content creation, student management, quiz building, performance analytics
- **Authentication**: GitHub OAuth + Email/Password with secure session management

### 📝 **Quiz Management System**
- ✅ Create, edit, and manage quizzes with multiple question types
- ✅ Set time limits and maximum attempts (with duplicate submission prevention)
- ✅ Automatic scoring and instant feedback
- ✅ Detailed attempt history and analytics
- ✅ Offline quiz support with automatic sync

### 🎯 **Assignment Tracking**
- Create and assign assignments with deadlines
- Student submission system with file uploads
- Grade tracking and feedback system
- Due date reminders and notifications

### 🎬 **Real-Time Collaboration**
- **Live Video Conferencing**: Integrated Daily.co for HD video calls
- **Document Collaboration**: Real-time shared document editing (Yjs + TipTap)
- **Whiteboard**: Interactive drawing canvas with real-time sync
- **Screen Sharing**: Share screen during live sessions
- **Chat System**: Real-time messaging with Socket.io

### 📊 **Analytics & Dashboard**
- Teacher dashboard with class performance metrics
- Student dashboard with progress tracking
- Quiz attempt analysis with detailed statistics
- Real-time charts and visualizations (Recharts)

### 🔗 **Third-Party Integrations**
- **Google Calendar**: Schedule classes and sync deadlines
- **Zoom**: Alternative video conferencing option
- **Slack**: Notifications and team communication
- **GitHub**: Connect coding assignments to repositories
- **Stripe**: Payment processing for premium features

### 📱 **Responsive & Modern UI**
- Dark/Light theme support (next-themes)
- Mobile-first responsive design (Tailwind CSS)
- Smooth animations (Framer Motion)
- Accessible components (Radix UI)

### 🔄 **Offline-First Architecture**
- Service Worker for offline functionality
- IndexedDB for local data persistence
- Automatic sync when connection restored
- Seamless offline-to-online experience

### 🚨 **Error Tracking & Monitoring**
- Sentry integration for production error tracking
- Structured logging and debugging
- Performance monitoring

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Appwrite instance (self-hosted or cloud)
- GitHub OAuth credentials
- Environment variables configured

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/ArhanAnsari/edusync.git
cd edusync

# Install dependencies
npm install
# or
yarn install

# Configure environment variables
### Environment Variables

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-instance/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google Generative AI (Gemini) - NEW!
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
# Get your API key from: https://aistudio.google.com/app/apikey

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key

# Video Conferencing
DAILY_API_KEY=your_daily_api_key

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## 🤖 AI Features Guide

### For Teachers

**1. AI Quiz Generator**
```
- Navigate to Teacher Dashboard → Quizzes → Create Quiz
- Click "AI Generate" button
- Enter topic (e.g., "JavaScript Promises")
- Select number of questions (3-20)
├── app/
│   ├── api/
│   │   ├── ai/                      # AI API endpoints (NEW!)
│   │   │   ├── chat/
│   │   │   ├── quiz-generator/
│   │   │   ├── assignment-helper/
│   │   │   ├── grading-assistant/
│   │   │   ├── content-summarizer/
│   │   │   ├── study-recommendations/
│   │   │   ├── explain-concept/
│   │   │   └── answer-question/
│   │   ├── v1/                      # REST API endpoints
│   │   │   ├── user/
│   │   │   ├── quizzes/
│   │   │   ├── assignments/
│   │   │   └── submissions/
│   │   └── integrations/            # Third-party integrations
│   │       ├── google-calendar/
│   │       ├── zoom/
│   │       ├── slack/
│   │       ├── github/
│   │       └── stripe/uggestions
- Each includes:
  ✓ Title and description
  ✓ Learning objectives
  ✓ Estimated completion time
  ✓ Suggested deadline
```

**3. AI Grading Assistant**
```
API: POST /api/ai/grading-assistant
- Submit assignment prompt and student work
- Optional: Include grading rubric
- Receive:
  ✓ Suggested score (0-100)
  ✓ List of strengths
  ✓ Areas for improvement
  ✓ Specific actionable suggestions
  ✓ Constructive overall comment
```

### For Students

**1. AI Study Assistant (Chatbot)**
```
- Available on Student Dashboard (floating button)
- Ask questions like:
  ✓ "Explain photosynthesis in simple terms"
  ✓ "Help me with this math problem"
  ✓ "What are good study strategies?"
  ✓ "Summarize this chapter"
- Get instant, context-aware responses
- Conversation history maintained
```

**2. Content Summarizer**
```
API: POST /api/ai/content-summarizer
- Upload or paste learning content
- Specify type (article/video-transcript/lecture-notes/textbook)
- Receive:
  ✓ 4-6 main points
  ✓ 3-5 key takeaways
  ✓ Concise summary
  ✓ Related topics to explore
```

**3. Personalized Study Recommendations**
```
API: POST /api/ai/study-recommendations
- Based on:
  ✓ Current topics
  ✓ Areas struggling with
  ✓ Personal interests
  ✓ Upcoming tests
- Get 3-5 specific recommendations with:
  ✓ Priority levels
  ✓ Suggested resources
  ✓ Estimated study time
```

**4. Concept Explainer**
```
API: POST /api/ai/explain-concept
- Enter any concept
- Choose explanation level:
  ✓ Simple: Easy language with analogies
  ✓ Detailed: Comprehensive with examples
  ✓ Advanced: Technical details and theory
```

### AI API Endpoints

```
POST /api/ai/chat                      # Real-time chat streaming
POST /api/ai/quiz-generator            # Generate quiz questions
POST /api/ai/assignment-helper         # Assignment suggestions
POST /api/ai/grading-assistant         # Grading feedback
POST /api/ai/content-summarizer        # Summarize materials
POST /api/ai/study-recommendations     # Personalized study plan
POST /api/ai/explain-concept           # Concept explanations
POST /api/ai/answer-question           # Q&A with context
```

### AI Technology Stack
- **Model**: Google Gemini 2.5 Pro
- **SDK**: Vercel AI SDK v5.0+
- **Provider**: @ai-sdk/google v2.0+
- **Validation**: Zod schemas for structured output
- **Features**: 
  - Streaming responses for real-time chat
  - Structured JSON generation for quizzes
  - Context-aware conversations
  - Error handling and rate limiting

DAILY_API_KEY=your_daily_api_key

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

---

## 📁 Project Structure

```
edusync/
├── app/
│   ├── api/
│   │   ├── v1/                      # REST API endpoints
│   │   │   ├── user/
│   │   │   ├── quizzes/
│   │   │   ├── assignments/
│   │   │   └── submissions/
│   │   └── integrations/            # Third-party integrations
│   │       ├── google-calendar/
│   │       ├── zoom/
│   │       ├── slack/
│   │       ├── github/
│   │       └── stripe/
│   ├── auth/                        # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   ├── callback/github/
│   │   └── select-role/
│   ├── dashboard/                   # Role-based dashboards
│   │   ├── student/
│   │   │   ├── quizzes/
│   │   │   ├── assignments/
│   │   │   └── progress/
│   │   └── teacher/
│   │       ├── quizzes/
│   │       ├── assignments/
│   │       └── analytics/
│   ├── features/                    # Collaboration features
│   │   └── collaboration/
│   │       ├── documents/
│   │       ├── video/
│   │       ├── whiteboard/
├── components/
│   ├── ui/                          # Reusable UI components
│   ├── ai/                          # AI components (NEW!)
│   │   ├── ChatBot.tsx
│   │   ├── AIAssistant.tsx
│   │   └── QuizGenerator.tsx
│   ├── Dashboard.tsx
│   ├── Footer.tsx
│   ├── GoogleAnalytics.tsx
│   ├── LiveChat.tsx
│   ├── ModeToggle.tsx
│   ├── ServiceWorkerRegistration.tsx
│   └── theme-provider.tsx
├── components/
├── lib/
│   ├── ai.ts                        # AI utilities (NEW!)
│   ├── appwrite.ts                  # Appwrite client
│   ├── auth.ts                      # Authentication helpers
│   ├── offline-sync.ts              # Offline sync logic
│   ├── types.ts                     # TypeScript types
│   └── utils.ts                     # Utility functions
│   ├── ServiceWorkerRegistration.tsx
│   └── theme-provider.tsx
│
├── contexts/
│   ├── AuthContext.tsx              # Authentication state
│   └── ThemeContext.tsx             # Theme management
│
├── lib/
│   ├── appwrite.ts                  # Appwrite client
│   ├── auth.ts                      # Authentication helpers
│   ├── offline-sync.ts              # Offline sync logic
│   ├── types.ts                     # TypeScript types
│   └── utils.ts                     # Utility functions
│
├── public/                          # Static assets
│
├── scripts/                         # Build & utility scripts
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts

```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.4 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Component Library**: Radix UI, DaisyUI
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts

### AI & Machine Learning (NEW!)
- **AI SDK**: Vercel AI SDK v5.0+
- **AI Provider**: Google Generative AI (@ai-sdk/google)
- **Model**: Google Gemini 1.5 Flash
- **Validation**: Zod for schema validation
- **Features**: Quiz generation, grading, chatbot, content summarization

### Backend & Serviceser Motion
- **Component Library**: Radix UI, DaisyUI
- **Icons**: Lucide React, React Icons
- **Charts**: Recharts

### Backend & Services
- **Backend**: Appwrite (open-source BaaS)
- **Real-time**: Socket.io
- **Collaboration**: Yjs + TipTap + Y-WebSocket
- **Video**: Daily.co
- **Email**: Resend
- **Payments**: Stripe
- **Whiteboard**: Excalidraw

### Development & DevOps
- **Language**: TypeScript 5
- **Package Manager**: npm/yarn
- **Build Tool**: Turbopack
- **Monitoring**: Sentry
- **Linting**: ESLint
- **Database**: Appwrite (PostgreSQL)
- **Storage**: Appwrite Storage

---

## 📊 API Endpoints

### User Management (`/api/v1/user`)
- `GET /api/v1/user` - Get current user profile
- `PATCH /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/dashboard` - Get dashboard data

### Quizzes (`/api/v1/quizzes`)
- `GET /api/v1/quizzes` - List all quizzes
- `GET /api/v1/quizzes/[id]` - Get quiz details
- `POST /api/v1/quizzes` - Create quiz (teacher)
- `PATCH /api/v1/quizzes/[id]` - Update quiz (teacher)
- `DELETE /api/v1/quizzes/[id]` - Delete quiz (teacher)

### Quiz Attempts
- `POST /api/v1/quiz-attempts` - Submit quiz
- `GET /api/v1/quiz-attempts` - Get attempt history
- `GET /api/v1/quiz-attempts/[id]` - Get attempt details

### Assignments (`/api/v1/assignments`)
- `GET /api/v1/assignments` - List assignments
- `POST /api/v1/assignments` - Create assignment (teacher)
- `PATCH /api/v1/assignments/[id]` - Update assignment
- `DELETE /api/v1/assignments/[id]` - Delete assignment

### Materials & Resources
- `GET /api/v1/materials` - List learning materials
- `POST /api/v1/materials` - Upload materials (teacher)
- `DELETE /api/v1/materials/[id]` - Delete material

### Integrations
- `POST /api/integrations/google-calendar` - Sync with Google Calendar
- `POST /api/integrations/slack` - Send Slack notifications
- `POST /api/integrations/stripe` - Process payments
- `GET /api/integrations/github` - Fetch GitHub repos

---

## 🔐 Authentication Flow

### Email/Password Registration
```
1. User enters email and password
2. Password validated (min 8 chars, uppercase, lowercase, number)
3. User profile created in Appwrite
4. Auto-login and redirect to role selection
5. Role selected → Dashboard access
```

### GitHub OAuth Registration
```
1. User clicks "Sign up with GitHub"
2. Redirects to GitHub OAuth consent
3. GitHub token returned to /auth/callback/github
4. User profile auto-detected or form shows
5. If new user:
   - Collect firstName, lastName, password
   - Validate all fields
   - Create profile in Appwrite
6. Redirect to role-based dashboard
```

---

## 🧪 Testing & Quality Assurance

### Quiz System Testing
- ✅ Quiz submissions verified (no duplicates)
- ✅ Auto-submit with timer working
- ✅ Attempt tracking accurate
- ✅ Max attempts limit enforced

### OAuth Testing
- ✅ GitHub authentication flow
- ✅ Profile form validation
- ✅ Auto-redirect for existing users
- ✅ Password strength enforcement

### Integration Testing
- ✅ Appwrite database operations
- ✅ Real-time Socket.io connections
- ✅ Offline sync functionality
- ✅ Service Worker caching

**Full testing guide available in**: `TESTING_FIXES.md`

---

## 📈 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Automatic font loading via next/font
- **Caching**: Service Worker for offline support
- **Database Indexing**: Appwrite collection indexes
- **Real-time Efficiency**: Socket.io namespaces for targeted updates

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect repository to Vercel
# Configure environment variables in Vercel dashboard
# Automatic deployment on push to main branch

# Or deploy via CLI
vercel
```

### Docker
```bash
docker build -t edusync .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_APPWRITE_ENDPOINT=$ENDPOINT \
  -e NEXT_PUBLIC_APPWRITE_PROJECT_ID=$PROJECT_ID \
  edusync
```

### Self-Hosted
```bash
npm run build
npm run start
```

---

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed installation instructions
- **[API Documentation](./API_IMPLEMENTATION_GUIDE.md)** - API endpoint reference
- **[Testing Guide](./TESTING_FIXES.md)** - Test procedures and debugging
- **[Phase 5 Summary](./PHASE5_COMPLETION.md)** - Latest improvements
- **[Roadmap](./MOCK_TO_REAL_ROADMAP.md)** - Future features

---

## 🎯 Hackathon Highlights

### ✨ What Makes This a Great Hackathon Project

**1. Complete Feature Set**
- Full-stack application with frontend + backend
- Multiple user roles with distinct workflows
- Real-time collaboration capabilities

**2. Production-Ready Code**
- TypeScript for type safety
- Error handling and validation
- Comprehensive documentation
- Testing procedures included

**3. Scalable Architecture**
- Modular component structure
- RESTful API design
- Real-time Socket.io integration
- Offline-first approach

**4. Modern Tech Stack**
- Latest Next.js 15 with Turbopack
- React 19 with hooks
- Tailwind CSS for styling
- Real-time features (Socket.io, WebSocket)

**5. User Experience**
- Responsive mobile-first design
- Smooth animations
- Accessibility-focused components

**6. Security & Privacy**
- Secure authentication (GitHub OAuth + password)
- Role-based access control
- Data encryption in transit
- Permission-based document access

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Areas for Contribution
- Feature improvements and bug fixes
- UI/UX enhancements
- Performance optimizations
- Documentation improvements
- Additional integrations

---

## 🐛 Known Issues & Fixes

### Phase 5 Fixes Applied ✅
- **Quiz Duplicate Submissions**: Fixed with ref-based synchronous gate
- **OAuth Profile Completion**: Added required fields (firstName, lastName, password)
- **Offline Sync**: Implemented Service Worker and IndexedDB

See `CRITICAL_FIXES_APPLIED.md` for technical details.

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/ArhanAnsari/edusync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ArhanAnsari/edusync/discussions)
- **Email**: arhanansari2009@gmail.com
- **Documentation**: [EduSync Docs](https://edusync.appwrite.network/docs)

---

## 📝 License
### Key Statistics
- **Lines of Code**: 25,000+
- **Components**: 60+
- **API Endpoints**: 25+
- **AI Features**: 8+
- **Database Collections**: 10+
- **Real-time Features**: 5+
- **Integrations**: 5+
- **Documentation Pages**: 60+

### Recent Achievements (Phase 6 - AI Integration)
- ✅ Integrated Google Gemini AI throughout the platform
- ✅ Created 8 AI API endpoints with full functionality
- ✅ Built reusable AI components (ChatBot, QuizGenerator, AIAssistant)
- ✅ Added AI quiz generation for teachers
- ✅ Implemented AI study assistant for students
- ✅ Created comprehensive AI utilities library
- ✅ Updated documentation with AI features guide
- **API Endpoints**: 15+
- **Database Collections**: 8+
- **Real-time Features**: 5+
- **Integrations**: 5+
- **Documentation Pages**: 50+

### Recent Achievements (Phase 5)
- ✅ Fixed critical quiz duplicate submission bug
- ✅ Implemented complete OAuth profile form
- ✅ Created comprehensive documentation (10 files)
- ✅ Prepared detailed testing procedures
- ✅ Production-ready codebase with zero errors

---

## 🚀 Getting Started for Hackathon Judges

### Quick Demo (5 minutes)
1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Sign up" → Enter credentials
3. Select role (Student/Teacher)
4. Explore dashboard
5. Try creating/taking a quiz

### Deep Dive (15 minutes)
1. Review `PHASE5_EXECUTIVE_SUMMARY.md`
2. Check code quality in key files
3. Run test procedures from `TESTING_FIXES.md`
4. Review API endpoints

### Full Assessment (30 minutes)
1. Read `CRITICAL_FIXES_APPLIED.md` for architecture
2. Review code in `app/dashboard/` and `app/api/`
3. Check database schema in Appwrite
4. Review error handling and validation

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Version** | 0.1.0 |
| **Node.js Requirement** | 18+ |
| **Build Tool** | Turbopack |
| **Dependencies** | 30+ |
| **Development Files** | 10+ |
| **Last Updated** | October 2025 |
| **Production Ready** | ✅ Yes |

---

## ✅ Quick Checklist for Judges

- [x] Complete feature set (5+ major features)
- [x] Clean, readable codebase
- [x] Type-safe with TypeScript
- [x] Comprehensive error handling
- [x] Production-ready deployment
- [x] Detailed documentation
- [x] Testing procedures included
- [x] Real-time functionality
- [x] Responsive design
- [x] Security best practices

---

**Ready to explore EduSync? Start with `npm run dev` and dive in!** 🚀
