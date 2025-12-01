# 🚀 Production Deployment Checklist for Onira

## ✅ Pre-Deployment Checklist

### 1. Database Configuration
- [x] **Prisma schema updated to PostgreSQL** (`prisma/schema.prisma` line 9)
- [x] **All models properly defined** with relations and cascading deletes
- [x] **New models added**: PostLike, PostComment
- [x] **Removed fields**: `views` field from Post model

### 2. Environment Variables Required on Vercel

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://...  (Auto-added by Vercel Postgres)
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://your-domain.vercel.app
RESEND_API_KEY=re_...  (Required for password reset emails)
```

**Note:** RESEND_API_KEY is REQUIRED for the build to succeed. Get your API key from [resend.com](https://resend.com)

### 3. Code Quality Checks
- [x] **No hardcoded localhost URLs** (all use `process.env.NEXTAUTH_URL`)
- [x] **No development-only code** in production
- [x] **All API routes use consistent naming** (`[postId]` throughout)
- [x] **No conflicting dynamic routes**
- [x] **All imports are valid**

### 4. Files to Ignore (Already in .gitignore)
- [x] `.env` files
- [x] `.env.production`
- [x] Database files (`*.db`, `*.db-journal`)
- [x] Build artifacts (`.next/`)
- [x] Temporary files

---

## 📋 Deployment Steps

### Step 1: Push Code to Git
```bash
git add .
git commit -m "Add post likes and comments feature, remove profile views"
git push origin main
```

### Step 2: Set Up Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it (e.g., "onira-db")
5. Click **Create**

✅ This automatically adds `DATABASE_URL` to environment variables

### Step 3: Add Other Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**:

1. **NEXTAUTH_SECRET**
   ```bash
   # Generate on your local machine:
   openssl rand -base64 32

   # Or use: https://generate-secret.vercel.app/32
   ```

2. **NEXTAUTH_URL**
   ```
   https://onira.vercel.app  (or your custom domain)
   ```

3. **RESEND_API_KEY** (⚠️ REQUIRED - Build will fail without this)
   ```
   re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG  (your existing key from .env file)
   ```

   **Note:** This is required for password reset email functionality. Without it, the build will fail with:
   ```
   Error: RESEND_API_KEY is not defined in environment variables
   ```

4. Make sure all variables are set for **Production** environment

### Step 4: Redeploy Application

Option A: Automatic (Recommended)
- Push to main branch → Auto deploys

Option B: Manual
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment

### Step 5: Initialize Database Schema (⚠️ CRITICAL - REQUIRED FOR APP TO WORK)

**THIS STEP IS MANDATORY!** Without it, post likes, comments, reviews, and other features will not work in production.

#### Quick Steps:

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link to your project
vercel link

# 4. Pull production environment variables
vercel env pull .env.production

# 5. Push database schema to production (CREATES ALL TABLES)
npx prisma db push

# 6. Verify database setup (RECOMMENDED)
node scripts/verify-production.js
```

#### What This Does:

This creates all required tables in your PostgreSQL database:
- ✅ User, Profile
- ✅ Post, **PostLike**, **PostComment** (required for likes/comments to work)
- ✅ Review
- ✅ PasswordReset

#### Alternative Method (If you have DATABASE_URL):

```bash
# Windows PowerShell:
$env:DATABASE_URL="your-postgres-url-from-vercel"
npx prisma db push

# Mac/Linux:
DATABASE_URL="your-postgres-url-from-vercel" npx prisma db push
```

---

## 🧪 Post-Deployment Testing & Verification

### Step 1: Verify Database Setup (CRITICAL)

Run the automated verification script:

```bash
node scripts/verify-production.js
```

This checks:
- ✅ Database connection works
- ✅ All tables exist (User, Profile, Post, PostLike, PostComment, Review, PasswordReset)
- ✅ Tables are accessible

**Expected Output:**
```
🔍 Verifying Production Database Setup
==================================================
📡 Checking database connection...
✅ Database connected successfully
💜 Checking PostLike table...
✅ PostLike table exists (0 likes)
...
🎉 ALL CHECKS PASSED!
```

### Step 2: Test in Production Browser

### Critical Features to Test

1. **Authentication**
   - [ ] User registration works
   - [ ] Login works
   - [ ] Session persists

2. **Profile Management**
   - [ ] Create profile
   - [ ] Edit profile
   - [ ] Profile is published
   - [ ] Public profile page loads

3. **Reviews**
   - [ ] Anonymous users can submit reviews
   - [ ] Reviews are saved to database
   - [ ] Profile owner can publish/unpublish reviews
   - [ ] Instagram share image generates correctly

4. **Posts (NEW FEATURES)**
   - [ ] Create new post
   - [ ] Post displays on public profile
   - [ ] Anonymous users can like posts
   - [ ] Like count updates in real-time
   - [ ] Anonymous users can comment
   - [ ] Comments display correctly
   - [ ] Profile owner can delete comments

5. **Dashboard**
   - [ ] Statistics display correctly (no "Profile Views")
   - [ ] Only shows: Total Reviews, Average Rating, Total Posts
   - [ ] Reviews chart displays
   - [ ] Navigation works

---

## 🔍 Troubleshooting Production Issues

### 🚨 Post Likes Not Working? (MOST COMMON ISSUE)

**Symptoms:**
- ✅ Likes work in development
- ❌ Can't like posts in production
- ❌ Like count shows 0 or doesn't display
- ❌ Browser console may show fetch errors

**Root Cause:** PostLike table doesn't exist in production database

**Solution:**
```bash
# 1. Pull production environment
vercel env pull .env.production

# 2. Push database schema (CRITICAL)
npx prisma db push

# 3. Verify tables were created
node scripts/verify-production.js

# 4. Redeploy to ensure latest code is live
vercel --prod
```

**After fixing, test:**
1. Open production site in browser
2. Navigate to a profile with posts
3. Click like button (heart icon)
4. Like count should increase
5. Refresh page - like should persist

**If still not working:**
- Check browser console (F12) for errors
- Check Vercel logs for API errors
- Ensure you're testing with the latest deployment

### localStorage Warnings (NORMAL - NOT AN ERROR)

**You might see in console:**
```
⚠️ localStorage unavailable, using sessionStorage fallback
```

**This is NORMAL and expected** for:
- Safari private browsing
- Browsers with strict security settings
- Some mobile browsers

**What happens:**
- App automatically falls back to sessionStorage
- If that's blocked, uses memory-only storage
- Likes still work, may not persist across browser restarts

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **"RESEND_API_KEY is not defined"** | Missing env var | Add `RESEND_API_KEY` in Vercel Settings → Env Variables |
| **Build fails at "Collecting page data"** | Missing RESEND_API_KEY | Add the API key, then redeploy |
| **500 Internal Server Error** | Database not connected | Check `DATABASE_URL` is set in Vercel |
| **"Table does not exist"** | Database not initialized | Run `npx prisma db push` |
| **"Prisma Client not generated"** | Build failed | Check build logs, verify `postinstall` script exists |
| **"NEXTAUTH_SECRET must be provided"** | Missing env var | Add `NEXTAUTH_SECRET` in Vercel |
| **Dynamic route conflict** | Route naming mismatch | All routes use `[postId]` consistently ✅ |
| **Edge Runtime errors** | Wrong runtime used | Check API routes don't use Node-only features |
| **Post likes not working** | PostLike table missing | Run `npx prisma db push`, then verify |

### Check Vercel Logs

1. Go to Vercel Dashboard → **Deployments**
2. Click on latest deployment
3. Click **Logs** tab
4. Look for error messages

### Verify Environment Variables

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Ensure all 3 variables are set for **Production**
3. If you change variables, **REDEPLOY** the application

---

## 📊 Database Schema Changes (Latest)

### New Tables Added:
- **PostLike**: Tracks anonymous likes on posts
  - Unique constraint: `[postId, anonymousId]`
  - Cascade delete when post is deleted

- **PostComment**: Stores anonymous comments on posts
  - Links to post with cascade delete
  - Stores commenter name and avatar

### Removed Fields:
- **Post.views**: No longer tracking view counts

### Migration Command:
```bash
npx prisma db push
```

This will:
- Create new tables (PostLike, PostComment)
- Remove views column from Post table
- Preserve all existing data

---

## 🎯 Feature Summary (What's New)

### Posts Feature Enhancement
1. **Anonymous Likes**
   - Users can like posts without logging in
   - Like state tracked via localStorage
   - One like per user per post

2. **Anonymous Comments**
   - Choose custom name and avatar
   - No account required
   - Profile owner can delete inappropriate comments

3. **Twitter/X-Style UI**
   - Modern post cards
   - Profile avatar display
   - Engagement metrics visible

### Removed Features
- Profile view counter (simplified metrics)

---

## ✅ Final Pre-Push Checklist

Before running `git push`:

- [x] **Database provider** changed to `postgresql`
- [x] **All new API routes** tested locally
- [x] **Environment variables** documented
- [x] **No console.logs** with sensitive data
- [x] **Gitignore** updated for env files
- [x] **Package.json** has `postinstall` script
- [x] **Build succeeds** locally (`npm run build`)
- [x] **No TypeScript errors** (`npm run lint`)

## 🚀 Deploy Command

When ready:

```bash
git add .
git commit -m "Production-ready: Add likes/comments, remove views, PostgreSQL ready"
git push origin main
```

Then follow deployment steps above!

---

## 📞 Need Help?

1. **Check Vercel Logs** first (most common solution)
2. **Verify all env vars** are set correctly
3. **Confirm database initialized** (tables exist)
4. **Check you redeployed** after changing variables

Last updated: 2025-11-24
