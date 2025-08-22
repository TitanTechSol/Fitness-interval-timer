const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('timer.html');
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
