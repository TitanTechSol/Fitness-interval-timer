// Timer Tab Module - WI-005.4 Dynamic Content
class TimerTab extends BaseTab {
  constructor() {
    super('timer');
  }

  generateContent() {
    return `
      <!-- Time Configuration -->
      <div class="setting-group">
        <h3>Duration</h3>
        <div class="setting-row">
          <span class="setting-label">Set Time</span>
          <div class="time-inputs">
            <input type="number" id="hours" class="time-input" min="0" max="23" value="0" placeholder="HH">
            <span>:</span>
            <input type="number" id="minutes" class="time-input" min="0" max="59" value="10" placeholder="MM">
            <span>:</span>
            <input type="number" id="seconds" class="time-input" min="0" max="59" value="0" placeholder="SS">
          </div>
        </div>
      </div>

      <!-- Random Mode -->
      <div class="setting-group">
        <h3>Random Mode</h3>
        <div class="setting-row">
          <span class="setting-label">Enable Random Intervals</span>
          <div class="slider-switch" id="randomModeSwitch"></div>
        </div>
        
        <div class="random-range-inputs" id="randomRangeInputs">
          <div class="range-group">
            <label>Minimum</label>
            <div class="time-inputs">
              <input type="number" id="randomMinHours" class="time-input" min="0" max="23" value="0">
              <span>:</span>
              <input type="number" id="randomMinMinutes" class="time-input" min="0" max="59" value="5">
              <span>:</span>
              <input type="number" id="randomMinSeconds" class="time-input" min="0" max="59" value="0">
            </div>
          </div>
          <div class="range-group">
            <label>Maximum</label>
            <div class="time-inputs">
              <input type="number" id="randomMaxHours" class="time-input" min="0" max="23" value="0">
              <span>:</span>
              <input type="number" id="randomMaxMinutes" class="time-input" min="0" max="59" value="15">
              <span>:</span>
              <input type="number" id="randomMaxSeconds" class="time-input" min="0" max="59" value="0">
            </div>
          </div>
        </div>
      </div>

      <!-- Other Settings -->
      <div class="setting-group">
        <h3>Preferences</h3>
        <div class="setting-row">
          <span class="setting-label">Sound Notifications</span>
          <div class="slider-switch active" id="soundSwitch"></div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Auto-restart Timer</span>
          <div class="slider-switch" id="autoRestartSwitch"></div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Desktop Notifications</span>
          <div class="slider-switch active" id="notifySwitch"></div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Always on Top</span>
          <div class="slider-switch" id="alwaysOnTopSwitch"></div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Volume</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="range" id="volumeSlider" class="volume-slider" min="0" max="100" value="100">
            <span id="volumeDisplay">100%</span>
          </div>
        </div>
        <div class="setting-row">
          <span class="setting-label">Theme</span>
          <select id="themeSelector" class="theme-selector">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>
      </div>

      <!-- Reset Options -->
      <div class="setting-group">
        <h3>Reset Options</h3>
        <div class="reset-buttons">
          <button id="resetTimer">Reset Timer Settings</button>
          <button id="resetAll">Reset All Settings</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // WI-005.4 SMART APPROACH: Work with existing system, don't replace it
    console.log('TimerTab: Binding events for dynamic content (preserving existing functionality)');
    
    try {
      // If we're using existing static content, the event bindings already work!
      // We can add additional dynamic functionality here if needed
      
      if (this.contentContainer && this.contentContainer.children.length > 0) {
        console.log('TimerTab: Static content detected - event bindings already work');
        
        // Optional: Add any additional dynamic functionality here
        // For example, we could add enhanced features that aren't in the static version
        
        console.log('TimerTab: Successfully initialized with existing static content');
      } else {
        console.log('TimerTab: No existing content - need to establish SettingsManager connections');
        
        // This path is for when we truly have dynamic content
        if (window.settingsManager) {
          setTimeout(() => {
            window.settingsManager.initializeUI();
            window.settingsManager.loadSettings();
            console.log('TimerTab: Re-initialized SettingsManager for dynamic content');
          }, 50);
        }
      }
    } catch (error) {
      console.error('TimerTab: Error binding events:', error);
    }
  }
}
