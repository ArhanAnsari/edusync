# ⚡ EduSync - Quick Start Guide

## 🚀 Get Running in 10 Minutes

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Set Up Appwrite (5 min)

1. **Create Project:**
   - Go to https://cloud.appwrite.io
   - Create project "EduSync"
   - Copy Project ID

2. **Create Database:**
   - Name: `edusync-db`
   - Copy Database ID

3. **Create Collections:** (Use Quick Create)
   - users
   - assignments
   - quizzes
   - submissions
   - quiz_attempts
   - materials
   - badges

4. **Create Storage:**
   - Name: `edusync-files`
   - Copy Bucket ID

### Step 3: Environment Setup (1 min)
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your IDs from Step 2.

### Step 4: Run! (1 min)
```bash
npm run dev
```

Open http://localhost:3000

### Step 5: Test (1 min)

1. Click "Get Started"
2. Create a teacher account
3. Explore the dashboard!

---

## 🎯 What Works Right Now

✅ Landing page
✅ Signup/Login
✅ Teacher dashboard
✅ Student dashboard
✅ Offline detection
✅ Network status monitoring

---

## 🔨 What to Build Next

See `DEVELOPMENT_GUIDE.md` for:
- Quiz builder
- Material uploader
- Assignment creator
- Submission grader

**Estimated time to complete MVP: 8-10 hours**

---

## 📝 Demo Credentials

After setting up, create accounts:

**Teacher:**
- Email: teacher@demo.com
- Password: demo1234

**Student:**
- Email: student@demo.com  
- Password: demo1234

---

## 🆘 Having Issues?

### Appwrite connection error?
- Check all IDs in `.env.local`
- Verify project is active

### Build errors?
- Run `npm install` again
- Delete `node_modules` and reinstall

### Can't login?
- Check Appwrite Auth is enabled
- Verify email/password in database

---

## 📚 Full Documentation

- **Complete Guide:** `DEVELOPMENT_GUIDE.md`
- **Project Status:** `PROJECT_STATUS.md`
- **Build Summary:** `BUILD_SUMMARY.md`
- **README:** `README.md`

---

## 🎉 You're Ready!

Your project foundation is complete. Now build out the core features and win that hackathon! 🏆

**Good luck with Hacktoberfest 2025! 🚀**
