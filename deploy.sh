#!/bin/bash

# Hpeerage Deployment Helper Script
echo "=========================================="
echo "🚀 Hpeerage Deployment Started..."
echo "=========================================="

# 1. Install Dependencies
echo "📦 Installing production dependencies..."
npm install --production

# 2. Check if PM2 is installed
if ! command -v pm2 &> /dev/null
then
    echo "⚠️  PM2 not found. Installing PM2 globally..."
    npm install pm2 -g
fi

# 3. Create log directory
mkdir -p logs

# 4. Start/Reload with PM2
echo "⚙️  Restarting server with PM2..."
pm2 delete hpeerage-web 2>/dev/null
pm2 start ecosystem.config.js --env production

# 5. Save PM2 list
pm2 save

# 6. Success Output
echo "✅ Deployment Successful!"
pm2 status
echo "=========================================="
echo "🏥 Health check: curl http://localhost:3000/health"
