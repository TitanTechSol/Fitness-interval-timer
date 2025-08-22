# 🚀 Quick Start Guide - Fitness Interval Timer

Welcome! This guide will help you get the Fitness Interval Timer running on your computer with minimal technical knowledge required.

## 📋 Prerequisites

You'll need **Node.js** installed on your computer. If you don't have it:

### Windows:
1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. Restart your computer

### macOS:
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
```

## 🎯 Automatic Setup (Recommended)

**Choose your operating system:**

### Windows Users:
1. **Download this repository** (green "Code" button → "Download ZIP")
2. **Extract the ZIP file** to your desired location
3. **Double-click** `install.bat` in the extracted folder
4. **Follow the on-screen prompts**

*Alternative: Right-click `install.ps1` and select "Run with PowerShell"*

### macOS/Linux Users:
1. **Download this repository** or clone with Git
2. **Open Terminal** and navigate to the folder
3. **Make the script executable:**
   ```bash
   chmod +x install.sh
   ```
4. **Run the installer:**
   ```bash
   ./install.sh
   ```

## 🔧 Manual Setup (If automatic fails)

1. **Open terminal/command prompt** in the project folder
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Build the application:**
   ```bash
   npm run dist
   ```
4. **Run the app:**
   ```bash
   npm start
   ```

## 🎉 After Installation

### Running the App:
- **Portable Version:** Go to `dist/fitness-interval-timer-win32-x64/` and double-click `fitness-interval-timer.exe`
- **Development Mode:** Run `npm start` in the project folder

### First Time Use:
1. The app starts with default fitness messages
2. Go to **Settings** (⚙️ button) to customize
3. Use the **Message Editor** to personalize your workout prompts
4. Test your audio with the **Test Audio** button

## 🛠️ Troubleshooting

### "Node.js is not recognized"
- Restart your terminal/command prompt after installing Node.js
- Make sure Node.js is added to your system PATH

### Permission Errors (Windows)
- Right-click and "Run as Administrator"
- Or use PowerShell: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Build Fails
- Check internet connection
- Try: `npm cache clean --force`
- Delete `node_modules` folder and run `npm install` again

### Audio Not Working
- Make sure system volume is up
- Check Windows Speech settings
- Try different voice in app settings

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Make sure you have the latest version of Node.js

## 🎯 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Run in development mode |
| `npm run dist` | Build portable executable |
| `npm run clean` | Clean build files |
| `npm test` | Run tests (if available) |

---

**That's it!** Your fitness interval timer should now be ready to help keep you accountable during work sessions! 🏃‍♂️💪
