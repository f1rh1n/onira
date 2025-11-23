@echo off
echo Cleaning up and restarting Onira...

echo.
echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo Step 2: Removing build cache...
if exist .next rmdir /s /q .next
timeout /t 1 >nul

echo Step 3: Generating Prisma client...
call npx prisma generate

echo.
echo Step 4: Starting development server...
echo Server will be available at http://localhost:3000
echo.
call npm run dev
