#!/bin/bash

echo "=========================================="
echo "   🚀 Vercel Deployment Script"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "1️⃣  Deploying Frontend to Vercel..."
echo ""

cd frontend

# Check if already logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy
vercel

echo ""
echo "✅ Frontend deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "   1. Set environment variable VITE_API_BASE in Vercel dashboard"
echo "   2. Deploy backend to Render/Railway (see VERCEL_DEPLOYMENT.md)"
echo "   3. Update VITE_API_BASE with your backend URL"
echo "   4. Redeploy: vercel --prod"
echo ""
echo "🌐 Your site will be available at: https://your-app.vercel.app"

