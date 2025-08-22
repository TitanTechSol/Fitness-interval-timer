# One-Line Install Script for Fitness Interval Timer
# Save this as "quick-install.ps1" and run with PowerShell

Write-Host "🚀 Fitness Interval Timer - One-Click Installer" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if Git is available
if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "📥 Cloning repository..." -ForegroundColor Blue
    git clone https://github.com/gakibbie/Fitness-interval-timer.git
    Set-Location Fitness-interval-timer
} else {
    Write-Host "❌ Git not found. Please download the repository manually:" -ForegroundColor Red
    Write-Host "https://github.com/gakibbie/Fitness-interval-timer/archive/main.zip" -ForegroundColor Yellow
    exit 1
}

# Run the installer
Write-Host "🔧 Running setup..." -ForegroundColor Blue
.\install.ps1
