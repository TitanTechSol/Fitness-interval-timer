// Settings Management
class SettingsManager {
  constructor() {
    this.defaultSettings = {
      // Timer settings
      hours: 0,
      minutes: 10,
      seconds: 0,
      randomMode: false,
      randomMinHours: 0,
      randomMinMinutes: 5,
      randomMinSeconds: 0,
      randomMaxHours: 0,
      randomMaxMinutes: 15,
      randomMaxSeconds: 0,
      
      // Audio settings
      sound: true,
      audioCount: 3,
      volume: 1.0,
      
      // App settings
      theme: 'dark',
      alwaysOnTop: false,
      notifications: true,
      autoRestart: false
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
}

// Export for global use
window.SettingsManager = SettingsManager;
