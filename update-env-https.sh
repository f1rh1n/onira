#!/bin/bash
# Update NEXTAUTH_URL to HTTPS

echo "========================================="
echo "Updating Environment for HTTPS"
echo "========================================="

# Stop current container
echo "Stopping Docker container..."
docker stop onira-app
docker rm onira-app

# Update environment file with HTTPS
echo "Updating environment file..."
cat > ~/bakery.env << 'EOF'
DATABASE_URL=postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_URL=https://onira.sbs
RESEND_API_KEY=re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG
EOF

# Re-add the existing NEXTAUTH_SECRET
echo "NEXTAUTH_SECRET=$(grep NEXTAUTH_SECRET ~/bakery.env | cut -d= -f2)" >> ~/bakery.env

echo ""
echo "Updated environment file:"
cat ~/bakery.env
echo ""

# Restart Docker container
echo "Starting Docker container..."
docker run -d \
  --name onira-app \
  -p 3000:3000 \
  --env-file ~/bakery.env \
  --restart unless-stopped \
  ghcr.io/f1rh1n/onira:latest

echo ""
echo "Waiting for container to start..."
sleep 5

echo ""
echo "========================================="
echo "Verification"
echo "========================================="
echo ""
echo "Docker container:"
docker ps | grep onira-app
echo ""
echo "Container logs:"
docker logs onira-app | tail -20
echo ""
echo "========================================="
echo "Update Complete!"
echo "========================================="
echo ""
echo "Your site is now secured with HTTPS:"
echo "  - https://onira.sbs"
echo "  - https://www.onira.sbs"
echo ""
echo "The HTTP version will automatically redirect to HTTPS."
echo ""
