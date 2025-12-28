#!/bin/bash

echo "=========================================="
echo "Docker Cleanup Script for EC2"
echo "=========================================="
echo ""

echo "Current disk usage:"
df -h
echo ""

echo "Docker disk usage:"
docker system df
echo ""

echo "Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "No running containers"
echo ""

echo "Removing stopped containers..."
docker container prune -f
echo ""

echo "Removing unused images..."
docker image prune -a -f
echo ""

echo "Removing unused volumes..."
docker volume prune -f
echo ""

echo "Removing build cache..."
docker builder prune -a -f
echo ""

echo "Final disk usage:"
df -h
echo ""

echo "Docker disk usage after cleanup:"
docker system df
echo ""

echo "=========================================="
echo "Cleanup Complete!"
echo "=========================================="
