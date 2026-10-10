#!/bin/bash

# ============================================
# COMPLETE REBUILD SCRIPT
# This will completely rebuild the application
# from scratch to fix UUID and logo issues
# ============================================

echo "🚀 Starting complete rebuild..."

# Step 1: Stop any running dev server
echo "📝 Step 1: Stopping dev server..."
pkill -f "vite" || true
pkill -f "npm run dev" || true

# Step 2: Delete all caches and build artifacts
echo "🗑️  Step 2: Deleting caches..."
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm -rf .next
rm -rf .turbo
rm -rf coverage
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Step 3: Clear npm cache
echo "🧹 Step 3: Clearing npm cache..."
npm cache clean --force

# Step 4: Reinstall dependencies
echo "📦 Step 4: Reinstalling dependencies..."
npm install

# Step 5: Rebuild the application
echo "🔨 Step 5: Rebuilding application..."
npm run build

# Step 6: Verify the build
echo "✅ Step 6: Verifying build..."
if [ -d "dist" ]; then
  echo "✅ Build successful!"
  echo "📊 Build size:"
  du -sh dist
else
  echo "❌ Build failed!"
  exit 1
fi

# Step 7: Start dev server
echo "🚀 Step 7: Starting dev server..."
npm run dev &

# Wait for server to start
sleep 3

echo ""
echo "========================================"
echo "✅ REBUILD COMPLETE!"
echo "========================================"
echo ""
echo "📋 Next Steps:"
echo "1. Open browser in INCOGNITO mode (Ctrl+Shift+N)"
echo "2. Go to http://localhost:5173"
echo "3. Sign up with a NEW email"
echo "4. Try adding a lead"
echo "5. Test logo upload in Settings"
echo ""
echo "🔍 If you still see UUID errors:"
echo "   - Make sure you're using incognito mode"
echo "   - Clear browser cache again (Ctrl+Shift+Delete)"
echo "   - Check console for '[Storage] Inserting data (without id):'"
echo ""
echo "========================================"
