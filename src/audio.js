// Audio Management System
class AudioManager {
  constructor() {
    this.audioElements = new Map();
    this.settings = {};
    this.loadAudioFiles();
  }

  async loadAudioFiles() {
    try {
      // Load Audio1 (single file)
      const audio1 = new Audio('sounds/Audio1.mp3');
      this.audioElements.set('audio1', audio1);

      // Load Audio2-4 folders (will be loaded dynamically)
      for (let i = 2; i <= 4; i++) {
        this.audioElements.set(`audio${i}`, []);
      }

      await this.refreshAudioLists();
    } catch (error) {
      console.error('Error loading audio files:', error);
    }
  }

  async refreshAudioLists() {
    // This would typically use file system APIs in Electron
    // For now, we'll use hardcoded lists
    const audio2Files = ['Reason1.mp3', 'Reason2.mp3', 'Reason3.mp3']; // etc
    const audio3Files = ['Punishment1.mp3', 'Punishment2.mp3', 'Punishment3.mp3']; // etc
    const audio4Files = []; // Empty by default

    this.audioElements.set('audio2', audio2Files.map(file => new Audio(`sounds/Audio2/${file}`)));
    this.audioElements.set('audio3', audio3Files.map(file => new Audio(`sounds/Audio3/${file}`)));
    this.audioElements.set('audio4', audio4Files.map(file => new Audio(`sounds/Audio4/${file}`)));
  }

  async playSequence() {
    const settings = window.settingsManager?.getSettings() || { audioCount: 3, sound: true, volume: 1.0 };
    
    if (!settings.sound) return;

    const audioCount = Math.min(settings.audioCount || 3, 4);
    
    try {
      for (let i = 1; i <= audioCount; i++) {
        await this.playAudio(i, settings.volume);
        
        // Small delay between audios
        if (i < audioCount) {
          await this.delay(500);
        }
      }
    } catch (error) {
      console.error('Error playing audio sequence:', error);
    }
  }

  async playAudio(audioNumber, volume = 1.0) {
    return new Promise((resolve, reject) => {
      try {
        let audio;

        if (audioNumber === 1) {
          // Single Audio1.mp3 file
          audio = this.audioElements.get('audio1');
        } else {
          // Random selection from Audio2-4 folders
          const audioList = this.audioElements.get(`audio${audioNumber}`);
          if (audioList && audioList.length > 0) {
            const randomIndex = Math.floor(Math.random() * audioList.length);
            audio = audioList[randomIndex];
          }
        }

        if (!audio) {
          console.warn(`No audio found for Audio ${audioNumber}`);
          resolve();
          return;
        }

        // Set volume and play
        audio.volume = Math.max(0, Math.min(1, volume));
        audio.currentTime = 0; // Reset to beginning
        
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error(`Error playing Audio ${audioNumber}`));
        
        audio.play().catch(error => {
          console.error(`Error playing Audio ${audioNumber}:`, error);
          resolve(); // Don't block the sequence
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  async testSequence() {
    console.log('Testing audio sequence...');
    await this.playSequence();
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Handle drag and drop files
  async handleFileDrop(files, audioNumber) {
    if (!window.electronAPI) {
      console.warn('File drop not supported in browser mode');
      return;
    }

    try {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.electronAPI.saveAudioFile(arrayBuffer, file.name, audioNumber);
        
        if (result.success) {
          console.log(`Audio file saved: ${file.name} to Audio ${audioNumber}`);
          // Refresh the audio lists
          await this.refreshAudioLists();
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Error handling file drop:', error);
      throw error;
    }
  }

  // Restore backup files
  async restoreBackup() {
    if (!window.electronAPI) {
      console.warn('Backup restore not supported in browser mode');
      return false;
    }

    try {
      const result = await window.electronAPI.restoreBackup();
      
      if (result.success) {
        await this.refreshAudioLists();
        console.log('Backup restored successfully');
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
}

// Export for global use
window.AudioManager = AudioManager;
