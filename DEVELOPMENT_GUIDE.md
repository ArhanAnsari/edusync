# 🎓 EduSync - Complete Development Guide

## 🎉 Congratulations! Your Foundation is Ready

You now have a **production-ready foundation** for EduSync with:

✅ Authentication system (signup, login, logout)
✅ Offline-first architecture with IndexedDB
✅ Beautiful UI with ShadCN components
✅ Teacher & Student dashboard pages
✅ Real-time network status monitoring
✅ TypeScript type safety
✅ Comprehensive documentation

---

## 🚀 Getting Started (First Time Setup)

### 1. Install All Dependencies

```bash
npm install
```

This installs:
- **appwrite** (^21.0.0) - Backend SDK
- **framer-motion** (^12.23.22) - Animations
- **recharts** (^3.2.1) - Charts
- **idb** (^8.0.3) - IndexedDB wrapper
- **lucide-react** (^0.544.0) - Icons
- **class-variance-authority**, **clsx**, **tailwind-merge** - Utilities

### 2. Set Up Appwrite

#### A. Create Appwrite Project

1. Go to: https://cloud.appwrite.io
2. Sign up / Log in
3. Click "Create Project"
4. Name: **EduSync**
5. Copy your **Project ID**

#### B. Create Database

1. Go to **Databases** → **Create Database**
2. Name: `edusync-db`
3. Copy the **Database ID**

#### C. Create Collections

Create these 7 collections with the schemas below:

**1. users**
```
Attributes:
- name (String, 255, Required)
- email (Email, Required) → Add Index
- role (String, 10, Required) → Add Index (values: student, teacher)
- avatar (URL, Optional)
- createdAt (DateTime, Required)

Permissions:
- Read: Any
- Create: Users
- Update: Document Owner
```

**2. assignments**
```
Attributes:
- title (String, 255, Required)
- description (String, 5000, Required)
- dueDate (DateTime, Required)
- maxScore (Integer, Required)
- teacherId (String, 50, Required)
- teacherName (String, 255, Required)
- subject (String, 100, Required)
- attachmentUrl (URL, Optional)
- createdAt (DateTime, Required)
- updatedAt (DateTime, Required)

Permissions:
- Read: Any
- Create: Role:teacher
- Update: Document Owner
```

**3. quizzes**
```
Attributes:
- title (String, 255, Required)
- description (String, 2000, Required)
- questions (String, 50000, Required) [Store JSON]
- teacherId (String, 50, Required)
- teacherName (String, 255, Required)
- subject (String, 100, Required)
- duration (Integer, Required) [minutes]
- totalPoints (Integer, Required)
- createdAt (DateTime, Required)
- updatedAt (DateTime, Required)

Permissions:
- Read: Any
- Create: Role:teacher
- Update: Document Owner
```

**4. submissions**
```
Attributes:
- assignmentId (String, 50, Required)
- studentId (String, 50, Required)
- studentName (String, 255, Required)
- content (String, 10000, Required)
- fileUrl (URL, Optional)
- fileName (String, 255, Optional)
- score (Integer, Optional)
- feedback (String, 2000, Optional)
- submittedAt (DateTime, Required)
- gradedAt (DateTime, Optional)
- status (String, 20, Required) [pending, graded]

Permissions:
- Read: Role:teacher, Document Owner
- Create: Role:student
- Update: Role:teacher
```

**5. quiz_attempts**
```
Attributes:
- quizId (String, 50, Required)
- quizTitle (String, 255, Required)
- studentId (String, 50, Required)
- studentName (String, 255, Required)
- answers (String, 10000, Required) [Store JSON array]
- score (Integer, Required)
- totalPoints (Integer, Required)
- percentage (Float, Required)
- completedAt (DateTime, Required)
- timeSpent (Integer, Required) [seconds]

Permissions:
- Read: Role:teacher, Document Owner
- Create: Role:student
```

**6. materials**
```
Attributes:
- title (String, 255, Required)
- description (String, 2000, Required)
- content (String, 50000, Required)
- fileUrl (URL, Optional)
- fileName (String, 255, Optional)
- teacherId (String, 50, Required)
- teacherName (String, 255, Required)
- subject (String, 100, Required)
- createdAt (DateTime, Required)
- updatedAt (DateTime, Required)

Permissions:
- Read: Any
- Create: Role:teacher
- Update: Document Owner
```

**7. badges**
```
Attributes:
- name (String, 255, Required)
- description (String, 500, Required)
- icon (String, 50, Required) [emoji or icon name]
- requirement (String, 500, Required)
- type (String, 20, Required) [quiz, assignment, streak, special]

Permissions:
- Read: Any
- Create: Role:admin (you)
```

#### D. Create Storage Bucket

1. Go to **Storage** → **Create Bucket**
2. Name: `edusync-files`
3. Permissions:
   - Read: Any
   - Create: Role:teacher, Role:student
   - Update: Document Owner
   - Delete: Document Owner
4. Maximum File Size: 50MB
5. Allowed Extensions: `jpg,png,pdf,doc,docx,ppt,pptx,txt,zip`

#### E. Copy All IDs

You'll need:
- Project ID
- Database ID
- All 7 Collection IDs
- Storage Bucket ID

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID=your_bucket_id_here

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_ASSIGNMENTS_COLLECTION_ID=assignments
NEXT_PUBLIC_APPWRITE_QUIZZES_COLLECTION_ID=quizzes
NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID=submissions
NEXT_PUBLIC_APPWRITE_MATERIALS_COLLECTION_ID=materials
NEXT_PUBLIC_APPWRITE_QUIZ_ATTEMPTS_COLLECTION_ID=quiz_attempts
NEXT_PUBLIC_APPWRITE_BADGES_COLLECTION_ID=badges

# Optional - For AI features
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🧪 Testing Your Setup

### 1. Test Authentication

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign up"
3. Create a teacher account:
   - Name: Test Teacher
   - Email: teacher@test.com
   - Password: test1234
   - Role: Teacher
4. You should be redirected to `/dashboard/teacher`
5. Logout and create a student account
6. Test the student dashboard at `/dashboard/student`

### 2. Test Offline Mode

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Change throttling to **Offline**
4. Navigate around the app
5. The offline indicator should show "Offline Mode"
6. Try interacting with features
7. Change back to **Online** - data should sync

---

## 📝 What's Already Working

### ✅ Landing Page (`/`)
- Hero section with call-to-action
- Features showcase
- Stats display
- Responsive design
- Smooth animations

### ✅ Authentication
- **Signup** (`/signup`): Role selection, form validation
- **Login** (`/login`): Session management, error handling
- **Context**: Global auth state with `useAuth()` hook
- **Protection**: Auto-redirect for unauthorized access

### ✅ Teacher Dashboard (`/dashboard/teacher`)
- Welcome message with user info
- Stats cards (ready for real data)
- Quick action cards
- Real-time network status
- Recent activity placeholder

### ✅ Student Dashboard (`/dashboard/student`)
- Personalized greeting
- Badge display
- Stats overview
- Offline-ready indicators
- Progress tracking UI

### ✅ Offline Infrastructure
- IndexedDB schema defined
- Sync status tracking
- Auto-sync mechanism
- Network status monitoring

---

## 🔨 What You Need to Build Next

### Priority 1: Core Functionality (4-6 hours)

#### A. Teacher: Materials Management
Create: `app/dashboard/teacher/materials/page.tsx`

Features needed:
- List all materials
- Create new material form
- Upload files to Appwrite Storage
- Edit/delete materials

#### B. Teacher: Quiz Creator
Create: `app/dashboard/teacher/quizzes/page.tsx`

Features needed:
- Quiz builder interface
- Add/remove questions
- Set correct answers
- Save to Appwrite Database

#### C. Student: Materials Viewer
Create: `app/dashboard/student/materials/page.tsx`

Features needed:
- Display all materials
- Download for offline access
- Save to IndexedDB
- Search/filter by subject

#### D. Student: Quiz Taker
Create: `app/dashboard/student/quizzes/page.tsx`

Features needed:
- List available quizzes
- Quiz attempt interface
- Timer countdown
- Save answers offline
- Submit when online

### Priority 2: Submissions & Grading (3-4 hours)

#### E. Teacher: Assignment Creation
Create: `app/dashboard/teacher/assignments/page.tsx`

Features needed:
- Assignment form
- File attachments
- Due date picker
- Save to database

#### F. Student: Assignment Submission
Create: `app/dashboard/student/assignments/page.tsx`

Features needed:
- View assignments
- Submit text/file
- Track submission status

#### G. Teacher: Grading Interface
Create: `app/dashboard/teacher/submissions/page.tsx`

Features needed:
- View all submissions
- Grade and provide feedback
- Update scores

### Priority 3: Polish & Features (2-3 hours)

#### H. Real-time Updates
Add Appwrite Realtime subscriptions:

```typescript
import client from '@/lib/appwrite';

// Subscribe to new submissions
client.subscribe(
  `databases.${databaseId}.collections.${submissionsCollection}.documents`,
  response => {
    // Update UI with new submission
  }
);
```

#### I. Gamification
- Create badge seed data in Appwrite
- Implement badge awarding logic
- Display earned badges

#### J. Analytics (Optional)
- Use Recharts for progress charts
- Student performance over time
- Class average comparisons

---

## 🎨 UI Components You Can Use

All these are already set up in `components/ui/`:

- `<Button />` - Primary, secondary, outline, ghost variants
- `<Card />` - Container for content
- `<Input />` - Text inputs
- `<Label />` - Form labels
- `<Badge />` - Status indicators

**Example usage:**

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>My Quiz</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Start Quiz</Button>
  </CardContent>
</Card>
```

---

## 💡 Code Snippets to Help You

### Creating a Material (Teacher)

```typescript
import { databases, storage, ID, config } from '@/lib/appwrite';

async function createMaterial(title: string, content: string, file?: File) {
  let fileUrl;
  
  // Upload file if exists
  if (file) {
    const fileDoc = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );
    fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${config.storageId}/files/${fileDoc.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
  }

  // Create material document
  await databases.createDocument(
    config.databaseId,
    config.collections.materials,
    ID.unique(),
    {
      title,
      content,
      fileUrl,
      teacherId: user.$id,
      teacherName: user.name,
      subject: 'Math', // Get from form
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
}
```

### Saving Quiz Attempt Offline (Student)

```typescript
import { saveToOfflineDB } from '@/lib/offline-sync';

async function submitQuizOffline(quizId: string, answers: number[]) {
  const attempt = {
    id: crypto.randomUUID(),
    quizId,
    studentId: user.$id,
    studentName: user.name,
    answers,
    score: calculateScore(answers),
    completedAt: new Date().toISOString(),
    syncStatus: 'pending' as const,
  };

  // Save locally
  await saveToOfflineDB('quizAttempts', attempt);

  // Will auto-sync when online
}
```

### Loading Materials from IndexedDB

```typescript
import { getAllFromOfflineDB } from '@/lib/offline-sync';

async function loadOfflineMaterials() {
  const materials = await getAllFromOfflineDB('materials');
  return materials;
}
```

---

## 🚀 Deployment Checklist

When you're ready to deploy:

### 1. Build Test
```bash
npm run build
```
Fix any TypeScript errors.

### 2. Push to GitHub
```bash
git add .
git commit -m "Complete EduSync MVP"
git push origin main
```

### 3. Deploy to Vercel

1. Go to vercel.com
2. Import your GitHub repo
3. Add all environment variables from `.env.local`
4. Deploy!

### 4. Configure Appwrite

In Appwrite Console:
- Go to **Settings** → **Platforms**
- Click **Add Platform** → **Web App**
- Add your Vercel URL: `https://your-app.vercel.app`
- Add localhost for development: `http://localhost:3000`

---

## 🎯 Success Metrics for Hackathon

Your project will stand out if you demonstrate:

1. **Innovation** ✅
   - Offline-first is unique
   - Auto-sync solves real problems
   
2. **Implementation** ✅
   - Clean code structure
   - Type-safe TypeScript
   - Modern best practices

3. **Design** ✅
   - Professional UI
   - Smooth animations
   - Responsive layout

4. **Feasibility** ✅
   - Working authentication
   - Database integration
   - Real offline capability

5. **Documentation** ✅
   - Comprehensive README
   - Setup instructions
   - Demo credentials

---

## 🆘 Troubleshooting

### "Appwrite SDK error"
- Check `.env.local` has correct IDs
- Verify Appwrite project is active
- Check browser console for details

### "Collection not found"
- Verify all 7 collections are created
- Check collection ID matches `.env.local`
- Ensure permissions are set correctly

### "Offline sync not working"
- Open browser console
- Check for IndexedDB errors
- Verify `idb` package is installed

### "Login not working"
- Check Appwrite Auth is enabled
- Verify user role is set in database
- Check browser cookies are enabled

---

## 📞 Need Help?

1. **Appwrite Docs**: https://appwrite.io/docs
2. **Next.js Docs**: https://nextjs.org/docs
3. **ShadCN UI**: https://ui.shadcn.com

---

## 🎊 Final Words

You have an **amazing foundation** for a hackathon-winning project!

**Time Estimate to Complete MVP:**
- Core features: 6-8 hours
- Polish & testing: 2-3 hours
- **Total: 8-11 hours**

**You've got this! Good luck with Hacktoberfest! 🚀**

---

*Made with ❤️ for Hacktoberfest 2025*
