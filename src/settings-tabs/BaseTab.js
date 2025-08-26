// Base Tab Module - WI-005.4 Foundation
class BaseTab {
  constructor(tabId) {
    this.tabId = tabId;
    this.isInitialized = false;
    this.contentContainer = null;
    this.eventListeners = [];
  }

  // Abstract methods - must be implemented by child classes
  generateContent() {
    throw new Error(`generateContent() must be implemented by ${this.constructor.name}`);
  }

  bindEvents() {
    // Override in child classes if needed
  }

  // Core lifecycle methods
  async initialize(container) {
    if (this.isInitialized) {
      console.warn(`${this.tabId} tab already initialized`);
      return;
    }

    try {
      this.contentContainer = container;
      const content = this.generateContent();
      container.innerHTML = content;
      
      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 10));
      
      this.bindEvents();
      this.isInitialized = true;
      
      console.log(`${this.tabId} tab initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize ${this.tabId} tab:`, error);
      throw error;
    }
  }

  destroy() {
    // Clean up event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];

    // Clear content
    if (this.contentContainer) {
      this.contentContainer.innerHTML = '';
    }

    this.isInitialized = false;
    console.log(`${this.tabId} tab destroyed`);
  }

  // Helper method for safe event binding
  addEventListenerSafe(element, event, handler) {
    if (!element) {
      console.warn(`Cannot add event listener - element not found for ${this.tabId} tab`);
      return;
    }

    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  // Helper method to get elements within this tab's content
  querySelector(selector) {
    if (!this.contentContainer) {
      console.warn(`No container available for ${this.tabId} tab`);
      return null;
    }
    return this.contentContainer.querySelector(selector);
  }

  querySelectorAll(selector) {
    if (!this.contentContainer) {
      console.warn(`No container available for ${this.tabId} tab`);
      return [];
    }
    return this.contentContainer.querySelectorAll(selector);
  }
}
