# 🛠️ EduSync - Command Reference

Quick reference for all commands you'll need during development.

---

## 📦 Package Management

### Install Dependencies
```bash
npm install
```

### Add New Package
```bash
npm install <package-name>
```

### Remove Package
```bash
npm uninstall <package-name>
```

### Update Packages
```bash
npm update
```

### Check Outdated
```bash
npm outdated
```

---

## 🚀 Development

### Start Dev Server
```bash
npm run dev
```
Runs on http://localhost:3000 with hot reload

### Build for Production
```bash
npm run build
```
Creates optimized production build in `.next/`

### Start Production Server
```bash
npm start
```
Runs the production build (must build first)

### Run Linter
```bash
npm run lint
```
Checks code for errors and style issues

### Fix Lint Issues
```bash
npm run lint -- --fix
```

---

## 🔧 TypeScript

### Type Check
```bash
npx tsc --noEmit
```
Check for TypeScript errors without building

### Generate Types
```bash
npx tsc --declaration --emitDeclarationOnly
```

---

## 🗄️ Database (Appwrite)

### Seed Demo Data
```bash
# First, install node-appwrite
npm install --save-dev node-appwrite

# Add APPWRITE_API_KEY to .env.local
# Then run:
node scripts/seed-demo-data.js
```

### Create Collection (via Appwrite CLI)
```bash
appwrite databases createCollection \
  --databaseId [DATABASE_ID] \
  --collectionId [COLLECTION_ID] \
  --name [NAME]
```

---

## 🧹 Clean Up

### Remove node_modules
```bash
# Windows
rmdir /s /q node_modules

# macOS/Linux
rm -rf node_modules
```

### Clear Next.js Cache
```bash
# Windows
rmdir /s /q .next

# macOS/Linux
rm -rf .next
```

### Clean Install
```bash
# Windows
rmdir /s /q node_modules .next
npm install

# macOS/Linux
rm -rf node_modules .next
npm install
```

---

## 🔍 Debugging

### Check Build Errors
```bash
npm run build 2>&1 | findstr "error"
```

### Verbose Logging
```bash
# Set environment variable
set DEBUG=*
npm run dev
```

### Type Check Specific File
```bash
npx tsc --noEmit [file-path]
```

---

## 📱 Testing

### Test Responsive Design
```bash
# Run dev server
npm run dev

# Then open these URLs:
# Mobile: http://localhost:3000?viewport=mobile
# Tablet: http://localhost:3000?viewport=tablet
# Desktop: http://localhost:3000?viewport=desktop
```

### Test Offline Mode
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Change throttling to "Offline"
4. Navigate the app

---

## 🚢 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```

### Preview Deployment
```bash
vercel
```

### Production Deployment
```bash
vercel --prod
```

---

## 📊 Analysis

### Bundle Size Analysis
```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer

# Run build with analyzer
ANALYZE=true npm run build
```

### Check Package Size
```bash
npm install --save-dev bundlephobia

npx bundlephobia [package-name]
```

---

## 🔐 Environment Variables

### Copy Template
```bash
cp .env.local.example .env.local
```

### View Variables (Development)
```bash
# Windows
type .env.local

# macOS/Linux
cat .env.local
```

### Verify Variables Loaded
Add to any page:
```typescript
console.log(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
```

---

## 🎨 UI Components

### Add ShadCN Component
```bash
npx shadcn@latest add [component-name]

# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add toast
```

### List Available Components
```bash
npx shadcn@latest
```

---

## 📝 Git Commands

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: EduSync MVP"
```

### Create Feature Branch
```bash
git checkout -b feature/quiz-builder
```

### Commit Changes
```bash
git add .
git commit -m "feat: add quiz builder component"
```

### Push to GitHub
```bash
git remote add origin [your-repo-url]
git push -u origin main
```

### Create Release Tag
```bash
git tag -a v1.0.0 -m "EduSync v1.0.0 - Hackathon Submission"
git push --tags
```

---

## 🧪 Quality Checks

### Run All Checks
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

### Pre-commit Checklist
```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Format (if using Prettier)
npx prettier --write .

# 4. Test build
npm run build

# 5. Commit
git commit -m "your message"
```

---

## 📦 Useful Scripts to Add

Add these to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install",
    "seed": "node scripts/seed-demo-data.js"
  }
}
```

---

## 🔧 Troubleshooting Commands

### Fix Package Lock Issues
```bash
rm package-lock.json
rm -rf node_modules
npm install
```

### Clear All Caches
```bash
# Windows
rmdir /s /q .next node_modules
npm cache clean --force
npm install

# macOS/Linux
rm -rf .next node_modules
npm cache clean --force
npm install
```

### Reset Git (Careful!)
```bash
# Remove git history
rm -rf .git

# Start fresh
git init
git add .
git commit -m "Initial commit"
```

---

## 📚 Quick Tips

### Open in VS Code
```bash
code .
```

### Find Large Files
```bash
# Windows
dir /s /o-s

# macOS/Linux
du -ah . | sort -rh | head -20
```

### Count Lines of Code
```bash
# Windows (PowerShell)
(Get-ChildItem -Recurse -Include *.ts,*.tsx | Measure-Object -Property Length -Sum).Count

# macOS/Linux
find . -name '*.ts' -o -name '*.tsx' | xargs wc -l
```

---

## 🎯 Common Workflows

### Starting Work
```bash
git pull origin main
npm install
npm run dev
```

### Before Committing
```bash
npm run lint
npx tsc --noEmit
git add .
git commit -m "your message"
git push
```

### Deploying
```bash
npm run build
npm run start  # Test locally
vercel --prod  # Deploy
```

---

## 🆘 Emergency Commands

### Server Won't Start
```bash
# Kill port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Kill port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Out of Memory
```bash
# Increase Node memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

### Corrupted Cache
```bash
rm -rf .next node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 🎉 You're All Set!

Bookmark this file for quick reference during development!

**Happy Coding! 🚀**
