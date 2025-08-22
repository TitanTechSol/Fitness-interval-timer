const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    minWidth: 600,
    minHeight: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });
  mainWindow.loadFile('index.html');
}

// IPC handlers for renderer communication
ipcMain.handle('set-always-on-top', (event, enabled) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(enabled);
    return enabled;
  }
  return false;
});

ipcMain.handle('open-sounds-folder', () => {
  const soundsPath = path.join(__dirname, 'sounds');
  shell.openPath(soundsPath);
  return soundsPath;
});

// Save audio file handler
ipcMain.handle('save-audio-file', async (event, arrayBuffer, fileName, audioNumber) => {
  try {
    const soundsDir = path.join(__dirname, 'sounds');
    let targetPath;
    
    if (audioNumber === 1) {
      // Replace Audio1.mp3
      targetPath = path.join(soundsDir, 'Audio1.mp3');
    } else {
      // Save to Audio2, Audio3, or Audio4 folder
      const folderName = `Audio${audioNumber}`;
      const folderPath = path.join(soundsDir, folderName);
      
      // Ensure the folder exists
      await fs.mkdir(folderPath, { recursive: true });
      
      targetPath = path.join(folderPath, fileName);
    }
    
    // Write the file
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(targetPath, buffer);
    
    return { success: true, path: targetPath };
  } catch (error) {
    console.error('Error saving audio file:', error);
    return { success: false, error: error.message };
  }
});

// Restore backup handler
ipcMain.handle('restore-backup', async () => {
  try {
    const soundsDir = path.join(__dirname, 'sounds');
    const archiveDir = path.join(soundsDir, 'Archive');
    
    // Check if Archive exists
    const archiveStat = await fs.stat(archiveDir);
    if (!archiveStat.isDirectory()) {
      return { success: false, error: 'Archive folder not found' };
    }
    
    // Copy Start.mp3 to Audio1.mp3
    const startPath = path.join(archiveDir, 'Start.mp3');
    const audio1Path = path.join(soundsDir, 'Audio1.mp3');
    await fs.copyFile(startPath, audio1Path);
    
    // Copy Reason folder to Audio2
    const reasonPath = path.join(archiveDir, 'Reason');
    const audio2Path = path.join(soundsDir, 'Audio2');
    await copyDirectory(reasonPath, audio2Path);
    
    // Copy Punishment folder to Audio3  
    const punishmentPath = path.join(archiveDir, 'Punishment');
    const audio3Path = path.join(soundsDir, 'Audio3');
    await copyDirectory(punishmentPath, audio3Path);
    
    // Clear Audio4 folder
    const audio4Path = path.join(soundsDir, 'Audio4');
    await fs.rm(audio4Path, { recursive: true, force: true });
    await fs.mkdir(audio4Path, { recursive: true });
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring backup:', error);
    return { success: false, error: error.message };
  }
});

// Helper function to copy directory
async function copyDirectory(src, dest) {
  await fs.rm(dest, { recursive: true, force: true });
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
