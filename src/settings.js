// Settings Management
class SettingsManager {
  constructor() {
    this.defaultSettings = {
      // Timer settings
      hours: 0,
      minutes: 10,
      seconds: 0,
      randomMode: true, // Enable random mode by default
      randomMinHours: 0,
      randomMinMinutes: 7, // 7 minutes minimum
      randomMinSeconds: 0,
      randomMaxHours: 0,
      randomMaxMinutes: 12, // 12 minutes maximum
      randomMaxSeconds: 0,
      
      // Audio/Speech settings
      sound: true,
      audioCount: 3,
      volume: 1.0,
      
      // TTS settings
      speechRate: 1.0,      // Speed (0.1 - 10)
      speechPitch: 1.0,     // Pitch (0 - 2)  
      speechVoice: 0,       // Voice index
      
      // App settings
      theme: 'dark',
      alwaysOnTop: false,
      notifications: true,
      autoRestart: true // Enable auto-restart by default
    };
    
    this.settings = this.loadSettings();
    this.initializeUI();
    this.setupEventListeners();
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('intervalTimerSettings');
      return saved ? { ...this.defaultSettings, ...JSON.parse(saved) } : { ...this.defaultSettings };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { ...this.defaultSettings };
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('intervalTimerSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettingChange(key, value);
  }

  initializeUI() {
    // Apply theme
    this.applyTheme(this.settings.theme);
    
    // Set input values
    const hoursInput = document.getElementById('hours');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    
    if (hoursInput) hoursInput.value = this.settings.hours;
    if (minutesInput) minutesInput.value = this.settings.minutes;
    if (secondsInput) secondsInput.value = this.settings.seconds;
    
    // Set random range values
    const randomInputs = [
      'randomMinHours', 'randomMinMinutes', 'randomMinSeconds',
      'randomMaxHours', 'randomMaxMinutes', 'randomMaxSeconds'
    ];
    
    randomInputs.forEach(inputId => {
      const element = document.getElementById(inputId);
      if (element) element.value = this.settings[inputId];
    });
    
    // Set slider switches
    this.updateSliderSwitch('randomModeSwitch', this.settings.randomMode);
    this.updateSliderSwitch('soundSwitch', this.settings.sound);
    this.updateSliderSwitch('notifySwitch', this.settings.notifications);
    this.updateSliderSwitch('alwaysOnTopSwitch', this.settings.alwaysOnTop);
    this.updateSliderSwitch('autoRestartSwitch', this.settings.autoRestart);
    
    // Set volume
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeDisplay = document.getElementById('volumeDisplay');
    if (volumeSlider) {
      volumeSlider.value = this.settings.volume * 100;
      if (volumeDisplay) volumeDisplay.textContent = `${Math.round(this.settings.volume * 100)}%`;
    }
    
    // Set theme selector
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) themeSelector.value = this.settings.theme;
    
    // Set audio count
    const audioCountSelector = document.getElementById('audioCountSelector');
    if (audioCountSelector) audioCountSelector.value = this.settings.audioCount;
    
    // Show/hide random range inputs
    const randomRangeInputs = document.getElementById('randomRangeInputs');
    if (randomRangeInputs) {
      if (this.settings.randomMode) {
        randomRangeInputs.classList.add('show');
      } else {
        randomRangeInputs.classList.remove('show');
      }
    }
  }

  setupEventListeners() {
    // Time inputs
    ['hours', 'minutes', 'seconds'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', (e) => {
          this.updateSetting(id, parseInt(e.target.value) || 0);
        });
      }
    });

    // Random range inputs
    const randomInputs = [
      'randomMinHours', 'randomMinMinutes', 'randomMinSeconds',
      'randomMaxHours', 'randomMaxMinutes', 'randomMaxSeconds'
    ];
    
    randomInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', (e) => {
          this.updateSetting(id, parseInt(e.target.value) || 0);
        });
      }
    });

    // Slider switches
    this.setupSliderSwitch('randomModeSwitch', 'randomMode');
    this.setupSliderSwitch('soundSwitch', 'sound');
    this.setupSliderSwitch('notifySwitch', 'notifications');
    this.setupSliderSwitch('alwaysOnTopSwitch', 'alwaysOnTop');
    this.setupSliderSwitch('autoRestartSwitch', 'autoRestart');

    // Volume slider
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const volume = parseFloat(e.target.value) / 100;
        this.updateSetting('volume', volume);
        
        const volumeDisplay = document.getElementById('volumeDisplay');
        if (volumeDisplay) volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
      });
    }

    // Theme selector
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        this.updateSetting('theme', e.target.value);
      });
    }

    // Audio count selector
    const audioCountSelector = document.getElementById('audioCountSelector');
    if (audioCountSelector) {
      audioCountSelector.addEventListener('change', (e) => {
        this.updateSetting('audioCount', parseInt(e.target.value));
      });
    }

    // Speech controls
    this.setupSpeechControls();
  }

  setupSpeechControls() {
    // Voice selector
    const voiceSelector = document.getElementById('voiceSelector');
    if (voiceSelector) {
      voiceSelector.addEventListener('change', (e) => {
        this.updateSetting('speechVoice', parseInt(e.target.value));
        // Update speech manager
        if (window.speechManager) {
          window.speechManager.setVoice(parseInt(e.target.value));
        }
      });
    }

    // Speech rate slider
    const speechRateSlider = document.getElementById('speechRateSlider');
    if (speechRateSlider) {
      speechRateSlider.addEventListener('input', (e) => {
        const rate = parseFloat(e.target.value);
        this.updateSetting('speechRate', rate);
        
        // Update display
        const display = document.getElementById('speechRateDisplay');
        if (display) {
          if (rate < 0.8) display.textContent = 'Slow';
          else if (rate > 1.5) display.textContent = 'Fast';
          else display.textContent = 'Normal';
        }
        
        // Update speech manager
        if (window.speechManager) {
          window.speechManager.updateSettings({ rate });
        }
      });
    }

    // Speech pitch slider
    const speechPitchSlider = document.getElementById('speechPitchSlider');
    if (speechPitchSlider) {
      speechPitchSlider.addEventListener('input', (e) => {
        const pitch = parseFloat(e.target.value);
        this.updateSetting('speechPitch', pitch);
        
        // Update display
        const display = document.getElementById('speechPitchDisplay');
        if (display) {
          if (pitch < 0.8) display.textContent = 'Low';
          else if (pitch > 1.3) display.textContent = 'High';
          else display.textContent = 'Normal';
        }
        
        // Update speech manager
        if (window.speechManager) {
          window.speechManager.updateSettings({ pitch });
        }
      });
    }

    // Test voice button
    const testVoiceBtn = document.getElementById('testVoiceBtn');
    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => {
        if (window.speechManager) {
          window.speechManager.speak(1, 1.0); // Test with Audio 1 message
        }
      });
    }

    // Test category buttons
    const testCategoryBtns = document.querySelectorAll('.test-category-btn');
    testCategoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audioNumber = parseInt(e.target.dataset.audio);
        if (window.speechManager) {
          window.speechManager.testMessage(audioNumber);
        }
      });
    });

    // Initialize voice selector with available voices
    setTimeout(() => {
      this.populateVoiceSelector();
      this.updateMessagePreviews();
    }, 1000); // Give time for voices to load
  }

  setupSliderSwitch(elementId, settingKey) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('click', () => {
        const newValue = !this.settings[settingKey];
        this.updateSetting(settingKey, newValue);
        this.updateSliderSwitch(elementId, newValue);
      });
    }
  }

  updateSliderSwitch(elementId, isActive) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.toggle('active', isActive);
    }
  }

  applySettingChange(key, value) {
    switch (key) {
      case 'theme':
        this.applyTheme(value);
        break;
        
      case 'alwaysOnTop':
        if (window.electronAPI) {
          window.electronAPI.setAlwaysOnTop(value);
        }
        break;
        
      case 'randomMode':
        const randomRangeInputs = document.getElementById('randomRangeInputs');
        if (randomRangeInputs) {
          if (value) {
            randomRangeInputs.classList.add('show');
          } else {
            randomRangeInputs.classList.remove('show');
          }
        }
        break;
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  populateVoiceSelector() {
    const voiceSelector = document.getElementById('voiceSelector');
    if (!voiceSelector || !window.speechManager) return;

    const voices = window.speechManager.getAvailableVoices();
    voiceSelector.innerHTML = '';

    voices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.index;
      option.textContent = `${voice.name} (${voice.lang})`;
      if (voice.isDefault) option.selected = true;
      voiceSelector.appendChild(option);
    });
  }

  updateMessagePreviews() {
    if (!window.speechManager) return;

    const messages = window.speechManager.messages;
    
    for (let i = 1; i <= 4; i++) {
      const preview = document.getElementById(`audio${i}Preview`);
      if (preview) {
        const audioKey = `audio${i}`;
        const messageList = messages[audioKey];
        
        if (messageList && messageList.length > 0) {
          preview.textContent = `${messageList.length} messages: "${messageList[0]}"${messageList.length > 1 ? ` and ${messageList.length - 1} more...` : ''}`;
        } else {
          preview.textContent = 'No messages loaded';
        }
      }
    }
  }
}

// Export for global use
window.SettingsManager = SettingsManager;
