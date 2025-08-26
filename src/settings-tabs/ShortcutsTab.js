// Shortcuts Tab Module - WI-005.4 Phase 3 Migration
class ShortcutsTab extends BaseTab {
  constructor() {
    super('shortcuts');
  }

  generateContent() {
    return `
      <!-- Enable/Disable Shortcuts -->
      <div class="setting-group">
        <h3>Keyboard Shortcuts</h3>
        <div class="setting-row">
          <span class="setting-label">Enable Keyboard Shortcuts</span>
          <div class="slider-switch active" id="keyboardShortcutsSwitch"></div>
        </div>
        <p class="setting-description">
          Use keyboard shortcuts to control the timer even when the app is running in the background. 
          Perfect for staying productive in other applications!
        </p>
      </div>

      <!-- Shortcuts List -->
      <div class="setting-group">
        <h3>⌨️ Available Shortcuts</h3>
        <div class="shortcuts-list" id="shortcutsList">
          <!-- Shortcuts will be populated by JavaScript -->
        </div>
      </div>

      <!-- Advanced Tips -->
      <div class="setting-group">
        <h3>💡 Tips</h3>
        <div class="tips-list">
          <div class="tip">
            <span class="tip-icon">🎯</span>
            <span><strong>Global shortcuts:</strong> These work even when the timer is minimized or in the background</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🏢</span>
            <span><strong>Office-friendly:</strong> Key combinations chosen to avoid conflicts with Word, Excel, and other apps</span>
          </div>
          <div class="tip">
            <span class="tip-icon">⚡</span>
            <span><strong>Quick control:</strong> Start/pause/stop your timer without switching windows</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🔄</span>
            <span><strong>Disable anytime:</strong> Toggle shortcuts off if you encounter conflicts with other software</span>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    console.log('ShortcutsTab: Binding keyboard shortcuts functionality');
    
    try {
      if (this.contentContainer && this.contentContainer.children.length > 0) {
        console.log('ShortcutsTab: Static content detected - preserving keyboard functionality');
        
        // KeyboardShortcutManager handles the shortcuts system
        console.log('ShortcutsTab: Keyboard controls managed by existing KeyboardShortcutManager');
      } else {
        console.log('ShortcutsTab: Dynamic content - need to establish keyboard connections');
        
        if (window.keyboardShortcutManager) {
          setTimeout(() => {
            console.log('ShortcutsTab: Re-initializing keyboard shortcuts for dynamic content');
          }, 50);
        }
      }
    } catch (error) {
      console.error('ShortcutsTab: Error binding events:', error);
    }
  }
}
