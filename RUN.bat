@echo off
title Fitness Interval Timer - Launcher

:: Check if the application is already built
if exist "dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe" (
    echo 🚀 Starting Fitness Interval Timer...
    echo.
    start "" "dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe"
    timeout /t 2 >nul
    exit
)

:: If not built, run the installer first
echo 🔧 First time setup required...
echo.
call install.bat

if exist "dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe" (
    echo.
    echo 🚀 Starting Fitness Interval Timer...
    start "" "dist\fitness-interval-timer-win32-x64\fitness-interval-timer.exe"
    timeout /t 2 >nul
) else (
    echo.
    echo ❌ Setup failed. Please check the installation.
    pause
)
