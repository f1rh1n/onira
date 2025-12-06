#!/bin/bash

# Fix EC2 Deployment Script
# This script will stop the current container and restart with correct environment variables

echo "🔧 Fixing Onira deployment on EC2..."

# Stop and remove existing container
echo "Stopping existing container..."
docker stop onira-app 2>/dev/null || true
docker rm onira-app 2>/dev/null || true

# Generate a new NEXTAUTH_SECRET if needed
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Generated NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "EC2 Public IP: $PUBLIC_IP"

# Run the container with correct environment variables
echo "Starting container with correct configuration..."
docker run -d \
  --name onira-app \
  --restart unless-stopped \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e NEXTAUTH_URL="http://$PUBLIC_IP" \
  -e RESEND_API_KEY="re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG" \
  onira:latest

# Wait a few seconds for container to start
echo "Waiting for container to start..."
sleep 5

# Check container status
echo ""
echo "Container status:"
docker ps | grep onira-app

# Test health endpoint
echo ""
echo "Testing health endpoint..."
sleep 3
curl http://localhost/api/health

echo ""
echo "✅ Deployment fixed! Your app should now be accessible at http://$PUBLIC_IP"
echo ""
echo "To check logs: docker logs onira-app -f"
echo "To restart: docker restart onira-app"
