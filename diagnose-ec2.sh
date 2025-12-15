#!/bin/bash
# Diagnose EC2 deployment issues

echo "========================================="
echo "EC2 Deployment Diagnostics"
echo "========================================="
echo ""

echo "1. Docker Container Status:"
docker ps -a | grep onira-app
echo ""

echo "2. Docker Container Logs (last 50 lines):"
docker logs onira-app --tail 50
echo ""

echo "3. Nginx Configuration:"
cat /etc/nginx/conf.d/onira.conf
echo ""

echo "4. Nginx Status:"
sudo systemctl status nginx --no-pager | head -10
echo ""

echo "5. Nginx Error Log (last 20 lines):"
sudo tail -20 /var/log/nginx/error.log
echo ""

echo "6. Test localhost:3000 (Docker app):"
curl -I http://localhost:3000
echo ""

echo "7. Test localhost:80 (Nginx):"
curl -I http://localhost:80
echo ""

echo "8. Environment Variables in Container:"
docker exec onira-app env | grep -E "NEXTAUTH|DATABASE"
echo ""

echo "9. Port Bindings:"
sudo netstat -tulpn | grep -E ":80|:3000|:443"
echo ""

echo "10. Check if app is responding:"
curl -s http://localhost:3000 | head -50
echo ""

echo "========================================="
echo "Diagnostics Complete"
echo "========================================="
