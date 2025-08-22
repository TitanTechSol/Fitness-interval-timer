# Fitness Interval Timer

A professional desktop fitness interval timer built with Electron featuring customizable audio sequences, multiple themes, and comprehensive user controls.

## ✨ Key Features

### 🎵 Advanced Audio System
- **4-Audio Sequence Playback**: Configurable sequence from 1-4 audio tracks
- **Smart Audio Management**: Mix of single files and random folder selections
- **Drag & Drop Support**: Easily add custom audio files to any sequence
- **Volume Control**: Master volume slider with real-time adjustment
- **Audio Testing**: Test your sequence before starting workouts

### ⏰ Flexible Timer Controls  
- **Fixed Timer Mode**: Set precise hours, minutes, and seconds
- **Random Timer Mode**: Configure random intervals with min/max ranges
- **Full Control**: Start, pause, stop, and reset functionality
- **Auto-restart Option**: Automatic timer restart for continuous workouts

### 🎨 Professional UI/UX
- **5 Theme Options**: Dark (default), Light, Blue, Yellow, and Orange themes
- **Always on Top**: Keep timer visible during workouts
- **Responsive Design**: Adapts to different window sizes (minimum 600x600px)
- **Intuitive Navigation**: Clean settings interface with tabbed navigation
- **Visual Feedback**: Enhanced drop zones with drag-and-drop indicators

### 📱 Smart Notifications
- **Desktop Notifications**: System notifications when timer completes
- **Permission Management**: Automatic notification permission requests
- **Customizable Alerts**: Toggle notifications on/off in settings

### 🔧 User-Friendly Setup
- **Step-by-Step Guide**: Comprehensive audio setup instructions
- **Visual Drop Zones**: Numbered zones for easy file organization
- **Helpful Tips**: Built-in best practices and usage recommendations
- **Backup System**: Restore original audio files when needed

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gakibbie/Fitness-interval-timer.git
   cd Fitness-interval-timer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up audio files** (Optional - includes sample files)
   - The app includes a comprehensive guide for adding your own audio files
   - Use the drag-and-drop interface in settings to customize your experience

### Running the Application

**Development Mode:**
```bash
npm start
```

**Build Distribution:**
```bash
npm run dist
```

This creates a standalone executable in the `dist/` folder.

## 🏗️ Project Architecture

The application uses a modular architecture for maintainability:

```
├── index.html              # Main application entry point
├── main.js                 # Electron main process
├── preload.js             # Secure IPC communication
├── package.json           # Dependencies and build scripts
├── src/                   # Modular source code
│   ├── app.js            # Application initialization
│   ├── timer.js          # Core timer logic
│   ├── audio.js          # Audio management system
│   ├── settings.js       # Settings persistence
│   ├── ui.js             # UI management & navigation
│   └── styles.css        # Complete styling system
└── sounds/               # Audio file organization
    ├── Audio1.mp3        # Single startup sound
    ├── Audio2/           # Random motivational sounds
    ├── Audio3/           # Random punishment sounds
    ├── Audio4/           # Optional extra sounds
    └── Archive/          # Backup of original files
```

## 🎵 Audio System Guide

### Audio Sequence Flow
1. **Audio 1**: Single file that plays first (e.g., "What are you doing?")
2. **Audio 2**: Random selection from folder (e.g., motivational prompts)
3. **Audio 3**: Random selection from folder (e.g., consequences/punishments)
4. **Audio 4**: Optional extra audio (e.g., motivational closing)

### Supported Formats
- MP3 (recommended)
- WAV
- OGG
- Other HTML5 audio formats

### File Organization Tips
- Use descriptive filenames for easy management
- Keep file sizes reasonable for smooth playback
- Test your audio sequence before workouts
- Use the backup restore feature if you need to reset

## ⚙️ Configuration Options

### Timer Settings
- **Hours, Minutes, Seconds**: Precise time control
- **Random Mode**: Enable variable workout intervals
- **Random Range**: Set minimum and maximum time bounds
- **Auto-restart**: Continuous workout mode

### Audio Settings  
- **Audio Count**: Choose 1-4 audio sequence length
- **Master Volume**: Adjust playback volume
- **Sound Toggle**: Enable/disable audio playback
- **Test Sequence**: Preview your audio setup

### Application Settings
- **Theme Selection**: 5 professional themes
- **Always on Top**: Window behavior control
- **Notifications**: Desktop alert preferences
- **Window Size**: Minimum 600x600px, starts at 800x700px

## 💻 Technologies Used

- **Electron**: Cross-platform desktop application framework
- **HTML5 Audio API**: Advanced audio playback management  
- **CSS Custom Properties**: Dynamic theming system
- **LocalStorage**: Settings persistence
- **IPC Communication**: Secure main/renderer process communication
- **File System API**: Dynamic audio file management
- **Notification API**: Desktop notification support

## 🛠️ Development

### Code Structure
The application follows a modular class-based architecture:
- `IntervalTimer`: Core timing functionality
- `AudioManager`: Audio playback and file management
- `SettingsManager`: Configuration and persistence
- `UIManager`: Interface and navigation control
- `NotificationManager`: System notification handling

### Build Process
Uses `electron-packager` for cross-platform distribution with automatic dependency bundling.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
