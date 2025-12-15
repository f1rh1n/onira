#!/bin/bash
# EC2 Setup Script for Onira with Nginx and Domain

echo "========================================="
echo "Setting up Onira on EC2 with Nginx"
echo "========================================="

# Step 1: Stop current Docker container
echo "Step 1: Stopping current Docker container..."
docker stop onira-app 2>/dev/null || echo "Container not running"
docker rm onira-app 2>/dev/null || echo "Container not found"

# Step 2: Create environment file
echo "Step 2: Creating environment file..."
cat > ~/bakery.env << 'EOF'
DATABASE_URL=postgresql://49f7a4fab306ddf9c8d07660a04259c57b9396faefb70685a0dbacc7f4377be6:sk_gzrrSriysBxwAunIo1eyX@db.prisma.io:5432/postgres?sslmode=require
NEXTAUTH_URL=http://onira.in
RESEND_API_KEY=re_gJExdYm6_Cgh2JuxrsrwwoFrydYkBSRwG
EOF

# Generate NEXTAUTH_SECRET
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> ~/bakery.env

echo "Environment file created:"
cat ~/bakery.env
echo ""

# Step 3: Install Nginx
echo "Step 3: Installing Nginx..."
sudo dnf install nginx -y

# Step 4: Create Nginx configuration
echo "Step 4: Creating Nginx configuration..."
sudo tee /etc/nginx/conf.d/onira.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name onira.in www.onira.in 13.126.120.7;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Step 5: Test Nginx configuration
echo "Step 5: Testing Nginx configuration..."
sudo nginx -t

# Step 6: Enable and start Nginx
echo "Step 6: Starting Nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx --no-pager

# Step 7: Start Docker container on port 3000
echo "Step 7: Starting Docker container on port 3000..."
docker run -d \
  --name onira-app \
  -p 3000:3000 \
  --env-file ~/bakery.env \
  --restart unless-stopped \
  ghcr.io/f1rh1n/onira:latest

# Step 8: Wait for container to start
echo "Waiting for container to start..."
sleep 5

# Step 9: Verify setup
echo "========================================="
echo "Verification"
echo "========================================="
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -5
echo ""
echo "Docker container:"
docker ps | grep onira-app
echo ""
echo "Port 80 (Nginx):"
sudo lsof -i :80 | head -2
echo ""
echo "Port 3000 (Docker):"
sudo lsof -i :3000 | head -2
echo ""
echo "Testing localhost:"
curl -s http://localhost | head -20
echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Your site should now be accessible at:"
echo "  - http://13.126.120.7"
echo "  - http://onira.in (after DNS is configured)"
echo ""
echo "Next steps:"
echo "1. Configure DNS A record: onira.in -> 13.126.120.7"
echo "2. Install SSL certificate (run after DNS is configured):"
echo "   sudo dnf install certbot python3-certbot-nginx -y"
echo "   sudo certbot --nginx -d onira.in -d www.onira.in"
echo ""
