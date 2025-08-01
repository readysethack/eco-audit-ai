#!/bin/sh

# Exit on error
set -e

echo "Building frontend..."
echo "VITE_API_URL=$VITE_API_URL"

# Install dependencies
npm ci

# Build the app with the API URL environment variable
npm run build

echo "Frontend build completed successfully!"
