# 🧪 AI Assistant Quick Test Guide

**Run these tests to verify the fix works!**

---

## ⚡ Quick Tests (2 minutes)

### Test 1: Basic Message (30 seconds)
```
1. Open http://localhost:3000
2. Click purple AI button (bottom-right)
3. Type: "Hello"
4. Press Enter
5. ✅ Expect: AI greeting
```

---

### Test 2: Math Question (30 seconds)
```
1. Ask: "What is 2³?"
2. ✅ Expect: Response with $2^3 = 8$ (rendered math)
```

---

### Test 3: Conversation (30 seconds)
```
1. Ask: "What is photosynthesis?"
2. Wait for response
3. Ask: "Can you summarize that?"
4. ✅ Expect: AI references previous answer
```

---

### Test 4: Markdown (30 seconds)
```
1. Ask: "Create a study schedule table"
2. ✅ Expect: Formatted table with borders
```

---

## 🔍 Detailed Tests (5 minutes)

### Test 5: Error Handling
```
1. Turn off WiFi
2. Send message
3. ✅ Expect: "Network issue - please check your internet connection"
4. Turn on WiFi
5. Send message
6. ✅ Expect: Normal AI response
```

---

### Test 6: Long Conversation
```
1. Ask: "Explain logarithms"
2. Wait for response
3. Ask: "Give me an example"
4. Wait for response
5. Ask: "What did we talk about first?"
6. ✅ Expect: AI remembers talking about logarithms
```

---

### Test 7: LaTeX Rendering
```
1. Ask: "Show me the quadratic formula"
2. ✅ Expect: 
   x = (-b ± √(b²-4ac)) / 2a
   [Properly rendered with fraction bar]
```

---

### Test 8: Code Examples
```
1. Ask: "Show me a Python factorial function"
2. ✅ Expect: 
   - Code block with syntax highlighting
   - Explanation text
```

---

### Test 9: Tables
```
1. Ask: "Compare renewable energy types in a table"
2. ✅ Expect:
   - Table with borders
   - Multiple rows and columns
   - Proper alignment
```

---

### Test 10: Role-Based
```
1. Open browser console (F12)
2. Run: localStorage.setItem('userRole', 'student')
3. Refresh page
4. Ask: "Help me study"
5. ✅ Expect: Student-focused tips

6. Run: localStorage.setItem('userRole', 'teacher')
7. Refresh page
8. Ask: "Help me create lesson plans"
9. ✅ Expect: Teacher-focused suggestions
```

---

## 🐛 If Tests Fail

### Test 1 Fails (No Response)
**Problem:** API connection issue

**Check:**
```bash
# 1. Verify server running
npm run dev

# 2. Check browser console (F12)
# Look for errors

# 3. Check terminal
# Look for API errors
```

**Fix:**
```bash
# Restart server
npm run dev
```

---

### Test 2 Fails (Math Not Rendered)
**Problem:** LaTeX not working

**Check:**
```bash
# Verify dependencies
npm list katex
npm list react-markdown
```

**Fix:**
```bash
# Reinstall if missing
npm install katex react-markdown remark-math rehype-katex remark-gfm
```

---

### Test 3 Fails (No History)
**Problem:** Message format incorrect

**Check:**
```javascript
// In AISmartAssistant.tsx
// Verify this line exists:
const apiMessages = messages
  .filter(msg => msg.type === 'text')
  .map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.text
  }));
```

**Fix:**
- Verify the fix was applied correctly
- Check `AI_SMART_ASSISTANT_FIX.md`

---

### All Tests Fail
**Problem:** Major issue

**Steps:**
```bash
# 1. Check .env.local
cat .env.local | grep GOOGLE_GENERATIVE_AI_API_KEY

# 2. Verify API key is set
# Should show: GOOGLE_GENERATIVE_AI_API_KEY="AIza..."

# 3. Clear cache
rm -rf .next
npm run dev

# 4. Check API route exists
ls app/api/ai/chat/route.ts

# 5. Test API directly
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

---

## ✅ Success Criteria

All tests should:
- ✅ Return responses within 2-3 seconds
- ✅ Show streaming text (if watching closely)
- ✅ Render LaTeX math correctly
- ✅ Format markdown properly
- ✅ Remember conversation context
- ✅ Show helpful error messages if issues occur

---

## 📊 Test Results Template

```
Date: [Today's date]
Tester: [Your name]

Test 1 - Basic Message:     [ ] Pass [ ] Fail
Test 2 - Math Question:     [ ] Pass [ ] Fail
Test 3 - Conversation:      [ ] Pass [ ] Fail
Test 4 - Markdown:          [ ] Pass [ ] Fail
Test 5 - Error Handling:    [ ] Pass [ ] Fail
Test 6 - Long Conversation: [ ] Pass [ ] Fail
Test 7 - LaTeX Rendering:   [ ] Pass [ ] Fail
Test 8 - Code Examples:     [ ] Pass [ ] Fail
Test 9 - Tables:            [ ] Pass [ ] Fail
Test 10 - Role-Based:       [ ] Pass [ ] Fail

Overall Status: [ ] All Pass [ ] Some Fail [ ] All Fail

Notes:
[Any issues or observations]
```

---

## 🎯 Expected Results

### Normal Operation
```
User types → AI responds → Math renders → Perfect! ✨
```

### With Errors
```
Network issue → Clear error message → User knows what to do
```

---

## 🚀 Quick Test Commands

### Test in Browser Console
```javascript
// Test 1: Check component loaded
console.log('AI Button present:', document.querySelector('[aria-label="Open AI Assistant"]') !== null);

// Test 2: Check user role
console.log('User role:', localStorage.getItem('userRole'));

// Test 3: Set role
localStorage.setItem('userRole', 'student');

// Test 4: Check messages
// Open AI chat and send message, then check:
// Network tab → Filter by "chat" → Check request/response
```

---

## 💡 Pro Tips

1. **Test with DevTools open** - See network requests and errors
2. **Test on different browsers** - Chrome, Firefox, Safari
3. **Test on mobile** - Open on phone browser
4. **Test with slow network** - Throttle in DevTools
5. **Test rapid messages** - Send multiple quickly
6. **Test long messages** - Send paragraph-length questions
7. **Test special characters** - Use emojis, symbols
8. **Test different languages** - Ask in Spanish, French, etc.
9. **Test edge cases** - Very long responses, empty messages
10. **Test error recovery** - Cause error, then retry

---

## 📝 Test Checklist

Before marking as complete:

- [ ] Run all 10 tests
- [ ] Verify math rendering
- [ ] Verify markdown formatting
- [ ] Test error handling
- [ ] Test on mobile
- [ ] Test conversation history
- [ ] Check browser console (no errors)
- [ ] Check server logs (no errors)
- [ ] Test with different user roles
- [ ] Verify streaming works

---

## 🎉 When All Tests Pass

**Congratulations!** 🎊

Your AI Smart Assistant is:
- ✅ Fully functional
- ✅ Properly connected
- ✅ Rendering math beautifully
- ✅ Formatting markdown correctly
- ✅ Handling errors gracefully
- ✅ Production ready!

**Next:** Start using it for real questions! 🚀

---

*Quick Test Guide*  
*Date: October 20, 2025*  
*Time to test: 2-5 minutes*  
*Difficulty: Easy*  

**START TESTING NOW!** ⚡
