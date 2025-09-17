# Fitness Interval Timer

A desktop fitness interval timer built with Electron featuring text-to-speech messaging and customizable themes. 100% offline with no audio files required.

## Features

- **Text-to-Speech System**: Configurable TTS with Windows built-in voices
- **Message Editor**: Customize workout messages loaded from .md files  
- **Timer Controls**: Fixed or random intervals with start/pause/stop
- **Multiple Themes**: Dark, Light, Blue, Yellow, and Orange themes
- **Always on Top**: Keep timer visible during workouts
- **Desktop Notifications**: System alerts when timer completes
- **Auto-restart**: Continuous workout mode

## Quick Start

**Windows Users:**
1. Download this repository 
2. Extract the ZIP file
3. Double-click `RUN.bat`

**Command Line:**
```bash
git clone https://github.com/gakibbie/Fitness-interval-timer.git
cd Fitness-interval-timer
npm install
npm start
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Setup
```bash
npm install
```

### Run
```bash
npm start      # Development mode
npm run dist   # Build executable
```

## Project Structure

```
├── index.html              # Main application entry point
├── main.js                 # Electron main process
├── preload.js             # Secure IPC communication
├── src/                   # Source code
│   ├── app.js            # Application initialization
│   ├── timer.js          # Timer logic
│   ├── speech.js         # Text-to-speech system
│   ├── messageEditor.js  # Message editing
│   ├── settings.js       # Settings management
│   ├── ui.js             # UI management
│   └── styles.css        # Styling
└── sounds/               # Message files
    ├── Audio1.md         # Check-in messages
    ├── Audio2.md         # Action detection messages
    ├── Audio3.md         # Workout commands
    └── Audio4.md         # Custom messages
```

## Message System

The app uses four message categories loaded from .md files:

1. **Audio1.md**: Check-in messages ("What are you doing right now?")
2. **Audio2.md**: Action detection ("If you are sitting...")
3. **Audio3.md**: Workout commands ("Do 10 pushups")
4. **Audio4.md**: Custom messages (user customizable)

## Technologies

- Electron (desktop app framework)
- Web Speech API (text-to-speech)
- CSS Custom Properties (theming)
- LocalStorage (settings persistence)

## License

MIT License
