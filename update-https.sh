#!/bin/bash
# Update NEXTAUTH_URL to HTTPS

echo "Stopping Docker container..."
docker stop onira-app
docker rm onira-app

echo "Backing up current environment file..."
cp ~/bakery.env ~/bakery.env.backup

echo "Getting current NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(grep NEXTAUTH_SECRET ~/bakery.env | cut -d= -f2)

echo "Creating updated environment file..."
cat > ~/bakery.env << EOF
DATABASE_URL=postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_URL=https://onira.sbs
RESEND_API_KEY=re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
EOF

echo ""
echo "Updated environment file:"
cat ~/bakery.env
echo ""

echo "Starting Docker container with HTTPS..."
docker run -d \
  --name onira-app \
  -p 3000:3000 \
  --env-file ~/bakery.env \
  --restart unless-stopped \
  ghcr.io/f1rh1n/onira:latest

echo ""
echo "Waiting for container to start..."
sleep 10

echo ""
echo "Container status:"
docker ps | grep onira-app

echo ""
echo "Container logs (last 30 lines):"
docker logs onira-app --tail 30

echo ""
echo "========================================="
echo "Update Complete!"
echo "========================================="
echo "Your site is now running with HTTPS:"
echo "  https://onira.sbs"
echo "  https://www.onira.sbs"
