// Settings Tab Manager - WI-005.2 Tab Manager Foundation
class SettingsTabManager {
  constructor() {
    this.currentTab = 'timer';
    this.registeredTabs = new Map();
    this.isInitialized = false;
    
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
    // Set up navigation button event listeners
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
      const pageId = button.dataset.page;
      if (pageId) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.showTab(pageId);
        });
        
        // Register tab in our system
        this.registerTab(pageId, button);
      }
    });

    console.log(`SettingsTabManager: Navigation setup complete (${navButtons.length} buttons)`);
  }

  showTab(tabId) {
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
      registeredTabs: Array.from(this.registeredTabs.keys())
    });
  }
}
