#!/bin/sh

# Health check script for frontend container
# This will be used by Render's health check system

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
  echo "Nginx is not running"
  exit 1
fi

# Check if we can access our own frontend
if ! curl -s http://localhost:$PORT/ > /dev/null; then
  echo "Cannot access frontend"
  exit 1
fi

# Try to reach backend health endpoint
if ! curl -s --max-time 5 https://eco-audit-ai-backend.onrender.com/health > /dev/null; then
  echo "Warning: Backend health check failed - may be spinning up"
  # Don't exit with error here, as the frontend can still serve static content
fi

# All checks passed
echo "Frontend service healthy"
exit 0
