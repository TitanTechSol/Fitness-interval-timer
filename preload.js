const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('set-always-on-top', enabled),
  openSoundsFolder: () => ipcRenderer.invoke('open-sounds-folder'),
  
  // Text file operations for message management
  readTextFile: (filePath) => ipcRenderer.invoke('read-text-file', filePath),
  saveTextFile: (content, fileName, audioNumber) => ipcRenderer.invoke('save-text-file', content, fileName, audioNumber),
  
  // Message restoration
  restoreOriginalMessages: () => ipcRenderer.invoke('restore-original-messages')
});
