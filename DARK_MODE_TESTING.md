# Dark Mode Testing Guide

## Quick Test Steps

### 1. Clear Browser Data (First Time)
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('edusync-theme');
location.reload();
```

### 2. Test Landing Page
1. Navigate to `http://localhost:3001`
2. Look for Sun/Moon icon in top right header
3. Click icon - page should switch between light and dark
4. Check these elements change color:
   - Background gradient
   - Header background
   - Text colors
   - Navigation links
   - Button styles

### 3. Test Student Dashboard
1. Login as student
2. Click Sun/Moon icon in header
3. Verify all sections update:
   - Welcome message
   - Stats cards
   - Feature cards
   - Navigation links
   - User profile text

### 4. Test Teacher Dashboard  
1. Login as teacher
2. Click Sun/Moon icon in header
3. Verify all sections update:
   - Welcome message
   - Stats cards
   - Action cards
   - Navigation menu
   - Badge award button

### 5. Test Login Page
1. Logout or open in incognito
2. Go to `/login`
3. Page should match current theme (no toggle here)
4. Return to homepage and change theme
5. Go back to `/login` - should be in new theme

### 6. Test Signup Page
1. Go to `/signup`
2. Same behavior as login page
3. Should match system theme

### 7. Test Persistence
1. Set theme to dark mode
2. Refresh page (F5)
3. Theme should stay dark
4. Navigate between pages
5. Theme should persist

### 8. Test System Preference
1. Clear localStorage:
   ```javascript
   localStorage.removeItem('edusync-theme');
   ```
2. Change OS theme to dark mode
3. Reload page
4. Should automatically be in dark mode
5. Change OS theme to light
6. Reload page
7. Should automatically be in light mode

## Expected Behavior

### Light Mode
- **Background**: Blue/sky/indigo gradient
- **Header**: White with slight transparency
- **Text**: Dark gray (readable)
- **Links**: Gray text, blue on hover
- **Cards**: White background

### Dark Mode
- **Background**: Dark gray gradient (900/800/900)
- **Header**: Dark gray with transparency
- **Text**: Light gray (readable)
- **Links**: Light gray text, light blue on hover
- **Cards**: Dark gray background

## Common Issues & Solutions

### Issue: Theme Doesn't Change
**Solution**: Check browser console for errors
```javascript
// Verify theme is in localStorage
console.log(localStorage.getItem('edusync-theme'));

// Verify HTML has class
console.log(document.documentElement.classList);
```

### Issue: Flash of Light Theme on Load
**Solution**: This should be fixed by the blocking script. If still happening:
1. Hard refresh (Ctrl+Shift+R)
2. Clear cache
3. Check if script in `<head>` is running

### Issue: Some Text Not Visible
**Solution**: Check if element has dark mode classes:
```tsx
// Should have both light and dark classes
className="text-gray-600 dark:text-gray-300"
```

### Issue: Theme Works But Doesn't Persist
**Solution**: Check localStorage permissions:
```javascript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage working');
} catch(e) {
  console.error('localStorage blocked:', e);
}
```

## Browser Console Commands

### Check Current Theme
```javascript
localStorage.getItem('edusync-theme')
```

### Set Theme Manually
```javascript
// Set to dark
localStorage.setItem('edusync-theme', 'dark');
location.reload();

// Set to light
localStorage.setItem('edusync-theme', 'light');
location.reload();
```

### Debug Theme Application
```javascript
// Check HTML class
document.documentElement.classList.contains('dark') // Should be true in dark mode
document.documentElement.classList.contains('light') // Should be true in light mode

// Check colorScheme
document.documentElement.style.colorScheme // Should be 'dark' or 'light'
```

### Listen for Theme Changes
```javascript
// Monitor localStorage changes
window.addEventListener('storage', (e) => {
  if (e.key === 'edusync-theme') {
    console.log('Theme changed to:', e.newValue);
  }
});
```

## Demo Accounts for Testing

### Student Account
- Email: `student@test.com`
- Password: `password123`
- Should see: Materials, Quizzes, Assignments

### Teacher Account  
- Email: `teacher@test.com`
- Password: `password123`
- Should see: Materials, Quizzes, Assignments, Grading, Badge Awards

## Automated Testing (Optional)

```javascript
// Run this in console to test all theme states
async function testTheme() {
  // Test dark mode
  localStorage.setItem('edusync-theme', 'dark');
  location.reload();
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Dark mode:', document.documentElement.classList.contains('dark'));
  
  // Test light mode
  localStorage.setItem('edusync-theme', 'light');
  location.reload();
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Light mode:', document.documentElement.classList.contains('light'));
}

testTheme();
```

## Checklist

- [ ] Landing page toggle works
- [ ] Student dashboard toggle works
- [ ] Teacher dashboard toggle works
- [ ] Badge award page respects theme
- [ ] Login page respects theme
- [ ] Signup page respects theme
- [ ] Theme persists on reload
- [ ] Theme persists across navigation
- [ ] System preference detected
- [ ] No flash on page load
- [ ] All text readable in both themes
- [ ] All links visible in both themes
- [ ] Cards styled correctly in both themes
- [ ] Buttons styled correctly in both themes
- [ ] Forms styled correctly in both themes

---

**All tests should pass!** ✅

If any test fails, check the console for errors and verify the file has been saved with the latest changes.
