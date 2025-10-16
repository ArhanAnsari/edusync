# Testing Guide - Critical Fixes

## Test 1: Quiz Duplicate Submission Fix ✅

### Objective
Verify that submitting a quiz creates exactly ONE entry in the database, not two.

### Prerequisites
- Logged in as a student
- Have at least one quiz available
- Browser dev console open (F12)

### Test Steps

#### A. Test Manual Submit (Click Button)
1. Navigate to Student Quizzes page
2. Click "Start Quiz" on any quiz
3. Answer all questions (or skip)
4. Click "Submit Quiz" button
5. **Expected**: Alert shows score, one entry appears in Appwrite
6. **Verify in Appwrite**: 
   - Go to quizAttempts collection
   - Filter by quizId and userId
   - Count entries = 1 ✓

#### B. Test Auto-Submit (Timer)
1. Start a quiz with 2-3 minute timer
2. Answer 1-2 questions
3. Let timer count down to 0 (or manually adjust browser console)
4. **Expected**: Quiz auto-submits with only answered questions
5. **Verify**: Check browser console - should see "Quiz submitted successfully: [attemptId]"
6. **Verify in Appwrite**: 
   - New entry created with score calculated from answered questions
   - Only ONE entry for this attempt ✓

#### C. Test Submit + Rapid Click (Edge Case)
1. Start a quiz
2. Click "Submit Quiz" button TWICE very rapidly
3. **Expected**: 
   - First click submits
   - Second click does nothing (ref gate blocks it)
   - Console warning: "Submission already in progress, blocking duplicate call"
4. **Verify in Appwrite**: Only ONE entry ✓

#### D. Test Multiple Quizzes
1. Submit Quiz A (get 1 entry)
2. Submit Quiz B (get 1 entry)
3. Submit Quiz A again (get 1 entry)
4. **Expected**: Appwrite has 3 total entries
5. **Verify**: 
   - Quiz A has 2 attempts ✓
   - Quiz B has 1 attempt ✓
   - No duplicates ✓

### Success Criteria
- ✅ No duplicate submissions
- ✅ One database entry per quiz attempt
- ✅ Proper error handling
- ✅ User sees one success message (not two)

---

## Test 2: GitHub OAuth Profile Form ✅

### Objective
Verify that GitHub OAuth users are prompted to fill profile fields before dashboard access.

### Prerequisites
- GitHub account (or test account)
- GitHub OAuth app configured in Appwrite
- Fresh user (no existing profile)

### Test Steps

#### A. Test OAuth Flow - New User
1. Click "Sign up with GitHub" on login page
2. Authorize the application
3. **Expected**: Redirected to role selection with profile form
4. **Verify Form Fields**:
   - ✓ First Name field populated/editable
   - ✓ Last Name field populated/editable
   - ✓ Email field (read-only, pre-filled from GitHub)
   - ✓ Password field (required)
   - ✓ Confirm Password field (required)
   - ✓ Role selection buttons (Student/Teacher)

#### B. Test Password Validation
1. In password field, type weak password: "test"
2. **Expected**: Shows validation errors:
   - ✗ At least 8 characters
   - ✗ One uppercase letter
   - ✗ One lowercase letter
   - ✗ One number
3. Update to strong password: "MyPassword123"
4. **Expected**: Shows "✓ Password meets requirements"

#### C. Test Password Confirmation
1. Enter password: "MyPassword123"
2. Enter different confirmPassword: "MyPassword124"
3. **Expected**: Error "Passwords do not match"
4. Fix confirmPassword to match
5. **Expected**: "✓ Passwords match"

#### D. Test Form Submission
1. Fill all fields correctly:
   - First Name: "John"
   - Last Name: "Doe"
   - Password: "MyPassword123"
   - Confirm Password: "MyPassword123"
   - Role: "Student" (selected)
2. Click "Continue"
3. **Expected**: Profile created, redirected to student dashboard
4. **Verify in Appwrite**:
   - New user document in `users` collection
   - firstName = "John"
   - lastName = "Doe"
   - email = GitHub email
   - role = "student"

#### E. Test Existing User Auto-redirect
1. Logout
2. Login with same GitHub account again
3. **Expected**: 
   - Detects existing profile
   - Skips form entirely
   - Redirects directly to student dashboard
   - No form shown ✓

#### F. Test Role Selection
1. Repeat OAuth flow with role = "Teacher"
2. **Expected**: Redirected to teacher dashboard after submission
3. **Verify in Appwrite**: role = "teacher"

#### G. Test Required Field Validation
1. Try submitting without filling fields:
   - Leave First Name empty, click Continue
   - **Expected**: Error "First name is required"
   - Leave Last Name empty
   - **Expected**: Error "Last name is required"
   - Leave Password empty
   - **Expected**: Error "Password is required"

### Success Criteria
- ✅ Profile form appears for new OAuth users
- ✅ All required fields are collected
- ✅ Email pre-filled and read-only
- ✅ Password validation works (8+ chars, uppercase, lowercase, number)
- ✅ Password confirmation validates
- ✅ Existing users skip form
- ✅ User redirects to correct role dashboard
- ✅ Data saves correctly to Appwrite
- ✅ Username generated as combination of first/last name

---

## Test 3: Integration Testing

### Objective
Verify both fixes work together in production flow.

### Test Steps

1. **New Student via OAuth**:
   - Login with GitHub
   - Fill profile form
   - Select "Student" role
   - Dashboard loads

2. **Create Quiz as Teacher**:
   - Login as teacher (or create via UI)
   - Create quiz with 5 questions, 2 max attempts

3. **Student Takes Quiz**:
   - Student goes to quizzes
   - Starts quiz from step 2
   - Answers questions (mix of correct/incorrect)
   - Submits quiz
   - Verify: 1 entry in attempts, score calculated

4. **Student Retakes Quiz**:
   - Student starts same quiz again
   - Answers different questions
   - Submits again
   - Verify: 2 entries in attempts, both have correct IDs

5. **Student Hits Max Attempts**:
   - Student attempts quiz 3rd time
   - System should show: "You have reached maximum attempts"
   - Verify: Quiz unavailable for further attempts

---

## Debugging Checklist

### If Quiz Duplicates Still Happen
1. Check browser console for logs
2. Look for multiple "Quiz submitted successfully" messages
3. Verify `isSubmittingRef.current` is being used
4. Check that timer doesn't have `timeLeft` in dependencies
5. Verify `finally` block resets ref

### If OAuth Form Doesn't Appear
1. Check URL params: ?fromOAuth=true should be present
2. Verify GitHub OAuth app is configured correctly
3. Check browser console for errors in useEffect
4. Verify Appwrite account.get() works

### If Form Validation Fails
1. Verify password regex patterns work correctly
2. Check that fields are actually filled before submit
3. Verify error state is being set
4. Check that validation messages display

---

## Monitoring Commands

### Check Quiz Attempts in Appwrite
```javascript
// In Appwrite console
db.getDocument('quizAttempts', [Query.equal('userId', 'YOUR_USER_ID')])
// Should show 1 entry per attempt, not duplicates
```

### Check User Profile Created
```javascript
// In Appwrite console
db.getDocument('users', 'USER_ID_FROM_GITHUB')
// Should show firstName, lastName, role, email
```

### Monitor Browser Console
- F12 → Console tab
- Look for: "Submission already in progress, blocking duplicate call"
- Look for: "Quiz submitted successfully: [ID]"
- Look for: Red errors (should be none)

---

## Success Metrics

### Quiz Fix
- [ ] Zero duplicate submissions across 10 test attempts
- [ ] Each quiz attempt = exactly 1 database entry
- [ ] Auto-submit works without duplicates
- [ ] Rapid-click doesn't create duplicates

### OAuth Fix
- [ ] All new OAuth users see profile form
- [ ] Profile form has all required fields
- [ ] Password validation works
- [ ] Existing users skip form (auto-redirect)
- [ ] User data saves correctly

### Overall
- [ ] No errors in browser console
- [ ] No Appwrite errors
- [ ] Smooth user experience
- [ ] Data integrity maintained
