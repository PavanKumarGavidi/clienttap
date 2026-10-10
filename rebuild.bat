@echo off
REM ============================================
REM COMPLETE REBUILD SCRIPT FOR WINDOWS
REM This will completely rebuild the application
REM from scratch to fix UUID and logo issues
REM ============================================

echo 🚀 Starting complete rebuild...

REM Step 1: Stop any running dev server
echo 📝 Step 1: Stopping dev server...
taskkill /F /IM node.exe 2>nul

REM Step 2: Delete all caches and build artifacts
echo 🗑️  Step 2: Deleting caches...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
if exist .next rmdir /s /q .next
if exist .turbo rmdir /s /q .turbo
if exist coverage rmdir /s /q coverage
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist pnpm-lock.yaml del pnpm-lock.yaml

REM Step 3: Clear npm cache
echo 🧹 Step 3: Clearing npm cache...
npm cache clean --force

REM Step 4: Reinstall dependencies
echo 📦 Step 4: Reinstalling dependencies...
npm install

REM Step 5: Rebuild the application
echo 🔨 Step 5: Rebuilding application...
npm run build

REM Step 6: Verify the build
echo ✅ Step 6: Verifying build...
if exist dist (
  echo ✅ Build successful!
  echo 📊 Build size:
  dir dist
) else (
  echo ❌ Build failed!
  exit /b 1
)

REM Step 7: Start dev server
echo 🚀 Step 7: Starting dev server...
start npm run dev

REM Wait for server to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ✅ REBUILD COMPLETE!
echo ========================================
echo.
echo 📋 Next Steps:
echo 1. Open browser in INCOGNITO mode (Ctrl+Shift+N)
echo 2. Go to http://localhost:5173
echo 3. Sign up with a NEW email
echo 4. Try adding a lead
echo 5. Test logo upload in Settings
echo.
echo 🔍 If you still see UUID errors:
echo    - Make sure you're using incognito mode
echo    - Clear browser cache again (Ctrl+Shift+Delete)
echo    - Check console for '[Storage] Inserting data (without id):'
echo.
echo ========================================
pause
