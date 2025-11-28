// server/src/models/Habit.js
// Overview:
//   Subdocument schema embedded within a User document. Tracks the individual
//   habits a user is maintaining and their completion status.
// Schema requirements:
//   - name: String, required; title of the habit.
//   - color: String; hex or token used to style the habit in the UI.
//   - dateStarted: Date; when the habit was first created.
//   - isComplete: Boolean; marks the habit as done for the current day.
// Virtuals/helpers to implement:
//   - isActive virtual: derived from whether the habit is currently tracked for
//     the day (e.g., could check dateStarted vs. user current day).
//   - streak virtual: calculate current completion streak length.
// Hooks/methods to implement:
//   - Pre-validate hook to ensure name normalization (trim + lowercase).
//   - toggleCompletion(): invert isComplete for the day and update timestamps.
//   - markIncomplete(): set isComplete to false and record when it was cleared.
// Notes:
//   - Export the schema (not a model) for embedding in User.js.
