# Message Archive

This folder contains the original default message files for the Fitness Interval Timer.

## Purpose

These files serve as backups of the original messages that came with the application. If you edit or customize your messages and want to revert to the defaults, you can use the "🔄 Restore Original Messages" button in the application settings.

## Files

- **Audio1.md** - Original check-in messages
- **Audio2.md** - Original motivation messages  
- **Audio3.md** - Original punishment messages
- **Audio4.md** - Original encouragement messages

## How to Restore

1. Open the application
2. Click the ⚙️ Settings button
3. Navigate to the "Audio" tab
4. Click "🔄 Restore Original Messages"
5. Confirm when prompted

This will overwrite any custom messages you've created and restore the original defaults.

## Manual Restoration

You can also manually copy these files back to the parent `sounds/` folder if needed:

```bash
cp Archive/Audio*.md .
```

**Warning**: This will overwrite your current message files!
