#!/bin/bash
# Fix npm permissions issue

echo "🔧 Fixing npm permissions..."

# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm

echo "✅ npm permissions fixed!"
echo ""
echo "Now run:"
echo "  cd frontend"
echo "  npm install canvg html2canvas"

