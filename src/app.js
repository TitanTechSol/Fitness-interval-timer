// Main Application Entry Point
class FitnessIntervalTimer {
  constructor() {
    this.components = {};
    this.initialize();
  }

  async initialize() {
    console.log('Initializing Fitness Interval Timer...');

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize in the correct order
      this.components.settingsManager = new SettingsManager();
      this.components.settingsTabManager = new SettingsTabManager(); // WI-005.2 addition
      
      // WI-005.4: Register dynamic tabs (parallel to static system)
      this.registerDynamicTabs();
      
      this.components.speechManager = new SpeechManager(); // Changed from AudioManager
      this.components.notificationManager = new NotificationManager();
      this.components.uiManager = new UIManager();
      this.components.messageEditor = new MessageEditorManager(); // Phase 3 addition
      this.components.captionManager = new TimerCaptionManager(); // WI-003 addition
      this.components.timer = new IntervalTimer();
      
      // Initialize keyboard shortcuts after timer (WI-006)
      this.components.keyboardManager = new KeyboardShortcutManager(
        this.components.timer, 
        this.components.settingsManager
      );

      // Make components globally available
      window.settingsManager = this.components.settingsManager;
      window.settingsTabManager = this.components.settingsTabManager; // WI-005.2 global access
      window.speechManager = this.components.speechManager; // Changed from audioManager
      window.audioManager = this.components.speechManager; // Keep compatibility alias
      window.notificationManager = this.components.notificationManager;
      window.uiManager = this.components.uiManager;
      window.messageEditorManager = this.components.messageEditor; // Phase 3 global access
      window.timerCaptionManager = this.components.captionManager; // WI-003 global access (fixed name)
      window.keyboardShortcutManager = this.components.keyboardManager; // WI-006 global access
      window.intervalTimer = this.components.timer;

      console.log('All components initialized successfully');

      // WI-005.4: Register dynamic tabs (parallel to static system)
      this.registerDynamicTabs();

      // Initialize the first render
      this.components.timer.render();

    } catch (error) {
      console.error('Error initializing components:', error);
      this.showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
  }

  registerDynamicTabs() {
    try {
      // Register dynamic tabs with the tab manager (parallel to static system)
      this.components.settingsTabManager.registerDynamicTab('timer', TimerTab);
      
      // Note: Dynamic mode is disabled by default - static system continues to work
      console.log('FitnessIntervalTimer: Dynamic tabs registered (static mode active)');
    } catch (error) {
      console.error('Failed to register dynamic tabs:', error);
      // Don't throw - let the static system continue working
    }
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff4444;
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.innerHTML = `
      <h3>Application Error</h3>
      <p>${message}</p>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: white; color: #ff4444; border: none; border-radius: 4px; cursor: pointer;">
        Refresh Page
      </button>
    `;
    document.body.appendChild(errorDiv);
  }
}

// Start the application
const app = new FitnessIntervalTimer();
