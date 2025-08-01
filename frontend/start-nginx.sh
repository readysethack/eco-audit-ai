#!/bin/sh

# Display environment information for debugging
echo "Starting nginx with configuration:"
echo "PORT: $PORT"
echo "VITE_API_URL: $VITE_API_URL"

# Ensure PORT is set
if [ -z "$PORT" ]; then
  echo "PORT environment variable not set, using default 3000"
  PORT=3000
fi

# Replace port placeholder in nginx configuration
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/conf.d/default.conf

# Validate configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx server..."
exec nginx -g 'daemon off;'
