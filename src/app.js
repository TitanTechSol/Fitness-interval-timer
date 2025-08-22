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
      this.components.audioManager = new AudioManager();
      this.components.notificationManager = new NotificationManager();
      this.components.uiManager = new UIManager();
      this.components.timer = new IntervalTimer();

      // Make components globally available
      window.settingsManager = this.components.settingsManager;
      window.audioManager = this.components.audioManager;
      window.notificationManager = this.components.notificationManager;
      window.uiManager = this.components.uiManager;
      window.intervalTimer = this.components.timer;

      console.log('All components initialized successfully');

      // Initialize the first render
      this.components.timer.render();

    } catch (error) {
      console.error('Error initializing components:', error);
      this.showErrorMessage('Failed to initialize application. Please refresh the page.');
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
