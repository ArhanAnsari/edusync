# Appwrite Submissions Collection Update

## Problem Fixed
The "Unknown User" issue in the grading page was caused by teacher accounts not having permission to read the users collection. 

## Solution
We now store the user's name and email directly in each submission document.

## Required Appwrite Changes

### Add New Attributes to `submissions` Collection:

1. **Open Appwrite Console** → Navigate to your database → `submissions` collection

2. **Add these two new attributes:**

   **Attribute 1: userName**
   - Type: `String`
   - Size: `255`
   - Required: `No` (to support old submissions)
   - Default: `null`

   **Attribute 2: userEmail**
   - Type: `String`
   - Size: `255`
   - Required: `No` (to support old submissions)
   - Default: `null`

3. **Save and Deploy**

## How It Works Now

### New Submissions (after this update):
- When students submit assignments, their name and email are stored directly in the submission
- Teachers can immediately see the student's name without needing to access the users collection

### Old Submissions (before this update):
- The code falls back to looking up the user in the users collection
- If not found, shows a truncated user ID

## Code Changes Made

### 1. Student Assignments Page (`app/dashboard/student/assignments/page.tsx`)
```typescript
// Now stores userName and userEmail in submission
await databases.createDocument(
  config.databaseId,
  config.collections.submissions,
  submissionId,
  {
    submissionId,
    assignmentId: activeAssignment.assignmentId,
    userId: user.$id,
    userName: user.name,        // NEW
    userEmail: user.email,      // NEW
    content: submissionContent,
    submittedAt: new Date().toISOString(),
  },
  // ... permissions
);
```

### 2. Teacher Grading Page (`app/dashboard/teacher/grading/page.tsx`)
```typescript
// Updated Submission interface
interface Submission {
  $id: string;
  submissionId: string;
  assignmentId: string;
  userId: string;
  userName?: string;     // NEW
  userEmail?: string;    // NEW
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  $createdAt: string;
}

// Updated getUserName function
const getUserName = (submission: Submission) => {
  // First, try to get name from the submission itself (new submissions)
  if (submission.userName) {
    return submission.userName;
  }
  
  // Fallback for old submissions
  const foundUser = users.find((u) => u.$id === submission.userId);
  if (foundUser?.name) {
    return foundUser.name;
  }
  
  // Last resort
  return `User ${submission.userId.substring(0, 8)}...`;
};
```

## Testing

1. After adding the attributes in Appwrite, refresh your application
2. Have a student submit a new assignment
3. Go to the teacher grading page
4. The student's name should now appear correctly
5. Old submissions may still show "User xxxxx..." until they're resubmitted

## Benefits

✅ No permission issues - data is stored in the submission itself
✅ Faster - no need to lookup users collection
✅ More reliable - works even if users collection is restricted
✅ Backward compatible - old submissions still work (with fallback)
