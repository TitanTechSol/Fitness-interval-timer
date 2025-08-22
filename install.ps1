# Fitness Interval Timer - PowerShell Setup Script
# Run this script by right-clicking and selecting "Run with PowerShell"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Fitness Interval Timer Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org" -ForegroundColor Yellow
    Write-Host "2. Download and install the LTS version" -ForegroundColor Yellow
    Write-Host "3. Restart this script" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green

# Check if npm is available
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not available!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$npmVersion = npm --version
Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
Write-Host "This may take a few minutes..." -ForegroundColor Yellow
Write-Host ""

# Install dependencies
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
}
catch {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running as Administrator or check your internet connection." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "🔨 Building application..." -ForegroundColor Blue
Write-Host ""

# Build the application
try {
    npm run dist
    if ($LASTEXITCODE -ne 0) {
        throw "npm run dist failed"
    }
}
catch {
    Write-Host "❌ Failed to build application!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🎉 SUCCESS! Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your Fitness Interval Timer is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the application:" -ForegroundColor Yellow
Write-Host "  • Double-click: dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe" -ForegroundColor White
Write-Host "  • Or run: npm start (for development mode)" -ForegroundColor White
Write-Host ""
Write-Host "The portable executable is in the 'dist' folder and can be copied anywhere!" -ForegroundColor Green
Write-Host ""

# Offer to open the dist folder
$openFolder = Read-Host "Would you like to open the dist folder now? (y/n)"
if ($openFolder -eq "y" -or $openFolder -eq "Y") {
    if (Test-Path "dist\fitness-interval-timer-win32-x64") {
        explorer "dist\fitness-interval-timer-win32-x64"
    }
}

Read-Host "Press Enter to exit"
