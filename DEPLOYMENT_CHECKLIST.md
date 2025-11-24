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
```

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

3. Make sure all variables are set for **Production** environment

### Step 4: Redeploy Application

Option A: Automatic (Recommended)
- Push to main branch → Auto deploys

Option B: Manual
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment

### Step 5: Initialize Database Schema

**IMPORTANT**: After first successful deployment, run this to create tables:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull production environment variables
vercel env pull .env.production

# Initialize database with schema
npx prisma db push
```

Alternative if you have production DATABASE_URL:
```bash
# Set environment variable temporarily
# Windows PowerShell:
$env:DATABASE_URL="your-postgres-url-from-vercel"

# Then run:
npx prisma db push
```

---

## 🧪 Post-Deployment Testing

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

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **500 Internal Server Error** | Database not connected | Check `DATABASE_URL` is set in Vercel |
| **"Table does not exist"** | Database not initialized | Run `npx prisma db push` |
| **"Prisma Client not generated"** | Build failed | Check build logs, verify `postinstall` script exists |
| **"NEXTAUTH_SECRET must be provided"** | Missing env var | Add `NEXTAUTH_SECRET` in Vercel |
| **Dynamic route conflict** | Route naming mismatch | All routes use `[postId]` consistently ✅ |
| **Edge Runtime errors** | Wrong runtime used | Check API routes don't use Node-only features |

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
