# Appwrite Permissions Setup Guide

## ⚠️ Important: Configure Collection Permissions

The authorization error you're seeing happens because Appwrite collections need proper permissions. Follow these steps:

## Quick Fix (For Testing)

### Option 1: Set "Any" Role Permissions (Easiest for Development)

1. Go to **Appwrite Console** → Your Project → **Databases** → `edusync-db`
2. For **each collection** (users, assignments, quizzes, submissions, quiz_attempts, materials, badges):
   - Click on the collection name
   - Go to **Settings** tab
   - Scroll to **Permissions** section
   - Click **Add Role**
   - Select **Any**
   - Check these permissions:
     - ✅ **Read**
     - ✅ **Create**
     - ✅ **Update**
     - ✅ **Delete**
   - Click **Add**

### Option 2: Set User-Based Permissions (More Secure)

For each collection, set these permissions:

#### **users** Collection:
- Role: **Any**
  - ✅ Read
  - ✅ Create

- Role: **Users** (authenticated users)
  - ✅ Read
  - ✅ Update

#### **assignments** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update
  - ✅ Delete

#### **quizzes** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update
  - ✅ Delete

#### **submissions** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update

#### **quiz_attempts** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update

#### **materials** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update
  - ✅ Delete

#### **badges** Collection:
- Role: **Any**
  - ✅ Read

- Role: **Users**
  - ✅ Create
  - ✅ Update

## Storage Bucket Permissions

1. Go to **Storage** → `edusync-files`
2. Click **Settings**
3. Under **Permissions**, add:
   - Role: **Any** → Read
   - Role: **Users** → Create, Read, Update, Delete

## Test Your Setup

After setting permissions:

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Try creating a new account** at `http://localhost:3000/signup`

3. **You should now be able to**:
   - Sign up and log in successfully
   - Access teacher/student dashboards
   - Create quizzes, assignments, and materials
   - Upload files
   - Take quizzes

## Troubleshooting

### Still getting permission errors?

1. **Check browser console** for specific error messages
2. **Verify collection IDs** in `.env.local` match your Appwrite Console
3. **Clear browser cache** and reload
4. **Check Appwrite logs** in the Console under Activity

### Can't create documents?

- Make sure you're logged in (check top-right corner)
- Verify the collection has **Create** permission for **Users** role
- Check that attributes match the schema (required fields filled)

## Security Notes

⚠️ **For Production**: 
- Remove **Any** role permissions
- Use **User** and **Team** roles with specific permissions
- Implement role-based access control (RBAC)
- Add validation rules in Appwrite Functions

✅ **For Development**: 
- Using **Any** role is fine for testing
- Makes debugging easier
- Can always restrict later

## Next Steps

Once permissions are set:
1. ✅ Create a teacher account
2. ✅ Create materials, quizzes, and assignments
3. ✅ Create a student account
4. ✅ Test taking quizzes and viewing materials
5. ✅ Test offline functionality (disable network in DevTools)

---

**Need Help?** Check the Appwrite Documentation: https://appwrite.io/docs/permissions
