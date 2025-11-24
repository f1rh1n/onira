# Vercel Deployment Setup Guide

## 🚨 Current Issue: 500 Error on Production

Your application is getting 500 errors because the database isn't set up on Vercel.

---

## ✅ Quick Fix: Set Up Vercel Postgres (5 minutes)

### Step 1: Create Postgres Database on Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your **onira** project
3. Click on the **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Choose a name (e.g., "onira-db")
7. Select region (choose closest to your users)
8. Click **Create**

✅ Vercel will automatically add `DATABASE_URL` to your environment variables!

### Step 2: Add Required Environment Variables

Still in your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Verify `DATABASE_URL` is there (added automatically by Postgres)
3. Add these additional variables:

**NEXTAUTH_SECRET**
```
Value: Generate by running this in your terminal:
openssl rand -base64 32

Or use: https://generate-secret.vercel.app/32
```

**NEXTAUTH_URL**
```
Value: https://onira.vercel.app
(or your custom domain if you have one)
```

4. Make sure all variables are set for **Production** environment
5. Click **Save**

### Step 3: Redeploy Your Application

1. Go to **Deployments** tab
2. Find your latest deployment (the one that failed)
3. Click the **...** menu
4. Click **Redeploy**
5. Wait for deployment to complete (~2-3 minutes)

✅ Your build should now succeed!

### Step 4: Initialize Database (Create Tables)

Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables (including DATABASE_URL)
vercel env pull .env.production

# Initialize database with your schema
npx prisma db push
```

Option B: Manual Connection

```bash
# Copy your DATABASE_URL from Vercel dashboard
# Add it to a temporary .env file or export it:

# Windows PowerShell
$env:DATABASE_URL="your-postgres-url-from-vercel"

# Windows CMD
set DATABASE_URL=your-postgres-url-from-vercel

# Mac/Linux
export DATABASE_URL="your-postgres-url-from-vercel"

# Then run:
npx prisma db push
```

### Step 5: Test Your Application

1. Go to https://onira.vercel.app
2. Try to register a new user
3. Should work without 500 errors! ✅

---

## 🔍 Troubleshooting

### Still getting 500 errors?

**Check Vercel Logs:**
1. Go to your Vercel project
2. Click **Deployments**
3. Click on your latest deployment
4. Click **Logs** tab
5. Look for error messages

Common issues:
- `DATABASE_URL` not set → Check Environment Variables
- "Prisma Client not generated" → Build should auto-generate (postinstall script)
- "Cannot connect to database" → Check DATABASE_URL is correct

### Database not initialized?

If you see errors like "Table 'User' does not exist":

```bash
# Make sure you ran:
npx prisma db push

# Or try:
npx prisma migrate deploy
```

### Environment variables not working?

After adding/changing environment variables:
- Always **redeploy** your application
- Variables are only available after redeployment

---

## 📊 Verify Everything Works

Test these features:
- [ ] Registration (`/register`)
- [ ] Login (`/login`)
- [ ] Create profile (`/profile/setup`)
- [ ] Add review (visit your public profile)
- [ ] View dashboard (`/dashboard`)

---

## 🛠️ Local Development Setup

Your local setup is already working with SQLite. To keep developing locally:

### Option 1: Keep SQLite for Local Development (Recommended)

1. **Create/edit your local `.env` file:**
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-local-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **When working locally, change `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "sqlite"  // ← Change to sqlite
     url      = env("DATABASE_URL")
   }
   ```

3. **Before deploying, change it back:**
   ```prisma
   datasource db {
     provider = "postgresql"  // ← Change back to postgresql
     url      = env("DATABASE_URL")
   }
   ```

### Option 2: Use PostgreSQL Locally Too

1. Use the same Vercel Postgres for development:
   ```bash
   vercel env pull .env.local
   ```

2. Keep `prisma/schema.prisma` as `postgresql`

3. All environments use PostgreSQL (more consistent)

---

## 📝 Environment Variables Reference

### Production (Vercel)
```env
DATABASE_URL=postgresql://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb
NEXTAUTH_SECRET=your-production-secret-32-chars
NEXTAUTH_URL=https://onira.vercel.app
```

### Development (Local)
```env
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=your-local-dev-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🎉 Success Checklist

Once everything is working:

- [x] ✅ Vercel Postgres database created
- [x] ✅ Environment variables set on Vercel
- [x] ✅ Application redeployed successfully
- [x] ✅ Database initialized with `prisma db push`
- [x] ✅ No more 500 errors on production
- [x] ✅ User registration works
- [x] ✅ Login works
- [x] ✅ All features functional

---

## 🆘 Need Help?

If you're still experiencing issues:

1. **Check Vercel Logs** (most important!)
2. **Verify environment variables** are set correctly
3. **Confirm database is initialized** (tables created)
4. **Check you redeployed** after adding variables

**Common Error Messages:**

| Error | Solution |
|-------|----------|
| "Can't reach database server" | Check DATABASE_URL is correct |
| "Table does not exist" | Run `npx prisma db push` |
| "NEXTAUTH_SECRET must be provided" | Add NEXTAUTH_SECRET to Vercel |
| "Invalid connection string" | Verify DATABASE_URL format |

---

## 📚 Additional Resources

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Deployment](https://next-auth.js.org/deployment)

---

**Last Updated:** 2025-11-23
**Your Project:** https://onira.vercel.app
