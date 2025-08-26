// UI Management and Navigation
class UIManager {
  constructor() {
    this.currentView = 'main';
    this.currentSettingsPage = 'timer';
    this.initializeNavigation();
  }

  initializeNavigation() {
    // Settings button
    const settingsBtn = document.getElementById('settings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.toggleSettings());
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.toggleSettings());
    }

    // Navigation buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pageId = btn.dataset.page;
        this.showSettingsPage(pageId);
      });
    });

    // Action buttons
    const testAudioBtn = document.getElementById('testAudio');
    if (testAudioBtn) {
      testAudioBtn.addEventListener('click', () => {
        window.speechManager?.testSequence();
      });
    }

    const restoreMessagesBtn = document.getElementById('restoreMessages');
    if (restoreMessagesBtn) {
      restoreMessagesBtn.addEventListener('click', async () => {
        if (confirm('This will restore the original message files and overwrite any custom messages you\'ve created. Continue?')) {
          try {
            const success = await window.speechManager?.restoreOriginalMessages();
            if (success) {
              this.showNotification('✅ Original messages restored successfully!');
            } else {
              alert('Error restoring messages. Please try again.');
            }
          } catch (error) {
            console.error('Error restoring messages:', error);
            alert('Error restoring messages. Please try again.');
          }
        }
      });
    }

    const openSoundsFolderBtn = document.getElementById('openSoundsFolder');
    if (openSoundsFolderBtn) {
      openSoundsFolderBtn.addEventListener('click', async () => {
        if (window.electronAPI) {
          try {
            await window.electronAPI.openSoundsFolder();
          } catch (error) {
            console.error('Error opening sounds folder:', error);
          }
        }
      });
    }
  }

  toggleSettings() {
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    
    if (this.currentView === 'main') {
      mainView.style.display = 'none';
      settingsView.style.display = 'block';
      this.currentView = 'settings';
      
      // Notify SettingsTabManager that settings are opened (WI-005.2)
      if (window.settingsTabManager) {
        window.settingsTabManager.onSettingsOpen();
      }
    } else {
      mainView.style.display = 'block';
      settingsView.style.display = 'none';
      this.currentView = 'main';
    }
  }

  showSettingsPage(pageId) {
    // Use SettingsTabManager if available (WI-005.2), otherwise fallback to legacy behavior
    if (window.settingsTabManager) {
      window.settingsTabManager.showTab(pageId);
    } else {
      // Legacy behavior - Hide all pages
      document.querySelectorAll('.settings-page').forEach(page => {
        page.classList.remove('active');
      });
      
      // Remove active class from all nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Show selected page and activate button
      const targetPage = document.getElementById(pageId + 'Page');
      const targetButton = document.querySelector(`[data-page="${pageId}"]`);
      
      if (targetPage) targetPage.classList.add('active');
      if (targetButton) targetButton.classList.add('active');
    }
    
    // Special handling for shortcuts page (preserve existing functionality)
    if (pageId === 'shortcuts') {
      console.log('Showing shortcuts page - populating shortcuts list');
      try {
        if (typeof this.populateShortcutsList === 'function') {
          this.populateShortcutsList();
        } else {
          console.log('populateShortcutsList method not found, using fallback');
          this.populateShortcutsListFallback();
        }
      } catch (error) {
        console.error('Error populating shortcuts list:', error);
        this.populateShortcutsListFallback();
      }
    }
    
    this.currentSettingsPage = pageId;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 12px 20px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      z-index: 1000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  populateShortcutsList() {
    const shortcutsListElement = document.getElementById('shortcutsList');
    if (!shortcutsListElement) {
      console.log('Shortcuts list element not found!');
      return;
    }

    // Get shortcuts from keyboard manager, with fallback
    let shortcuts;
    if (window.keyboardShortcutManager) {
      shortcuts = window.keyboardShortcutManager.getShortcutsList();
      console.log('Got shortcuts from keyboard manager:', shortcuts);
    } else {
      shortcuts = this.getDefaultShortcuts();
      console.log('Using default shortcuts (keyboard manager not available)');
    }
    
    let html = '';
    shortcuts.forEach(shortcut => {
      html += `
        <div class="shortcut-item">
          <div class="shortcut-key">${shortcut.key}</div>
          <div class="shortcut-description">${shortcut.description}</div>
          <div class="shortcut-icon">${shortcut.icon}</div>
        </div>
      `;
    });

    shortcutsListElement.innerHTML = html;
    console.log('Populated shortcuts list with HTML:', html.length, 'characters');
  }

  getDefaultShortcuts() {
    // Fallback shortcuts list if keyboard manager isn't available
    return [
      { key: 'Ctrl+Shift+F6', description: 'Start/Resume Timer', icon: '▶️' },
      { key: 'Ctrl+Shift+F7', description: 'Pause Timer', icon: '⏸️' },
      { key: 'Ctrl+Shift+F8', description: 'Stop Timer', icon: '⏹️' },
      { key: 'Ctrl+Shift+F9', description: 'Open Settings', icon: '⚙️' },
      { key: 'Ctrl+Shift+F10', description: 'Reset Timer', icon: '🔄' },
      { key: 'Ctrl+Shift+F11', description: 'Test Audio', icon: '🔊' },
      { key: 'Ctrl+Alt+F6', description: 'Toggle Always On Top', icon: '📌' },
      { key: 'Ctrl+Alt+F7', description: 'Clear Messages', icon: '✨' }
    ];
  }

  populateShortcutsListFallback() {
    const shortcutsListElement = document.getElementById('shortcutsList');
    if (!shortcutsListElement) {
      console.log('Shortcuts list element not found!');
      return;
    }

    const shortcuts = this.getDefaultShortcuts();
    console.log('Using fallback method to populate shortcuts');
    
    let html = '';
    shortcuts.forEach(shortcut => {
      html += `
        <div class="shortcut-item">
          <div class="shortcut-key">${shortcut.key}</div>
          <div class="shortcut-description">${shortcut.description}</div>
          <div class="shortcut-icon">${shortcut.icon}</div>
        </div>
      `;
    });

    shortcutsListElement.innerHTML = html;
    console.log('Fallback: Populated shortcuts list with', shortcuts.length, 'shortcuts');
  }
}

// Notification Manager
class NotificationManager {
  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  send(title, body) {
    const settings = window.settingsManager?.getSettings() || {};
    if (!settings.notifications) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: 'icon.png' });
    } else {
      // Fallback to browser notification
      console.log(`Notification: ${title} - ${body}`);
    }
  }
}

// Export for global use
window.UIManager = UIManager;
window.NotificationManager = NotificationManager;
