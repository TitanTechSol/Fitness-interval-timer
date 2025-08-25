// Timer Caption Manager
class TimerCaptionManager {
  constructor() {
    this.captionElement = document.getElementById('timerCaption');
    this.messagesElement = document.getElementById('captionMessages');
    this.fadeTimeout = null;
    this.currentMessages = [];
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Click caption area to dismiss
    this.captionElement?.addEventListener('click', (e) => {
      if (e.target === this.captionElement) {
        this.clearMessages();
      }
    });
  }

  showMessages(messages) {
    if (!messages || messages.length === 0) return;
    
    this.currentMessages = messages;
    this.renderMessages();
    this.showCaption();
    this.startFadeTimer();
  }

  renderMessages() {
    if (!this.messagesElement) return;
    
    let html = '';
    this.currentMessages.forEach((message, index) => {
      html += `<span class="message-sequence">
        <span class="message-text">${this.escapeHtml(message)}</span>
      </span>`;
      
      // Add appropriate punctuation between messages
      if (index < this.currentMessages.length - 1) {
        // Add comma before the third message (index 2), otherwise just space
        if (index === 1 && this.currentMessages.length > 2) {
          html += ', ';
        } else {
          html += ' ';
        }
      }
    });
    
    this.messagesElement.innerHTML = html;
  }

  showCaption() {
    if (!this.captionElement) return;
    
    this.captionElement.classList.remove('hidden', 'fade-out');
  }

  clearMessages() {
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }
    
    this.hideCaption();
    this.currentMessages = [];
  }

  hideCaption() {
    if (!this.captionElement) return;
    
    this.captionElement.classList.add('fade-out');
    
    // After fade transition completes, add hidden class
    setTimeout(() => {
      this.captionElement.classList.add('hidden');
      this.captionElement.classList.remove('fade-out');
      if (this.messagesElement) {
        this.messagesElement.innerHTML = '';
      }
    }, 500); // Match CSS transition duration
  }

  startFadeTimer() {
    // Clear any existing timer
    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
    }
    
    // Auto-fade after 30 seconds
    this.fadeTimeout = setTimeout(() => {
      this.clearMessages();
    }, 30000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for global use
window.TimerCaptionManager = TimerCaptionManager;
