// Settings Tab Manager - WI-005.2 Tab Manager Foundation
class SettingsTabManager {
  constructor() {
    this.currentTab = 'timer';
    this.registeredTabs = new Map();
    this.isInitialized = false;
    
    // WI-005.4: Dynamic content loading support
    this.dynamicTabs = new Map();
    this.isDynamicModeEnabled = false; // Feature flag for gradual migration
    
    console.log('SettingsTabManager: Constructor initialized');
  }

  initialize() {
    if (this.isInitialized) {
      console.warn('SettingsTabManager: Already initialized');
      return;
    }

    try {
      this.setupNavigation();
      this.isInitialized = true;
      console.log('SettingsTabManager: Successfully initialized');
    } catch (error) {
      console.error('SettingsTabManager: Initialization failed:', error);
      throw error;
    }
  }

  setupNavigation() {
    // WI-005.4 Fix: Don't add duplicate event listeners!
    // UIManager already handles navigation button clicks and calls our showTab() method
    // Adding our own listeners creates duplicate tab switching
    
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Just register the tabs without adding duplicate event listeners
    navButtons.forEach(button => {
      const pageId = button.dataset.page;
      if (pageId) {
        // Register tab in our system (no event listener needed)
        this.registerTab(pageId, button);
      }
    });

    console.log(`SettingsTabManager: Navigation registered (${navButtons.length} buttons) - UIManager handles clicks`);
  }

  async showTab(tabId) {
    if (!tabId) {
      console.warn('SettingsTabManager: No tab ID provided');
      return;
    }

    try {
      // Hide all pages
      document.querySelectorAll('.settings-page').forEach(page => {
        page.classList.remove('active');
      });

      // Show target page
      const targetPage = document.getElementById(tabId + 'Page');
      if (targetPage) {
        // WI-005.4: Check if dynamic mode is enabled for this specific tab
        if (this.isDynamicModeEnabled && this.dynamicTabs.has(tabId)) {
          console.log(`SettingsTabManager: Loading dynamic content for '${tabId}' tab`);
          const success = await this.loadDynamicTab(tabId);
          
          if (!success) {
            console.warn(`SettingsTabManager: Dynamic loading failed for '${tabId}', keeping static content`);
          }
        }
        
        targetPage.classList.add('active');
        this.currentTab = tabId;
        this.updateActiveNavigation(tabId);
        console.log(`SettingsTabManager: Switched to tab '${tabId}'`);
      } else {
        console.warn(`SettingsTabManager: Page '${tabId}Page' not found`);
      }
    } catch (error) {
      console.error('SettingsTabManager: Error switching tabs:', error);
    }
  }

  updateActiveNavigation(activeTabId) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to current button
    const activeButton = document.querySelector(`[data-page="${activeTabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  registerTab(tabId, buttonElement) {
    this.registeredTabs.set(tabId, {
      id: tabId,
      button: buttonElement,
      registered: new Date()
    });
  }

  onSettingsOpen() {
    // Called when settings modal is opened
    if (!this.isInitialized) {
      this.initialize();
    }
    
    // Show default tab (timer)
    this.showTab('timer');
    console.log('SettingsTabManager: Settings opened, showing default tab');
  }

  debugState() {
    console.log('SettingsTabManager Debug State:', {
      currentTab: this.currentTab,
      isInitialized: this.isInitialized,
      registeredTabs: Array.from(this.registeredTabs.keys()),
      dynamicTabs: Array.from(this.dynamicTabs.keys()),
      isDynamicModeEnabled: this.isDynamicModeEnabled
    });
  }

  // WI-005.4: Dynamic tab management methods
  registerDynamicTab(tabId, tabModuleClass) {
    if (!tabModuleClass) {
      console.error(`Cannot register dynamic tab '${tabId}' - no module class provided`);
      return false;
    }

    this.dynamicTabs.set(tabId, {
      moduleClass: tabModuleClass,
      instance: null,
      isLoaded: false
    });

    console.log(`SettingsTabManager: Dynamic tab '${tabId}' registered`);
    return true;
  }

  async loadDynamicTab(tabId) {
    const tabInfo = this.dynamicTabs.get(tabId);
    if (!tabInfo) {
      console.warn(`Dynamic tab '${tabId}' not registered`);
      return false;
    }

    try {
      // Check if already loaded to prevent multiple initializations
      if (tabInfo.isLoaded) {
        console.log(`Dynamic tab '${tabId}' already loaded, skipping`);
        return true;
      }

      // Create instance if not already created
      if (!tabInfo.instance) {
        tabInfo.instance = new tabInfo.moduleClass();
      }

      // Find the content container
      const container = document.getElementById(tabId + 'Page');
      if (!container) {
        console.error(`Container '${tabId}Page' not found for dynamic tab`);
        return false;
      }

      // Initialize the tab content
      await tabInfo.instance.initialize(container);
      tabInfo.isLoaded = true;

      console.log(`SettingsTabManager: Dynamic tab '${tabId}' loaded successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to load dynamic tab '${tabId}':`, error);
      return false;
    }
  }

  enableDynamicMode() {
    this.isDynamicModeEnabled = true;
    console.log('SettingsTabManager: Dynamic mode enabled');
  }

  disableDynamicMode() {
    this.isDynamicModeEnabled = false;
    console.log('SettingsTabManager: Dynamic mode disabled - using static content');
  }

  // WI-005.4 Phase 2: Enable dynamic mode for specific tabs only (safe testing)
  enableDynamicForTab(tabId) {
    if (!this.dynamicTabs.has(tabId)) {
      console.warn(`Cannot enable dynamic mode for '${tabId}' - tab not registered`);
      return false;
    }
    
    // Enable global dynamic mode if not already enabled
    if (!this.isDynamicModeEnabled) {
      this.enableDynamicMode();
    }
    
    console.log(`SettingsTabManager: Dynamic mode enabled for '${tabId}' tab`);
    return true;
  }

  // Reset dynamic tab loading state (for testing/debugging)
  resetDynamicTab(tabId) {
    const tabInfo = this.dynamicTabs.get(tabId);
    if (tabInfo) {
      tabInfo.isLoaded = false;
      if (tabInfo.instance) {
        tabInfo.instance.destroy();
      }
      console.log(`SettingsTabManager: Reset dynamic tab '${tabId}'`);
    }
  }
}
