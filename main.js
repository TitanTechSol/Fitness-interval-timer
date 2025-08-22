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

// Handle text file reading
ipcMain.handle('read-text-file', async (event, filePath) => {
  try {
    console.log('Reading text file:', filePath);
    console.log('__dirname:', __dirname);
    
    // Handle relative paths properly for packaged apps
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
    console.log('Full path:', fullPath);
    
    const content = await fs.readFile(fullPath, 'utf-8');
    console.log('File content length:', content.length);
    return content;
  } catch (error) {
    console.error('Error reading text file:', error);
    console.error('Attempted path:', filePath);
    console.error('Full path:', path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath));
    throw error;
  }
});

// Handle text file saving
ipcMain.handle('save-text-file', async (event, content, fileName, audioNumber) => {
  try {
    const audioFolderPath = path.join(__dirname, 'sounds');
    const filePath = path.join(audioFolderPath, `Audio${audioNumber}.md`);
    
    // Save the file
    await fs.writeFile(filePath, content, 'utf-8');
    
    console.log(`Message file saved: ${fileName} to Audio${audioNumber}.md`);
    
    return { success: true };
  } catch (error) {
    console.error('Error saving text file:', error);
    return { success: false, error: error.message };
  }
});

// Restore original message files from Archive
ipcMain.handle('restore-original-messages', async () => {
  try {
    const soundsPath = path.join(__dirname, 'sounds');
    const archivePath = path.join(soundsPath, 'Archive');
    
    // Check if Archive folder exists
    if (!await fs.access(archivePath).then(() => true).catch(() => false)) {
      throw new Error('Archive folder not found. Cannot restore original messages.');
    }
    
    // Copy each archived message file back to sounds folder
    const messageFiles = ['Audio1.md', 'Audio2.md', 'Audio3.md', 'Audio4.md'];
    
    for (const fileName of messageFiles) {
      const sourcePath = path.join(archivePath, fileName);
      const destPath = path.join(soundsPath, fileName);
      
      // Check if archive file exists
      if (await fs.access(sourcePath).then(() => true).catch(() => false)) {
        await fs.copyFile(sourcePath, destPath);
        console.log(`Restored: ${fileName}`);
      } else {
        console.warn(`Archive file not found: ${fileName}`);
      }
    }
    
    console.log('Original messages restored successfully');
    return { success: true };
  } catch (error) {
    console.error('Error restoring original messages:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
