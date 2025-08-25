// Keyboard Shortcuts Manager
class KeyboardShortcutManager {
  constructor(timerManager, settingsManager) {
    this.timerManager = timerManager;
    this.settingsManager = settingsManager;
    this.enabled = settingsManager ? settingsManager.settings.keyboardShortcuts : true;
    this.feedbackTimeout = null;
    
    this.shortcuts = {
      // Primary Timer Controls
      'CtrlShiftF6': { action: 'startResume', description: 'Start/Resume Timer', icon: '▶️' },
      'CtrlShiftF7': { action: 'pause', description: 'Pause Timer', icon: '⏸️' },
      'CtrlShiftF8': { action: 'stop', description: 'Stop Timer', icon: '⏹️' },
      'CtrlShiftF9': { action: 'settings', description: 'Open Settings', icon: '⚙️' },
      
      // Secondary Functions  
      'CtrlShiftF10': { action: 'reset', description: 'Reset Timer', icon: '🔄' },
      'CtrlShiftF11': { action: 'testAudio', description: 'Test Audio', icon: '🔊' },
      'CtrlAltF6': { action: 'toggleAlwaysOnTop', description: 'Toggle Always On Top', icon: '📌' },
      'CtrlAltF7': { action: 'clearMessages', description: 'Clear Messages', icon: '✨' }
    };
    
    this.initializeEventListeners();
    this.createFeedbackElement();
  }

  initializeEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      
      const keyCombo = this.getKeyCombo(e);
      const shortcut = this.shortcuts[keyCombo];
      
      if (shortcut) {
        e.preventDefault();
        e.stopPropagation();
        this.executeAction(shortcut.action, shortcut.description, shortcut.icon);
      }
    });
  }

  getKeyCombo(event) {
    const parts = [];
    
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    
    // Handle function keys
    if (event.code.startsWith('F')) {
      parts.push(event.code);
    }
    
    return parts.join('');
  }

  executeAction(action, description, icon) {
    switch (action) {
      case 'startResume':
        if (this.timerManager.timer) {
          this.timerManager.start(); // Resume if paused
        } else {
          this.timerManager.start(); // Start fresh
        }
        this.showFeedback(`${icon} ${description}`, 'success');
        break;
        
      case 'pause':
        this.timerManager.pause();
        this.showFeedback(`${icon} ${description}`, 'info');
        break;
        
      case 'stop':
        this.timerManager.stop();
        this.showFeedback(`${icon} ${description}`, 'warning');
        break;
        
      case 'reset':
        this.timerManager.reset();
        this.showFeedback(`${icon} ${description}`, 'info');
        break;
        
      case 'settings':
        this.toggleSettings();
        this.showFeedback(`${icon} ${description}`, 'info');
        break;
        
      case 'testAudio':
        this.testAudio();
        this.showFeedback(`${icon} ${description}`, 'success');
        break;
        
      case 'toggleAlwaysOnTop':
        this.toggleAlwaysOnTop();
        this.showFeedback(`${icon} ${description}`, 'info');
        break;
        
      case 'clearMessages':
        this.clearMessages();
        this.showFeedback(`${icon} ${description}`, 'success');
        break;
        
      default:
        console.warn(`Unknown shortcut action: ${action}`);
    }
  }

  toggleSettings() {
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    
    if (mainView.style.display === 'none') {
      // Currently in settings, go back to timer
      mainView.style.display = 'block';
      settingsView.style.display = 'none';
    } else {
      // Currently in timer, open settings
      mainView.style.display = 'none';
      settingsView.style.display = 'block';
    }
  }

  testAudio() {
    // Use the existing speech system to test audio
    if (window.speechManager) {
      window.speechManager.testAudio();
    }
  }

  toggleAlwaysOnTop() {
    // Send message to main process to toggle always on top
    if (window.electronAPI) {
      window.electronAPI.toggleAlwaysOnTop().then(newState => {
        const status = newState ? 'Enabled' : 'Disabled';
        this.showFeedback(`📌 Always On Top ${status}`, newState ? 'success' : 'info');
      }).catch(err => {
        console.error('Failed to toggle always on top:', err);
        this.showFeedback('❌ Failed to toggle Always On Top', 'error');
      });
    } else {
      this.showFeedback('❌ Always On Top not available', 'warning');
    }
  }

  clearMessages() {
    // Clear timer caption messages
    if (window.timerCaptionManager) {
      window.timerCaptionManager.clearMessages();
    }
  }

  createFeedbackElement() {
    // Create feedback toast element
    this.feedbackElement = document.createElement('div');
    this.feedbackElement.className = 'shortcut-feedback';
    this.feedbackElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.3s ease;
      pointer-events: none;
      max-width: 250px;
    `;
    document.body.appendChild(this.feedbackElement);
  }

  showFeedback(message, type = 'info') {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    // Set color based on type
    const colors = {
      success: '#4CAF50',
      info: '#2196F3', 
      warning: '#FF9800',
      error: '#f44336'
    };

    this.feedbackElement.style.background = colors[type] || colors.info;
    this.feedbackElement.textContent = message;
    
    // Show feedback
    this.feedbackElement.style.opacity = '1';
    this.feedbackElement.style.transform = 'translateX(0)';
    
    // Hide after 2 seconds
    this.feedbackTimeout = setTimeout(() => {
      this.feedbackElement.style.opacity = '0';
      this.feedbackElement.style.transform = 'translateX(100px)';
    }, 2000);
  }

  // Settings management
  setEnabled(enabled) {
    this.enabled = enabled;
    this.showFeedback(
      `⌨️ Keyboard Shortcuts ${enabled ? 'Enabled' : 'Disabled'}`, 
      enabled ? 'success' : 'warning'
    );
  }

  getShortcutsList() {
    return Object.entries(this.shortcuts).map(([key, data]) => ({
      key: this.formatKeyCombo(key),
      description: data.description,
      icon: data.icon
    }));
  }

  formatKeyCombo(keyCombo) {
    return keyCombo
      .replace('Ctrl', 'Ctrl+')
      .replace('Alt', 'Alt+')  
      .replace('Shift', 'Shift+')
      .replace(/F(\d+)/, 'F$1');
  }
}

// Export for global use
window.KeyboardShortcutManager = KeyboardShortcutManager;
