# 🧪 AI Assistant Test Prompts - LaTeX & Markdown

## Quick Test Prompts

Copy and paste these into your AI Assistant to test the new features!

---

## 📐 Math Tests

### Test 1: Basic Logarithms
```
Explain logarithms using this example: log₂(8) = 3
```

Expected: Should render $\log_2(8) = 3$ beautifully

---

### Test 2: Quadratic Formula
```
What is the quadratic formula?
```

Expected: Should show formatted equation with proper fractions and square root

---

### Test 3: Integration
```
Show me the integral of x²
```

Expected: Should render $$\int x^2 \, dx = \frac{x^3}{3} + C$$

---

### Test 4: Complex Equation
```
Explain Einstein's mass-energy equivalence
```

Expected: Should render $E = mc^2$ with proper formatting

---

## 📝 Markdown Tests

### Test 5: Study Schedule
```
Create a weekly study schedule for a high school student in a table format
```

Expected: Beautiful table with headers and proper borders

---

### Test 6: Code Example
```
Show me a Python function to calculate factorial
```

Expected: Code block with syntax highlighting

---

### Test 7: Mixed Content
```
Explain the Pythagorean theorem with examples and diagrams
```

Expected: Mix of text, headers, lists, and inline/display math

---

### Test 8: Chemistry
```
Write the photosynthesis equation
```

Expected: Chemical equation with subscripts rendered properly

---

## 🎯 Complete Example Test

### Test 9: Full Featured Response
```
Explain quadratic equations including:
1. The formula
2. How to solve them step by step
3. A Python code example
4. A comparison table of different methods
```

Expected output:
- Headers (H1, H2, H3)
- Numbered lists
- Inline math $ax^2 + bx + c = 0$
- Display math for the formula
- Code block with Python
- Table comparing methods
- Bold and italic text

---

## 🔧 Troubleshooting Tests

### If LaTeX doesn't render:
1. Check browser console (F12) for errors
2. Verify katex.min.css is loaded
3. Clear cache: `Ctrl + Shift + R`
4. Check Network tab for failed CSS requests

### If button not visible:
1. Try different device/browser
2. Check z-index with DevTools
3. Look for CSS conflicts
4. Verify portal rendering in Elements tab

### If markdown doesn't work:
1. Check if react-markdown is installed
2. Verify plugin configuration
3. Test with simple markdown first (just `**bold**`)
4. Gradually add more complex features

---

## ✅ Success Criteria

You should see:
- ✅ Math equations rendered beautifully (not as plain text)
- ✅ Headers styled with purple highlights
- ✅ Code blocks with dark background
- ✅ Tables with borders
- ✅ Lists properly indented
- ✅ Bold and italic text formatted
- ✅ Smooth animations
- ✅ Purple gradient theme maintained

---

## 📱 Device Testing

Test on:
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari Desktop
- [ ] Edge Desktop
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Tablet (iPad/Android)

---

## 🚀 Ready to Test!

1. **Install dependencies:**
   ```bash
   # Double-click this file:
   install-markdown-latex.bat
   
   # Or run manually:
   npm install react-markdown remark-math rehype-katex remark-gfm katex
   ```

2. **Clear cache and restart:**
   ```bash
   # Use the batch file:
   start-clean.bat
   
   # Or manually:
   rmdir /s /q .next
   npm run dev
   ```

3. **Open browser:**
   - Go to http://localhost:3000
   - Look for purple AI button (bottom-right)
   - Click to open chat

4. **Test prompts:**
   - Copy any test prompt from above
   - Paste into chat
   - Watch the magic! ✨

---

## 🎓 Pro Tips

- Type "help" to see suggested prompts
- Try complex questions with multiple parts
- Test on mobile by opening your dev server on your phone (same WiFi)
- Use DevTools to inspect rendered LaTeX elements
- Check console for any errors

Happy testing! 🎉
