# 🎨 Dark Mode & Theme System - Quick Reference

## 🌙 How Dark Mode Works

### Theme Toggle Locations:
1. **Landing Page** (`/`) - Top right navbar
2. **Student Dashboard** (`/dashboard/student`) - Header next to profile
3. **Teacher Dashboard** (`/dashboard/teacher`) - Header next to profile

### Theme Persistence:
- Theme choice saved in `localStorage`
- Automatically loads user's preference on next visit
- Falls back to system preference if no choice saved

---

## 🎨 Dark Mode Color Scheme

### Light Theme:
```
Background: from-blue-50 via-sky-50 to-indigo-50
Text: gray-900, gray-600
Cards: white
Borders: gray-200
```

### Dark Theme:
```
Background: from-gray-900 via-gray-800 to-gray-900
Text: gray-100, gray-300
Cards: gray-800
Borders: gray-700
```

---

## 🏆 Badge Award System - Quick Guide

### For Teachers:

#### Step 1: Access Badge Award Page
- Go to Teacher Dashboard
- Click "Award Badges" card (marked with "New" badge)
- Or navigate to `/dashboard/teacher/badges`

#### Step 2: Select a Badge
- Click on any of the 6 badge types
- See badge description appear
- Selected badge gets highlighted

#### Step 3: Choose a Student
- Use search box to filter by name or email
- Click on a student card to select
- Selected student gets highlighted with checkmark

#### Step 4: Award the Badge
- Click "Award Badge" button
- Wait for confirmation message
- Badge is saved to database

### Available Badges:
1. ⭐ **Star Student** (Yellow) - Excellent performance
2. 🏆 **Quiz Master** (Blue) - Perfect quiz score
3. 👑 **Top Performer** (Purple) - Highest grades
4. 🎯 **Goal Achiever** (Green) - Completed all assignments
5. ⚡ **Fast Learner** (Orange) - Quick completion
6. 🏅 **Perfect Attendance** (Pink) - Never missed a class

---

## 📱 Responsive Design Breakpoints

### Mobile (< 640px):
- 1 column layouts
- Hamburger menus
- Smaller text (text-xs, text-sm)
- Stacked buttons

### Tablet (640px - 1024px):
- 2 column layouts
- Some desktop features visible
- Medium text sizes
- Side-by-side buttons

### Desktop (> 1024px):
- 3-4 column layouts
- Full navigation visible
- Larger text sizes
- Enhanced spacing

---

## 🎯 Quick Testing Checklist

### Dark Mode:
- [ ] Toggle works on landing page
- [ ] Toggle works on student dashboard
- [ ] Toggle works on teacher dashboard
- [ ] Theme persists after page reload
- [ ] All text is readable in both themes
- [ ] All cards display properly
- [ ] All buttons are visible
- [ ] Footer displays correctly

### Badge System:
- [ ] Badge page loads without errors
- [ ] All 6 badges display
- [ ] Badge selection works
- [ ] Student search works
- [ ] Student selection works
- [ ] Award button is enabled when both selected
- [ ] Success message appears after awarding
- [ ] Badge saves to database

### Responsiveness:
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] All menus accessible
- [ ] All buttons clickable
- [ ] All text readable
- [ ] No horizontal scroll

---

## 💡 Pro Tips

### For Dark Mode:
1. Theme automatically detects system preference
2. Use theme toggle to override system preference
3. Theme works on all pages (landing, dashboards, docs, support)
4. Dark mode optimized for nighttime viewing

### For Badge Awards:
1. Search students by typing name or email
2. Click badge first, then select student (or vice versa)
3. Both selections required before awarding
4. Clear feedback with success/error messages
5. Badges display in student dashboard
6. Can award multiple badges to same student

### For Mobile Use:
1. Use hamburger menu on small screens
2. All features accessible via mobile menu
3. Touch-friendly button sizes
4. Swipe-friendly interfaces
5. Optimized for one-handed use

---

## 🔧 Customization Guide

### Change Theme Colors:
Edit `app/globals.css`:
```css
/* Light mode primary color */
--color-primary: 221.2 83.2% 53.3%;

/* Dark mode primary color */
.dark {
  --color-primary: 217.2 91.2% 59.8%;
}
```

### Add New Badge Types:
Edit `app/dashboard/teacher/badges/page.tsx`:
```typescript
const availableBadges: Badge[] = [
  // Add your new badge here
  { 
    icon: YourIcon, 
    name: 'Badge Name', 
    description: 'Description', 
    color: 'bg-color-500' 
  },
];
```

### Modify Breakpoints:
Edit Tailwind classes in components:
```tsx
// Change from 2 columns on tablet to 3
className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4"
```

---

## 📚 Related Documentation

- `PROJECT_COMPLETE.md` - Full project overview
- `FINAL_IMPLEMENTATION.md` - Latest session details
- `BUG_FIXES_PROGRESS.md` - Development progress
- `DEVELOPMENT_GUIDE.md` - Setup instructions
- `README.md` - Project documentation

---

## 🆘 Troubleshooting

### Dark Mode Not Working:
1. Check if ThemeContext is imported
2. Verify ThemeProvider wraps your app
3. Clear localStorage and try again
4. Check browser console for errors

### Badge Award Failing:
1. Verify Appwrite connection
2. Check database permissions
3. Ensure both badge and student selected
4. Check network tab for API errors

### Responsive Issues:
1. Test in different browsers
2. Clear cache and reload
3. Check for CSS conflicts
4. Verify Tailwind classes

---

**For more help, visit `/support` page or check the documentation!**
