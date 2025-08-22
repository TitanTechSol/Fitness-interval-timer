// Speech Management System (TTS)
class SpeechManager {
  constructor() {
    this.voices = [];
    this.currentVoice = null;
    this.messages = {
      audio1: [],
      audio2: [],
      audio3: [],
      audio4: []
    };
    this.settings = {
      rate: 1.0,      // Speed (0.1 - 10)
      pitch: 1.0,     // Pitch (0 - 2)
      volume: 1.0,    // Volume (0 - 1)
      voiceIndex: 0   // Selected voice index
    };
    
    this.initializeVoices();
    this.loadMessages();
    
    // Update settings from SettingsManager when available
    setTimeout(() => {
      this.syncWithSettingsManager();
    }, 500);
  }

  syncWithSettingsManager() {
    if (window.settingsManager) {
      const settings = window.settingsManager.getSettings();
      this.updateSettings({
        rate: settings.speechRate || 1.0,
        pitch: settings.speechPitch || 1.0,
        volume: settings.volume || 1.0,
        voiceIndex: settings.speechVoice || 0
      });
    }
  }

  initializeVoices() {
    // Load available system voices
    this.voices = speechSynthesis.getVoices();
    
    if (this.voices.length === 0) {
      // Voices load asynchronously, try again when ready
      speechSynthesis.onvoiceschanged = () => {
        this.voices = speechSynthesis.getVoices();
        this.setDefaultVoice();
        console.log('Available voices:', this.voices.map(v => v.name));
      };
    } else {
      this.setDefaultVoice();
      console.log('Available voices:', this.voices.map(v => v.name));
    }
  }

  setDefaultVoice() {
    if (this.voices.length === 0) return;
    
    // Try to find a good English voice
    const englishVoices = this.voices.filter(voice => 
      voice.lang.toLowerCase().includes('en')
    );
    
    // Prefer Microsoft voices on Windows, or any English voice
    const preferredVoice = englishVoices.find(voice => 
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('mark')
    ) || englishVoices[0] || this.voices[0];
    
    this.currentVoice = preferredVoice;
    this.settings.voiceIndex = this.voices.indexOf(preferredVoice);
    
    console.log('Selected voice:', this.currentVoice?.name);
  }

  async loadMessages() {
    try {
      // Load messages from .md files
      const messageFiles = [
        { key: 'audio1', file: 'sounds/Audio1.md' },
        { key: 'audio2', file: 'sounds/Audio2.md' },
        { key: 'audio3', file: 'sounds/Audio3.md' },
        { key: 'audio4', file: 'sounds/Audio4.md' }
      ];

      for (const { key, file } of messageFiles) {
        try {
          this.messages[key] = await this.loadMessageFile(file);
        } catch (error) {
          console.warn(`Could not load ${file}, using defaults:`, error);
          this.messages[key] = this.getDefaultMessages(key);
        }
      }

      // Update UI previews after messages load
      this.updateMessagePreviews();

      console.log('Messages loaded:', this.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      this.loadDefaultMessages();
    }
  }

  async loadMessageFile(filePath) {
    if (!window.electronAPI) {
      console.warn('File reading not available, using defaults');
      return this.getDefaultMessages(filePath.includes('Audio1') ? 'audio1' : 
                                   filePath.includes('Audio2') ? 'audio2' :
                                   filePath.includes('Audio3') ? 'audio3' : 'audio4');
    }

    try {
      const content = await window.electronAPI.readTextFile(filePath);
      
      // Parse the markdown file
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && !line.startsWith('//'))
        .filter(line => line.length > 0);
    } catch (error) {
      throw error;
    }
  }

  getDefaultMessages(audioKey) {
    const defaults = {
      audio1: [
        "What are you doing right now?",
        "Time to check in!",
        "Focus check - what's your priority?",
        "Are you staying on track?",
        "Quick accountability moment!"
      ],
      audio2: [
        "Get back to work!",
        "Stop procrastinating!",
        "Focus on your goals!",
        "You know what you need to do!",
        "Time to be productive!"
      ],
      audio3: [
        "Seriously? Again?",
        "You're better than this!",
        "No excuses this time!",
        "Come on, focus!",
        "Stop wasting time!"
      ],
      audio4: [
        "You've got this!",
        "Stay strong!",
        "Keep pushing forward!",
        "Great job staying focused!",
        "You're doing amazing!"
      ]
    };
    
    return defaults[audioKey] || [];
  }

  loadDefaultMessages() {
    // Fallback to hardcoded messages
    this.messages.audio1 = this.getDefaultMessages('audio1');
    this.messages.audio2 = this.getDefaultMessages('audio2');
    this.messages.audio3 = this.getDefaultMessages('audio3');
    this.messages.audio4 = this.getDefaultMessages('audio4');
  }

  async playSequence() {
    const settings = window.settingsManager?.getSettings() || { audioCount: 3, sound: true, volume: 1.0 };
    
    if (!settings.sound) return;

    const audioCount = Math.min(settings.audioCount || 3, 4);
    
    try {
      for (let i = 1; i <= audioCount; i++) {
        await this.speak(i, settings.volume);
        
        // Small delay between messages
        if (i < audioCount) {
          await this.delay(1000); // 1 second pause
        }
      }
    } catch (error) {
      console.error('Error playing speech sequence:', error);
    }
  }

  async speak(audioNumber, volume = 1.0) {
    return new Promise((resolve) => {
      try {
        const audioKey = `audio${audioNumber}`;
        const messages = this.messages[audioKey];
        
        if (!messages || messages.length === 0) {
          console.warn(`No messages available for ${audioKey}`);
          resolve();
          return;
        }

        // Select random message
        const randomIndex = Math.floor(Math.random() * messages.length);
        const message = messages[randomIndex];
        
        console.log(`Speaking ${audioKey}: "${message}"`);
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = this.currentVoice;
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = Math.max(0, Math.min(1, volume * this.settings.volume));
        
        // Handle completion
        utterance.onend = () => {
          console.log(`Finished speaking: "${message}"`);
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          resolve(); // Don't block the sequence
        };
        
        // Speak the message
        speechSynthesis.speak(utterance);
        
      } catch (error) {
        console.error(`Error speaking ${audioNumber}:`, error);
        resolve();
      }
    });
  }

  async testSequence() {
    console.log('Testing speech sequence...');
    await this.playSequence();
  }

  async testMessage(audioNumber) {
    console.log(`Testing message for Audio ${audioNumber}...`);
    await this.speak(audioNumber, 1.0);
  }

  setVoice(voiceIndex) {
    if (voiceIndex >= 0 && voiceIndex < this.voices.length) {
      this.currentVoice = this.voices[voiceIndex];
      this.settings.voiceIndex = voiceIndex;
      console.log('Voice changed to:', this.currentVoice.name);
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Update voice if changed
    if (newSettings.voiceIndex !== undefined) {
      this.setVoice(newSettings.voiceIndex);
    }
  }

  getAvailableVoices() {
    return this.voices.map((voice, index) => ({
      index,
      name: voice.name,
      lang: voice.lang,
      isDefault: voice === this.currentVoice
    }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Restore original messages from Archive
  async restoreOriginalMessages() {
    if (!window.electronAPI) {
      console.warn('Message restore not supported in browser mode');
      return false;
    }

    try {
      const result = await window.electronAPI.restoreOriginalMessages();
      
      if (result.success) {
        // Reload messages after restore
        await this.loadMessages();
        console.log('Original messages restored successfully');
        return true;
      } else {
        throw new Error(result.error || 'Failed to restore messages');
      }
    } catch (error) {
      console.error('Error restoring original messages:', error);
      throw error;
    }
  }

  updateMessagePreviews() {
    // Update UI previews for each audio category
    for (let i = 1; i <= 4; i++) {
      const audioKey = `audio${i}`;
      const preview = document.getElementById(`${audioKey}Preview`);
      const messages = this.messages[audioKey];
      
      if (preview && messages && messages.length > 0) {
        const sampleMessage = messages[0];
        const additionalCount = messages.length - 1;
        
        if (additionalCount > 0) {
          preview.textContent = `${messages.length} messages: "${sampleMessage}" and ${additionalCount} more...`;
        } else {
          preview.textContent = `1 message: "${sampleMessage}"`;
        }
      } else if (preview) {
        preview.textContent = 'No messages found';
      }
    }
  }
}

// Export for global use
window.SpeechManager = SpeechManager;
