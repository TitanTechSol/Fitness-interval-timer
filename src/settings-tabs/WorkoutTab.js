// Workout Tab Module - WI-005.4 Phase 3 Migration
class WorkoutTab extends BaseTab {
  constructor() {
    super('workout');
  }

  generateContent() {
    return `
      <div class="setting-group">
        <h3>💪 Workout Settings</h3>
        <p>Workout and message-related settings coming soon...</p>
        <p><em>This page will be properly organized in the next phase.</em></p>
      </div>
    `;
  }

  bindEvents() {
    console.log('WorkoutTab: Placeholder tab - no events to bind');
  }
}
