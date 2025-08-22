// Message Editor and Management
class MessageEditorManager {
  constructor() {
    this.currentCategory = null;
    this.currentAudioNumber = null;
    this.categoryNames = {
      1: 'Check-in Messages',
      2: 'Motivation Messages', 
      3: 'Punishment Messages',
      4: 'Encouragement Messages'
    };
    this.exampleMessages = {
      1: [
        "What are you doing right now?",
        "Time to check in!",
        "Quick focus check!",
        "Are you on track?",
        "How's your progress?"
      ],
      2: [
        "Get back to work!",
        "Focus on your goals!",
        "You can do this!",
        "Stay productive!",
        "Push through!"
      ],
      3: [
        "Seriously? Again?",
        "You're better than this!",
        "No excuses!",
        "Stop wasting time!",
        "Focus now!"
      ],
      4: [
        "Great job!",
        "Keep it up!",
        "You're doing amazing!",
        "Stay strong!",
        "Almost there!"
      ]
    };
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Edit message buttons
    document.querySelectorAll('.edit-messages-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audioNumber = parseInt(e.target.dataset.audio);
        this.openEditor(audioNumber);
      });
    });

    // Quick add buttons
    document.querySelectorAll('.add-message-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const audioNumber = parseInt(e.target.dataset.audio);
        this.openQuickAdd(audioNumber);
      });
    });

    // Modal event listeners
    this.setupModalListeners();
  }

  setupModalListeners() {
    // Message Editor Modal
    const messageEditorModal = document.getElementById('messageEditorModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveMessages = document.getElementById('saveMessages');
    const testMessages = document.getElementById('testMessages');
    const messageEditor = document.getElementById('messageEditor');

    closeModal?.addEventListener('click', () => this.closeEditor());
    cancelEdit?.addEventListener('click', () => this.closeEditor());
    saveMessages?.addEventListener('click', () => this.saveMessages());
    testMessages?.addEventListener('click', () => this.testCurrentMessages());

    // Update stats as user types
    messageEditor?.addEventListener('input', () => this.updateMessageStats());

    // Quick Add Modal
    const quickAddModal = document.getElementById('quickAddModal');
    const closeQuickAdd = document.getElementById('closeQuickAdd');
    const cancelQuickAdd = document.getElementById('cancelQuickAdd');
    const saveQuickAdd = document.getElementById('saveQuickAdd');
    const testQuickAdd = document.getElementById('testQuickAdd');
    const quickAddInput = document.getElementById('quickAddInput');

    closeQuickAdd?.addEventListener('click', () => this.closeQuickAdd());
    cancelQuickAdd?.addEventListener('click', () => this.closeQuickAdd());
    saveQuickAdd?.addEventListener('click', () => this.saveQuickAddMessage());
    testQuickAdd?.addEventListener('click', () => this.testQuickAddMessage());

    // Enter key in quick add
    quickAddInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveQuickAddMessage();
      }
    });

    // Close modal when clicking outside
    messageEditorModal?.addEventListener('click', (e) => {
      if (e.target === messageEditorModal) this.closeEditor();
    });

    quickAddModal?.addEventListener('click', (e) => {
      if (e.target === quickAddModal) this.closeQuickAdd();
    });
  }

  openEditor(audioNumber) {
    this.currentAudioNumber = audioNumber;
    this.currentCategory = this.categoryNames[audioNumber];

    const modal = document.getElementById('messageEditorModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const messageEditor = document.getElementById('messageEditor');

    // Set modal content
    modalTitle.textContent = `Edit ${this.currentCategory}`;
    modalCategory.textContent = this.currentCategory;

    // Load current messages
    if (window.speechManager && window.speechManager.messages[`audio${audioNumber}`]) {
      const messages = window.speechManager.messages[`audio${audioNumber}`];
      messageEditor.value = messages.join('\n');
    } else {
      messageEditor.value = '';
    }

    // Show modal
    modal.classList.add('show');
    messageEditor.focus();

    // Update stats
    this.updateMessageStats();
  }

  openQuickAdd(audioNumber) {
    this.currentAudioNumber = audioNumber;
    this.currentCategory = this.categoryNames[audioNumber];

    const modal = document.getElementById('quickAddModal');
    const quickAddCategory = document.getElementById('quickAddCategory');
    const quickAddInput = document.getElementById('quickAddInput');
    const exampleButtons = document.getElementById('exampleButtons');

    // Set modal content
    quickAddCategory.textContent = this.currentCategory;
    quickAddInput.value = '';

    // Add example buttons
    exampleButtons.innerHTML = '';
    this.exampleMessages[audioNumber].forEach(example => {
      const btn = document.createElement('button');
      btn.className = 'example-btn';
      btn.textContent = example;
      btn.addEventListener('click', () => {
        quickAddInput.value = example;
        quickAddInput.focus();
      });
      exampleButtons.appendChild(btn);
    });

    // Show modal
    modal.classList.add('show');
    quickAddInput.focus();
  }

  closeEditor() {
    const modal = document.getElementById('messageEditorModal');
    modal.classList.remove('show');
    this.currentCategory = null;
    this.currentAudioNumber = null;
  }

  closeQuickAdd() {
    const modal = document.getElementById('quickAddModal');
    modal.classList.remove('show');
    this.currentCategory = null;
    this.currentAudioNumber = null;
  }

  updateMessageStats() {
    const messageEditor = document.getElementById('messageEditor');
    const messageCount = document.getElementById('messageCount');
    const characterCount = document.getElementById('characterCount');

    const text = messageEditor.value;
    const messages = text.split('\n').filter(line => line.trim().length > 0);
    
    messageCount.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;
    characterCount.textContent = `${text.length} characters`;
  }

  async saveMessages() {
    if (!this.currentAudioNumber) return;

    const messageEditor = document.getElementById('messageEditor');
    const text = messageEditor.value;
    
    // Parse messages (one per line, filter empty lines)
    const messages = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (messages.length === 0) {
      alert('Please add at least one message!');
      return;
    }

    try {
      // Save to file
      const content = `# ${this.currentCategory}\n\n${messages.join('\n')}`;
      const result = await window.electronAPI?.saveTextFile(content, `Audio${this.currentAudioNumber}.md`, this.currentAudioNumber);
      
      if (!result || !result.success) {
        throw new Error('Failed to save file');
      }

      // Update speech manager
      if (window.speechManager) {
        window.speechManager.messages[`audio${this.currentAudioNumber}`] = messages;
        console.log(`Updated Audio${this.currentAudioNumber} with ${messages.length} messages`);
      }

      // Update UI preview
      this.updateMessagePreview(this.currentAudioNumber, messages);

      // Show success and close
      this.showNotification(`✅ Saved ${messages.length} messages to ${this.currentCategory}`);
      this.closeEditor();

    } catch (error) {
      console.error('Error saving messages:', error);
      alert('Error saving messages. Please try again.');
    }
  }

  async saveQuickAddMessage() {
    if (!this.currentAudioNumber) return;

    const quickAddInput = document.getElementById('quickAddInput');
    const newMessage = quickAddInput.value.trim();

    if (!newMessage) {
      alert('Please enter a message!');
      return;
    }

    try {
      // Get current messages
      const currentMessages = window.speechManager?.messages[`audio${this.currentAudioNumber}`] || [];
      
      // Add new message
      const updatedMessages = [...currentMessages, newMessage];
      
      // Save to file
      const content = `# ${this.currentCategory}\n\n${updatedMessages.join('\n')}`;
      const result = await window.electronAPI?.saveTextFile(content, `Audio${this.currentAudioNumber}.md`, this.currentAudioNumber);
      
      if (!result || !result.success) {
        throw new Error('Failed to save file');
      }

      // Update speech manager
      if (window.speechManager) {
        window.speechManager.messages[`audio${this.currentAudioNumber}`] = updatedMessages;
      }

      // Update UI preview
      this.updateMessagePreview(this.currentAudioNumber, updatedMessages);

      // Show success and close
      this.showNotification(`✅ Added "${newMessage}" to ${this.currentCategory}`);
      this.closeQuickAdd();

    } catch (error) {
      console.error('Error adding message:', error);
      alert('Error adding message. Please try again.');
    }
  }

  testCurrentMessages() {
    if (!this.currentAudioNumber) return;

    const messageEditor = document.getElementById('messageEditor');
    const text = messageEditor.value;
    const messages = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (messages.length === 0) {
      alert('No messages to test!');
      return;
    }

    // Test random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (window.speechManager) {
      // Temporarily create utterance with current message
      const utterance = new SpeechSynthesisUtterance(randomMessage);
      utterance.voice = window.speechManager.currentVoice;
      utterance.rate = window.speechManager.settings.rate;
      utterance.pitch = window.speechManager.settings.pitch;
      utterance.volume = window.speechManager.settings.volume;
      speechSynthesis.speak(utterance);
      
      console.log(`Testing message: "${randomMessage}"`);
    }
  }

  testQuickAddMessage() {
    const quickAddInput = document.getElementById('quickAddInput');
    const message = quickAddInput.value.trim();

    if (!message) {
      alert('Please enter a message to test!');
      return;
    }

    if (window.speechManager) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = window.speechManager.currentVoice;
      utterance.rate = window.speechManager.settings.rate;
      utterance.pitch = window.speechManager.settings.pitch;
      utterance.volume = window.speechManager.settings.volume;
      speechSynthesis.speak(utterance);
    }
  }

  updateMessagePreview(audioNumber, messages) {
    const preview = document.getElementById(`audio${audioNumber}Preview`);
    if (preview && messages.length > 0) {
      preview.textContent = `${messages.length} messages: "${messages[0]}"${messages.length > 1 ? ` and ${messages.length - 1} more...` : ''}`;
    }
  }

  showNotification(message) {
    // Use existing UI manager notification system
    if (window.uiManager) {
      window.uiManager.showNotification(message);
    } else {
      console.log(message);
    }
  }
}

// Export for global use
window.MessageEditorManager = MessageEditorManager;
