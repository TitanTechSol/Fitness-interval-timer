@echo off
echo ========================================
echo    Fitness Interval Timer Setup
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Go to https://nodejs.org
    echo 2. Download and install the LTS version
    echo 3. Restart this script
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not available!
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version
echo.

echo 📦 Installing dependencies...
echo This may take a few minutes...
echo.

call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    echo.
    echo Try running as Administrator or check your internet connection.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

echo 🔨 Building application...
echo.

call npm run dist
if %errorlevel% neq 0 (
    echo ❌ Failed to build application!
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Setup complete!
echo.
echo Your Fitness Interval Timer is ready!
echo.
echo To run the application:
echo   • Double-click: dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe
echo   • Or run: npm start (for development mode)
echo.
echo The portable executable is in the 'dist' folder and can be copied anywhere!
echo.
pause
