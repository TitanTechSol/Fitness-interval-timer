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
      console.log('Starting to load messages from .md files...');
      
      // Load messages from .md files
      const messageFiles = [
        { key: 'audio1', file: 'sounds/Audio1.md' },
        { key: 'audio2', file: 'sounds/Audio2.md' },
        { key: 'audio3', file: 'sounds/Audio3.md' },
        { key: 'audio4', file: 'sounds/Audio4.md' }
      ];

      for (const { key, file } of messageFiles) {
        try {
          console.log(`Loading ${file}...`);
          this.messages[key] = await this.loadMessageFile(file);
          console.log(`Loaded ${this.messages[key].length} messages for ${key}:`, this.messages[key]);
        } catch (error) {
          console.warn(`Could not load ${file}:`, error);
          this.messages[key] = [];
        }
      }

      // Update UI previews after messages load
      this.updateMessagePreviews();

      console.log('Final messages loaded:', this.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
      this.loadDefaultMessages();
    }
  }

  async loadMessageFile(filePath) {
    if (!window.electronAPI) {
      console.warn('File reading not available - no messages will be loaded');
      return [];
    }

    try {
      console.log('Loading message file:', filePath);
      const content = await window.electronAPI.readTextFile(filePath);
      console.log('Loaded content:', content);
      
      // Parse the markdown file
      const messages = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && !line.startsWith('//'))
        .filter(line => line.length > 0);
      
      console.log('Parsed messages:', messages);
      return messages;
    } catch (error) {
      console.error('Error loading message file:', filePath, error);
      throw error;
    }
  }

  getDefaultMessages(audioKey) {
    // No hardcoded defaults - only load from .md files
    console.warn(`No messages loaded for ${audioKey} - check that the .md file exists and is readable`);
    return [];
  }

  loadDefaultMessages() {
    // No hardcoded fallbacks - only use empty arrays if .md files can't be loaded
    console.warn('Could not load message files - messages will be empty until files are available');
    this.messages.audio1 = [];
    this.messages.audio2 = [];
    this.messages.audio3 = [];
    this.messages.audio4 = [];
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
          await this.delay(50); // 50 ms pause
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
        
        console.log(`Attempting to speak ${audioKey}. Available messages:`, messages);
        console.log(`Messages length: ${messages?.length || 0}`);
        
        if (!messages || messages.length === 0) {
          console.warn(`No messages available for ${audioKey} - skipping speech`);
          resolve();
          return;
        }

        // Select random message
        const randomIndex = Math.floor(Math.random() * messages.length);
        const message = messages[randomIndex];
        
        console.log(`Speaking ${audioKey}: "${message}"`);
        console.log('Current voice:', this.currentVoice?.name);
        console.log('Speech settings:', this.settings);
        
        // Create speech utterance
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = this.currentVoice;
        utterance.rate = this.settings.rate;
        utterance.pitch = this.settings.pitch;
        utterance.volume = Math.max(0, Math.min(1, volume * this.settings.volume));
        
        console.log('Final utterance volume:', utterance.volume);
        
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
        console.log('Calling speechSynthesis.speak()...');
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
