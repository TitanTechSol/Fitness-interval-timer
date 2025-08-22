# Fitness Interval Timer

A professional desktop fitness interval timer built with Electron featuring pure text-to-speech messaging, multiple themes, and comprehensive user controls. 100% offline with no audio files required.

## ✨ Key Features

### 🗣️ Pure Text-to-Speech System
- **4-Message Sequence Playbook**: Configurable TTS sequence from 1-4 message categories
- **Template-Based Messages**: Structured system loading from editable .md files only
- **Voice Customization**: Select from Windows built-in voices with speed, pitch, and volume controls
- **Message Editor**: Full-featured text editor for customizing all message categories
- **100% Offline**: No internet connection or audio files required - pure system TTS
- **No Hardcoded Messages**: All content loaded exclusively from user-editable .md files

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
- **Modal Message Editor**: Professional interface for editing messages

### 📱 Smart Notifications
- **Desktop Notifications**: System notifications when timer completes
- **Permission Management**: Automatic notification permission requests
- **Customizable Alerts**: Toggle notifications on/off in settings

### 🔧 User-Friendly Setup
- **Message Template System**: Structured approach to fitness accountability
- **Quick Add Messages**: Rapidly add single messages to any category
- **Archive & Restore**: Backup system to restore original messages
- **Test Functionality**: Preview messages with current voice settings
- **Reset All Settings**: Complete settings reset functionality

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

3. **Set up messages** (Optional - includes default structured messages)
   - The app includes a comprehensive message template system loaded from .md files
   - Use the message editor interface in settings to customize your experience
   - All messages are stored in editable .md files - no hardcoded content

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
│   ├── speech.js         # Text-to-speech system
│   ├── messageEditor.js  # Message editing interface
│   ├── settings.js       # Settings persistence
│   ├── ui.js             # UI management & navigation
│   └── styles.css        # Complete styling system
└── sounds/               # Message file organization
    ├── Audio1.md         # Check-in messages
    ├── Audio2.md         # Action detection messages
    ├── Audio3.md         # Workout commands
    ├── Audio4.md         # Custom messages
    ├── MESSAGE_TEMPLATE.md # Template reference
    └── Archive/          # Backup of original messages
```

## 🗣️ Message System Guide

### Pure TTS Architecture
- **No Audio Files**: System uses only Windows built-in TTS voices
- **File-Based Messages**: All content loaded from editable .md files
- **No Fallbacks**: No hardcoded messages - complete user control over content

### Message Template Structure
The app uses a structured template system: **[Check-in] → [Action Detection] → [Workout Command]**

### Message Categories
1. **Audio1.md**: Check-in messages (e.g., "What are you doing right now?")
2. **Audio2.md**: Action detection messages (e.g., "If you are sitting")
3. **Audio3.md**: Workout commands (e.g., "Do 10 pushups")
4. **Audio4.md**: Custom messages (user customizable, currently empty)

### Template Components
- **Check-ins**: Accountability questions and focus prompts (Audio1)
- **Actions**: Behavioral patterns to detect - sitting, reading, etc. (Audio2)
- **Workouts**: Specific exercises and fitness challenges (Audio3)

### Message Editing Features
- **Full Editor**: Multi-line text editing with real-time stats
- **Quick Add**: Rapid single-message addition with examples
- **Test Messages**: Preview messages with current TTS voice
- **Archive System**: Restore original messages anytime

### Voice Customization
- **Voice Selection**: Choose from Windows built-in voices
- **Speed Control**: Adjust speech rate from 0.5x to 2x
- **Pitch Control**: Modify voice pitch for personalization  
- **Volume Control**: Set TTS volume independent of system volume

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
- **Reset All Settings**: Complete configuration reset to defaults
- **Window Size**: Minimum 600x600px, starts at 800x700px

## 💻 Technologies Used

- **Electron**: Cross-platform desktop application framework
- **Web Speech API**: System TTS integration with voice control
- **CSS Custom Properties**: Dynamic theming system
- **LocalStorage**: Settings persistence
- **IPC Communication**: Secure main/renderer process communication
- **File System API**: Dynamic .md file loading and management
- **Notification API**: Desktop notification support

## 🛠️ Development

### Code Structure
The application follows a modular class-based architecture:
- `IntervalTimer`: Core timing functionality
- `SpeechManager`: Pure TTS management and message loading from .md files
- `SettingsManager`: Configuration and persistence with reset functionality
- `UIManager`: Interface and navigation control
- `NotificationManager`: System notification handling

### Build Process
Uses `electron-packager` for cross-platform distribution with automatic dependency bundling.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
