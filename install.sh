#!/bin/bash

# Fitness Interval Timer - macOS/Linux Setup Script
# Make executable with: chmod +x install.sh
# Run with: ./install.sh

echo "========================================"
echo "    Fitness Interval Timer Setup"
echo "========================================"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo
    echo -e "${YELLOW}Please install Node.js first:${NC}"
    echo -e "${YELLOW}1. Go to https://nodejs.org${NC}"
    echo -e "${YELLOW}2. Download and install the LTS version${NC}"
    echo -e "${YELLOW}3. Restart this script${NC}"
    echo
    echo -e "${YELLOW}Or use a package manager:${NC}"
    echo -e "${YELLOW}  macOS: brew install node${NC}"
    echo -e "${YELLOW}  Ubuntu/Debian: sudo apt install nodejs npm${NC}"
    echo -e "${YELLOW}  CentOS/RHEL: sudo yum install nodejs npm${NC}"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"

# Check if npm is available
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not available!${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
echo

echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"
echo

# Install dependencies
if ! npm install; then
    echo
    echo -e "${RED}❌ Failed to install dependencies!${NC}"
    echo
    echo -e "${YELLOW}Try checking your internet connection or running with sudo if needed.${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

echo
echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
echo

echo -e "${BLUE}🔨 Building application...${NC}"
echo

# Build the application
if ! npm run dist; then
    echo
    echo -e "${RED}❌ Failed to build application!${NC}"
    read -p "Press Enter to exit..."
    exit 1
fi

echo
echo -e "${GREEN}🎉 SUCCESS! Setup complete!${NC}"
echo
echo -e "${CYAN}Your Fitness Interval Timer is ready!${NC}"
echo
echo -e "${YELLOW}To run the application:${NC}"
echo -e "  • Run: ${GREEN}npm start${NC} (development mode)"
echo -e "  • Or check the 'dist' folder for platform-specific builds"
echo
echo -e "${GREEN}The application is now ready to use!${NC}"
echo

read -p "Press Enter to exit..."
