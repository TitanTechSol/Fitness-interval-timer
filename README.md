# Fitness Interval Timer

A desktop fitness interval timer built with Electron that plays random audio motivations and punishments.

## Features

- Customizable timer intervals (fixed time or random 7-12 minutes)
- Plays random audio sequences from your sound files
- Desktop notifications
- Clean, modern UI with settings toggle
- Runs as a standalone desktop app

## Getting Started

### Prerequisites
- Node.js and npm installed

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your audio files to the `sounds/` folders:
   - `sounds/Reason/` - Motivational audio files
   - `sounds/Punishment/` - Punishment audio files
   - `sounds/Start.mp3` - Start sound

### Running the App

Development mode:
```bash
npm start
```

Build standalone executable:
```bash
npx electron-packager . FitnessIntervalTimer --platform=win32 --arch=x64 --out=dist --overwrite
```

## Project Structure

```
├── timer.html          # Main UI and logic
├── main.js             # Electron main process
├── package.json        # Dependencies and scripts
└── sounds/             # Audio files directory
    ├── Start.mp3
    ├── Reason/         # Motivational sounds
    └── Punishment/     # Punishment sounds
```

## Technologies Used

- Electron
- HTML/CSS/JavaScript
- Node.js filesystem API for dynamic audio loading
