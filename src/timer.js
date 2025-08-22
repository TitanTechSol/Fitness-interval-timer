// Timer Core Logic
class IntervalTimer {
  constructor() {
    this.totalSec = 10 * 60; // default 10 minutes
    this.remaining = this.totalSec;
    this.timer = null;
    this.isPaused = false;
    
    // Get DOM elements
    this.display = document.getElementById('display');
    this.startBtn = document.getElementById('start');
    this.pauseBtn = document.getElementById('pause');
    this.stopBtn = document.getElementById('stop');
    this.resetBtn = document.getElementById('reset');
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.startBtn.addEventListener('click', () => this.start());
    this.pauseBtn.addEventListener('click', () => this.pause());
    this.stopBtn.addEventListener('click', () => this.stop());
    this.resetBtn.addEventListener('click', () => this.reset());
  }

  start() {
    if (this.timer) return;
    
    // Use appropriate duration mode if starting fresh, otherwise keep current remaining time
    if (this.remaining === this.totalSec) {
      this.totalSec = this.getCurrentDuration();
      this.remaining = this.totalSec;
      this.render();
    }
    
    this.timer = setInterval(() => this.tick(), 1000);
    this.startBtn.disabled = true;
    this.pauseBtn.disabled = false;
  }

  pause() {
    if (!this.timer) return;
    clearInterval(this.timer);
    this.timer = null;
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.remaining = this.totalSec;
    this.render();
    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
  }

  reset() {
    this.stop();
    this.totalSec = this.getCurrentDuration();
    this.remaining = this.totalSec;
    this.render();
  }

  tick() {
    this.remaining--;
    this.render();
    
    if (this.remaining <= 0) {
      this.timer && clearInterval(this.timer);
      this.timer = null;
      this.startBtn.disabled = false;
      this.pauseBtn.disabled = true;
      
      // Trigger completion actions
      this.onTimerComplete();
    }
  }

  render() {
    this.display.textContent = this.formatTime(this.remaining);
  }

  formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    } else {
      return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }
  }

  getCurrentDuration() {
    const settings = window.settingsManager?.getSettings() || {};
    
    if (settings.randomMode) {
      return this.getRandomDuration();
    } else {
      const hours = parseInt(document.getElementById('hours')?.value || 0);
      const minutes = parseInt(document.getElementById('minutes')?.value || 10);
      const seconds = parseInt(document.getElementById('seconds')?.value || 0);
      
      return this.timeToSeconds(hours, minutes, seconds);
    }
  }

  timeToSeconds(hours, minutes, seconds) {
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  getRandomDuration() {
    const settings = window.settingsManager?.getSettings() || {};
    const minSeconds = this.timeToSeconds(
      settings.randomMinHours || 0,
      settings.randomMinMinutes || 7,
      settings.randomMinSeconds || 0
    );
    const maxSeconds = this.timeToSeconds(
      settings.randomMaxHours || 0,
      settings.randomMaxMinutes || 12,
      settings.randomMaxSeconds || 0
    );
    
    const actualMin = Math.max(1, Math.min(minSeconds, maxSeconds));
    const actualMax = Math.max(1, Math.max(minSeconds, maxSeconds));
    
    if (actualMin === actualMax) return actualMax;
    
    return Math.floor(Math.random() * (actualMax - actualMin + 1)) + actualMin;
  }

  onTimerComplete() {
    // Play audio sequence
    window.audioManager?.playSequence();
    
    // Send notification
    window.notificationManager?.send('Timer Complete!', 'Time to take action!');
    
    // Auto-restart if enabled
    const settings = window.settingsManager?.getSettings() || {};
    if (settings.autoRestart) {
      setTimeout(() => {
        this.reset();
        this.start();
      }, 2000);
    }
  }
}

// Export for use in other files
window.IntervalTimer = IntervalTimer;
