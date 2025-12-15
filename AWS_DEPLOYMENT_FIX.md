# AWS EC2 Deployment Fix Guide

## Problem
HTTP 500 error on login because NextAuth environment variables are not configured on AWS EC2.

## Solution Steps

### Step 1: SSH into your EC2 instance
```bash
ssh -i your-key.pem ubuntu@13.126.120.7
```

### Step 2: Navigate to your project directory
```bash
cd /path/to/your/bakery/app
# Common paths:
# - /home/ubuntu/bakery
# - /var/www/bakery
# - ~/bakery
```

### Step 3: Create or edit .env.production file
```bash
nano .env.production
```

### Step 4: Add these environment variables
```env
# Database
DATABASE_URL="postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require"

# NextAuth - CRITICAL FOR LOGIN
NEXTAUTH_URL="http://13.126.120.7"
NEXTAUTH_SECRET="your-production-secret-key-change-this-to-something-secure"

# Resend (Email Service)
RESEND_API_KEY="re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG"
```

### Step 5: Generate a secure NEXTAUTH_SECRET
Run this command on your EC2 instance:
```bash
openssl rand -base64 32
```
Copy the output and replace `your-production-secret-key-change-this-to-something-secure` with it.

### Step 6: Rebuild the Next.js application
```bash
# Install dependencies if needed
npm install

# Build the application
npm run build
```

### Step 7: Restart your application
If using PM2:
```bash
pm2 restart all
# or
pm2 restart bakery
```

If using systemd:
```bash
sudo systemctl restart bakery
```

If running directly:
```bash
# Kill the current process
pkill -f "node"

# Start again
npm run start
```

### Step 8: Verify the fix
1. Open browser: http://13.126.120.7
2. Try to login
3. Should work without HTTP 500 error

## Alternative: Use HTTPS with Domain Name (Recommended)

If you have a domain name, it's better to:

1. Point your domain to EC2 IP (e.g., `app.yourdomain.com` -> `13.126.120.7`)
2. Install SSL certificate with Let's Encrypt:
```bash
sudo certbot --nginx -d app.yourdomain.com
```
3. Update NEXTAUTH_URL:
```env
NEXTAUTH_URL="https://app.yourdomain.com"
```

## Troubleshooting

### Check if .env.production is being read:
```bash
# Add this to your start script temporarily
cat .env.production
```

### Check PM2 logs:
```bash
pm2 logs
pm2 logs bakery --lines 100
```

### Check system logs:
```bash
sudo journalctl -u bakery -n 100
```

### Test NextAuth directly:
```bash
curl http://13.126.120.7/api/auth/providers
```
Should return JSON, not an error.

## Security Notes

1. **Never commit .env.production to Git**
   - Add it to .gitignore (should already be there)

2. **Use strong NEXTAUTH_SECRET**
   - Minimum 32 characters
   - Use the openssl command provided above

3. **Consider using AWS Secrets Manager**
   - For production, store secrets in AWS Secrets Manager
   - Reference them in your deployment script

4. **Enable HTTPS**
   - Use a domain name + SSL certificate
   - Never use HTTP for production authentication

## Quick Command Reference

```bash
# Check if app is running
pm2 list

# View live logs
pm2 logs bakery --lines 0

# Restart app
pm2 restart bakery

# Check environment variables
pm2 env bakery

# View .env.production
cat .env.production
```
