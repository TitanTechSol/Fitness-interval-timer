const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  setAlwaysOnTop: (enabled) => ipcRenderer.invoke('set-always-on-top', enabled),
  openSoundsFolder: () => ipcRenderer.invoke('open-sounds-folder'),
  saveAudioFile: (arrayBuffer, fileName, audioNumber) => ipcRenderer.invoke('save-audio-file', arrayBuffer, fileName, audioNumber),
  restoreBackup: () => ipcRenderer.invoke('restore-backup')
});
