# Onira Deployment Guide

This guide covers deploying your Onira application to production on Vercel or other platforms.

## 📋 Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (or alternative hosting platform)
- PostgreSQL database (Vercel Postgres, Supabase, Railway, or PlanetScale)

---

## 🚀 Quick Deploy to Vercel

### Step 1: Set Up Database

#### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string

#### Option B: Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "Session mode" for serverless)

#### Option C: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project → Provision PostgreSQL
3. Copy the `DATABASE_URL` from the connection tab

### Step 2: Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy" (will fail first time - expected)

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add the following:

   ```env
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Redeploy**
   - Go to Deployments tab
   - Click the three dots on latest deployment
   - Click "Redeploy"

### Step 3: Initialize Database

After successful deployment:

1. **Option A: Use Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull
   npx prisma db push
   ```

2. **Option B: Use Database Provider Dashboard**
   - For Vercel Postgres: Use the query editor in Vercel dashboard
   - For Supabase: Use the SQL editor
   - Run the Prisma schema SQL manually

---

## 🔧 Detailed Configuration

### Environment Variables Explained

#### `DATABASE_URL` (REQUIRED)
Your PostgreSQL connection string. Format:
```
postgresql://username:password@host:5432/database?schema=public
```

**Important:** For serverless environments (Vercel), use connection pooling:
- Vercel Postgres: Already optimized
- Supabase: Use "Session mode" URL
- PlanetScale: Add `?sslaccept=strict`

#### `NEXTAUTH_SECRET` (REQUIRED)
Generate a secure random string:
```bash
openssl rand -base64 32
```
Or use: https://generate-secret.vercel.app/32

#### `NEXTAUTH_URL` (REQUIRED for production)
Your production domain:
```
https://your-domain.vercel.app
```
Or your custom domain if configured.

### Database Schema Management

The project is configured with Prisma. Two approaches:

#### Approach 1: Push Schema (Recommended for Vercel)
```bash
npx prisma db push
```
- ✅ Fast and simple
- ✅ Works with serverless
- ❌ No migration history

#### Approach 2: Migrations
```bash
npx prisma migrate deploy
```
- ✅ Version controlled migrations
- ✅ Better for teams
- ⚠️ Requires migration files in repo

---

## 🏗️ Build Process

Vercel automatically runs:
1. `npm install` (includes `postinstall` → `prisma generate`)
2. `npm run build`
3. Starts Next.js server

### Build Configuration

The `package.json` includes:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

This ensures Prisma Client is generated before build.

---

## 🌐 Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your custom domain
   - Redeploy

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `NEXTAUTH_SECRET` to a unique, secure value
- [ ] Ensure `DATABASE_URL` uses SSL (includes `?sslmode=require` or similar)
- [ ] Set up database backups
- [ ] Enable CORS if needed for API routes
- [ ] Review Prisma schema for proper indexes
- [ ] Test authentication flow completely
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)

---

## 📊 Monitoring & Maintenance

### Database Monitoring
- Vercel Postgres: Built-in monitoring in dashboard
- Supabase: Table Editor, SQL Editor, and Logs
- Railway: Metrics tab

### Application Monitoring
- Vercel Analytics: Enable in project settings
- Vercel Speed Insights: Automatically enabled
- Custom monitoring: Add Sentry, PostHog, etc.

### Regular Maintenance
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Regenerate Prisma Client after schema changes
npx prisma generate
```

---

## 🐛 Troubleshooting

### Build Fails with "Prisma Client not generated"
**Solution:** Ensure `postinstall` script is in `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Errors
**Check:**
- `DATABASE_URL` is correctly set in Vercel environment variables
- Database is accessible (not behind firewall)
- Connection string includes SSL parameters if required
- Prisma schema `provider` matches database type

### NextAuth Errors
**Check:**
- `NEXTAUTH_SECRET` is set and unique
- `NEXTAUTH_URL` matches your deployment URL
- Cookies are not blocked (check browser settings)

### "Module not found" Errors
**Solution:** Clear build cache and redeploy:
- In Vercel: Deployments → Options → Clear Build Cache
- Redeploy

---

## 🔄 Updating Your Deployment

### Regular Updates
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy on push to main branch.

### Database Schema Changes
1. Update `prisma/schema.prisma`
2. **Option A:** Push changes
   ```bash
   npx prisma db push
   ```
3. **Option B:** Create migration
   ```bash
   npx prisma migrate dev --name your_migration_name
   npx prisma migrate deploy  # In production
   ```
4. Commit and push changes

---

## 📱 Alternative Deployment Platforms

### Deploy to Railway

1. Create Railway account
2. New Project → Deploy from GitHub
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Deploy to Render

1. Create Render account
2. New Web Service → Connect repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add PostgreSQL database
6. Set environment variables

### Deploy to Fly.io

1. Install Fly CLI
2. `fly launch`
3. Create PostgreSQL cluster
4. Set secrets: `fly secrets set DATABASE_URL=...`
5. Deploy: `fly deploy`

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎯 Production Optimization Tips

1. **Enable Vercel Analytics** for insights
2. **Set up Error Tracking** (Sentry recommended)
3. **Configure Database Indexes** for frequently queried fields
4. **Implement Rate Limiting** on auth routes
5. **Add Caching** for static content (Vercel Edge Network)
6. **Monitor Database Performance** regularly
7. **Set up Automated Backups** for database
8. **Use Environment-specific configs** for development vs production

---

## ✅ Post-Deployment Checklist

- [ ] Application is accessible at production URL
- [ ] Authentication works (register, login, logout)
- [ ] Database operations work (create profile, add review, etc.)
- [ ] Environment variables are properly set
- [ ] Custom domain configured (if applicable)
- [ ] SSL/HTTPS is enabled
- [ ] Error monitoring is active
- [ ] Backups are configured
- [ ] Performance is acceptable (check Vercel Analytics)
- [ ] All features tested in production

---

For questions or issues, refer to the main [README.md](./README.md) or create an issue in the repository.
