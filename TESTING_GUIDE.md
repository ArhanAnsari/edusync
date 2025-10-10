# 🚀 Quick Test Guide

## Start the Dev Server

```powershell
cd "d:\My Projects\VS Code Projects\Website\edusync"
npm run dev
```

## Test Checklist

### 1. Dark Mode Toggle (Most Important!)
- [ ] Open http://localhost:3001
- [ ] Click Moon/Sun icon in top-right
- [ ] **Verify**: Page colors change instantly
- [ ] **Verify**: Text remains readable
- [ ] **Verify**: Refresh page - theme persists
- [ ] Test on login page (/login)
- [ ] Test on student dashboard (login first)
- [ ] Test on teacher dashboard

### 2. Quiz Submission
- [ ] Login as student (student@demo.com / demo1234)
- [ ] Go to Quizzes page
- [ ] Start any quiz
- [ ] Answer all questions
- [ ] Click Submit
- [ ] **Verify**: No error about "attemptNumber"
- [ ] **Verify**: Shows score successfully

### 3. GitHub OAuth (Optional - requires setup)
- [ ] Go to /login
- [ ] See "Or continue with" section
- [ ] See GitHub button
- [ ] (Setup required in Appwrite to test fully)

### 4. Offline Mode
- [ ] Open DevTools (F12)
- [ ] Network tab → Throttle dropdown → Select "Offline"
- [ ] **Verify**: Header shows "Offline" indicator
- [ ] Try taking a quiz
- [ ] **Verify**: Quiz saved locally (no network error)
- [ ] Switch back to "Online"
- [ ] **Verify**: Data syncs automatically

### 5. Custom Pages
- [ ] Visit /this-does-not-exist
- [ ] **Verify**: See custom 404 page with EduSync branding
- [ ] Has "Go Home" and "Browse Docs" buttons

## Expected Results

### Dark Mode Working:
```
✅ Toggle responds immediately
✅ Background changes (white → dark gray)
✅ Text changes (dark → light)
✅ Cards change color
✅ Buttons change color
✅ Inputs change color
✅ No flash on page load
✅ Theme persists after refresh
```

### Quiz Submission Working:
```
✅ Submit button works
✅ No "Missing attemptNumber" error
✅ Shows score alert
✅ Redirects back to quiz list
✅ Attempt count increases
```

### Offline Mode Working:
```
✅ Offline indicator shows
✅ Can still take quizzes
✅ Data saved to IndexedDB
✅ Auto-syncs when online
```

## Common Issues

### Issue: "Dark mode not changing"
**Check**:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check DevTools Console for errors

### Issue: "Quiz submission still failing"
**Check**:
1. Verify you're logged in as student
2. Check Network tab for actual error
3. Verify Appwrite connection

### Issue: "GitHub button not working"
**Note**: Requires Appwrite OAuth configuration first!
See COMPLETE_FIX_SUMMARY.md for setup steps.

## Success Indicators

✅ **Dark mode works**: Click toggle → colors change instantly  
✅ **Quiz works**: Submit quiz → see score, no errors  
✅ **Offline works**: Go offline → can still use app  
✅ **GitHub ready**: Button shows on login page  

---

**If all tests pass → Ready for production! 🎉**
