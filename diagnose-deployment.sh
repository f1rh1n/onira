#!/bin/bash

echo "=========================================="
echo "ONIRA Deployment Diagnostic"
echo "=========================================="
echo ""

echo "1. Checking Docker containers..."
docker ps -a | grep onira

echo ""
echo "2. Checking if port 80 is in use..."
sudo lsof -i :80 || echo "Port 80 is not in use"

echo ""
echo "3. Checking recent container logs..."
docker logs onira-app --tail 50 2>&1 || echo "No logs available"

echo ""
echo "4. Checking Docker images..."
docker images | grep onira

echo ""
echo "5. Testing health endpoint locally..."
curl -v http://localhost/api/health 2>&1 || echo "Health endpoint not responding"

echo ""
echo "6. Checking system resources..."
echo "Memory:"
free -h
echo ""
echo "Disk:"
df -h

echo ""
echo "=========================================="
echo "Diagnostic Complete"
echo "=========================================="
