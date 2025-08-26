// Audio Tab Module - WI-005.4 Phase 3 Migration
class AudioTab extends BaseTab {
  constructor() {
    super('audio');
  }

  generateContent() {
    return `
      <!-- Voice Settings -->
      <div class="setting-group">
        <h3>Voice Settings</h3>
        
        <div class="setting-row">
          <span class="setting-label">Voice</span>
          <select id="voiceSelector" class="theme-select">
            <option value="0">Loading voices...</option>
          </select>
        </div>
        
        <div class="setting-row">
          <span class="setting-label">Speech Speed</span>
          <div class="volume-control">
            <input type="range" id="speechRateSlider" class="volume-slider" min="0.1" max="3" step="0.1" value="1">
            <span id="speechRateDisplay">Normal</span>
          </div>
        </div>
        
        <div class="setting-row">
          <span class="setting-label">Speech Pitch</span>
          <div class="volume-control">
            <input type="range" id="speechPitchSlider" class="volume-slider" min="0" max="2" step="0.1" value="1">
            <span id="speechPitchDisplay">Normal</span>
          </div>
        </div>
        
        <div class="setting-row">
          <span class="setting-label">Test Voice</span>
          <button id="testVoiceBtn" class="audio-buttons">🔊 Test Voice</button>
        </div>
      </div>

      <!-- Message Sequence Configuration -->
      <div class="setting-group">
        <h3>Message Sequence</h3>
        <div class="setting-row">
          <span class="setting-label">Number of Messages</span>
          <select id="audioCountSelector" class="audio-count-selector">
            <option value="1">1 Message</option>
            <option value="2">2 Messages</option>
            <option value="3">3 Messages (Default)</option>
            <option value="4">4 Messages</option>
          </select>
        </div>
        
        <div class="setting-row">
          <span class="setting-label">Test Sequence</span>
          <button id="testAudio" class="audio-buttons">🎵 Test Message Sequence</button>
        </div>
      </div>

      <!-- Message Categories -->
      <div class="setting-group">
        <h3>Message Categories</h3>
        
        <!-- Message Category 1 -->
        <div class="message-category">
          <div class="message-header">
            <div class="drop-zone-header">
              <span class="audio-number">1</span>
              <strong>Check-in Messages</strong>
            </div>
            <button class="test-category-btn" data-audio="1">🔊 Test</button>
          </div>
          <div class="message-preview" id="audio1Preview">
            Loading messages...
          </div>
          <div class="message-actions">
            <button class="edit-messages-btn" data-audio="1">✏️ Edit Messages</button>
            <button class="add-message-btn" data-audio="1">➕ Quick Add</button>
          </div>
        </div>

        <!-- Message Category 2 -->
        <div class="message-category">
          <div class="message-header">
            <div class="drop-zone-header">
              <span class="audio-number">2</span>
              <strong>Action Detection Messages</strong>
            </div>
            <button class="test-category-btn" data-audio="2">🔊 Test</button>
          </div>
          <div class="message-preview" id="audio2Preview">
            Loading messages...
          </div>
          <div class="message-actions">
            <button class="edit-messages-btn" data-audio="2">✏️ Edit Messages</button>
            <button class="add-message-btn" data-audio="2">➕ Quick Add</button>
          </div>
        </div>

        <!-- Message Category 3 -->
        <div class="message-category">
          <div class="message-header">
            <div class="drop-zone-header">
              <span class="audio-number">3</span>
              <strong>Workout Commands</strong>
            </div>
            <button class="test-category-btn" data-audio="3">🔊 Test</button>
          </div>
          <div class="message-preview" id="audio3Preview">
            Loading messages...
          </div>
          <div class="message-actions">
            <button class="edit-messages-btn" data-audio="3">✏️ Edit Messages</button>
            <button class="add-message-btn" data-audio="3">➕ Quick Add</button>
          </div>
        </div>

        <!-- Message Category 4 -->
        <div class="message-category">
          <div class="message-header">
            <div class="drop-zone-header">
              <span class="audio-number">4</span>
              <strong>Custom Messages</strong>
            </div>
            <button class="test-category-btn" data-audio="4">🔊 Test</button>
          </div>
          <div class="message-preview" id="audio4Preview">
            Loading messages...
          </div>
          <div class="message-actions">
            <button class="edit-messages-btn" data-audio="4">✏️ Edit Messages</button>
            <button class="add-message-btn" data-audio="4">➕ Quick Add</button>
          </div>
        </div>
      </div>

      <!-- Advanced Options -->
      <div class="setting-group">
        <h3>Advanced Options</h3>
        <div class="audio-buttons">
          <button id="openSoundsFolder">📁 Open Messages Folder</button>
          <button id="restoreBackup">🔄 Restore Defaults</button>
        </div>
      </div>

      <!-- Quick Tips -->
      <div class="setting-group">
        <h3>💡 Tips</h3>
        <div class="tips-list">
          <div class="tip">
            <span class="tip-icon">📝</span>
            <span><strong>Personalize your messages:</strong> Add your name or specific goals to make them more effective</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🔄</span>
            <span><strong>Vary your tone:</strong> Mix gentle reminders with firm redirections for balanced motivation</span>
          </div>
          <div class="tip">
            <span class="tip-icon">⚡</span>
            <span><strong>Keep messages short:</strong> Clear, concise messages are more impactful than long speeches</span>
          </div>
          <div class="tip">
            <span class="tip-icon">🎯</span>
            <span><strong>Test regularly:</strong> Preview your messages to ensure they sound natural and motivating</span>
          </div>
        </div>
      </div>

      <!-- Audio Actions -->
      <div class="setting-group">
        <h3>Actions</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button id="testAudio">Test Audio Sequence</button>
          <button id="restoreMessages">🔄 Restore Original Messages</button>
          <button id="openSoundsFolder">Open Audio Folder</button>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Audio tab has complex functionality - use the smart preservation approach
    console.log('AudioTab: Binding events for audio/message functionality');
    
    try {
      if (this.contentContainer && this.contentContainer.children.length > 0) {
        console.log('AudioTab: Static content detected - preserving existing functionality');
        
        // The MessageEditor and SpeechManager already handle the audio tab events
        // We preserve the existing functionality
        console.log('AudioTab: Audio controls managed by existing MessageEditor and SpeechManager');
      } else {
        console.log('AudioTab: Dynamic content - need to establish connections');
        
        // For truly dynamic content, we'd need to re-initialize multiple managers
        if (window.messageEditorManager && window.speechManager) {
          setTimeout(() => {
            // Re-establish audio system connections
            console.log('AudioTab: Re-initializing audio system for dynamic content');
          }, 50);
        }
      }
    } catch (error) {
      console.error('AudioTab: Error binding events:', error);
    }
  }
}
