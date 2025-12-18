#!/bin/bash

echo "=========================================="
echo "ONIRA Deployment Fix Script"
echo "=========================================="
echo ""

# Get public IP
PUBLIC_IP=$(curl -4 -s ifconfig.me)
echo "Your EC2 Public IP: $PUBLIC_IP"
echo ""

# Environment variables from your .env file
DATABASE_URL="postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://$PUBLIC_IP"
RESEND_API_KEY="re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG"

echo "Configuration:"
echo "- NEXTAUTH_URL: $NEXTAUTH_URL"
echo "- DATABASE_URL: ${DATABASE_URL:0:50}... (truncated)"
echo "- RESEND_API_KEY: ${RESEND_API_KEY:0:20}... (truncated)"
echo ""

# Stop and remove old container
echo "Stopping old container..."
docker stop onira-app 2>/dev/null || true
docker rm onira-app 2>/dev/null || true

# Wait for port to be released
echo "Waiting for port 80 to be released..."
sleep 3

# Kill any remaining process on port 80
sudo fuser -k 80/tcp 2>/dev/null || true
sleep 2

# Start new container with proper environment variables
echo "Starting new container..."
docker run -d \
  --name onira-app \
  --restart unless-stopped \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e NEXTAUTH_URL="$NEXTAUTH_URL" \
  -e RESEND_API_KEY="$RESEND_API_KEY" \
  ghcr.io/f1rh1n/onira:latest

# Wait for container to start
echo "Waiting for container to start..."
sleep 10

# Check container status
echo ""
echo "Container status:"
docker ps | grep onira-app

# Check logs for errors
echo ""
echo "Recent container logs:"
docker logs onira-app --tail 20

# Test health endpoint
echo ""
echo "Testing health endpoint..."
sleep 5
HEALTH_RESPONSE=$(curl -s http://localhost/api/health)
echo "Health check response: $HEALTH_RESPONSE"

# Test if NEXTAUTH_URL error is gone
echo ""
echo "Checking for NEXTAUTH_URL errors..."
if docker logs onira-app --tail 50 | grep -q "Invalid URL"; then
  echo "WARNING: Still seeing Invalid URL errors!"
  docker logs onira-app --tail 50 | grep "Invalid URL"
else
  echo "SUCCESS: No Invalid URL errors detected!"
fi

echo ""
echo "=========================================="
echo "Deployment Fix Complete!"
echo "=========================================="
echo ""
echo "Your app should be accessible at: http://$PUBLIC_IP"
echo ""
echo "Next steps:"
echo "1. Test login at: http://$PUBLIC_IP/login"
echo "2. Test signup at: http://$PUBLIC_IP"
echo ""
echo "If working correctly, update GitHub secrets with:"
echo "- NEXTAUTH_URL=http://$PUBLIC_IP"
echo "- NEXTAUTH_SECRET=your-secret-key-change-this-in-production"
echo "- RESEND_API_KEY=re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG"
echo ""
