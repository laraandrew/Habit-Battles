// server/src/models/User.js
// Overview:
//   Mongoose schema definition for application users. Describes identity fields,
//   embedded habits, social graph, and challenge participation tracking.
// Schema requirements:
//   - name: String, required; user display name trimmed for readability.
//   - age: Number; optional age metadata for profile context.
//   - habits: Array of Habit subdocuments (see Habit.js) to track each user's
//     rituals and completion state.
//   - friends: Array<ObjectId> references to other users so friend
//     relationships can be formed and queried.
//   - challenges: Array<ObjectId> references to Challenge documents a user is
//     participating in (supports multiple concurrent challenges).
//   - startDay: Date; day the user began using the platform.
//   - currentDay: Date; most recent date the user engaged with the platform.
// Virtuals and helpers to implement:
//   - completionPct virtual: calculate percent of active habits completed for
//     progress dashboards.
//   - friendCount virtual: count of friends for quick social stats.
//   - habitsByColor virtual: group habits by their color for UI filtering.
// Hooks to implement:
//   - Pre-validate hook to prevent duplicate habit names per user (case
//     insensitive, trims whitespace).
//   - Pre-save hook to update currentDay automatically when habits are updated.
// Instance methods to implement:
//   - resetCompletions(): mark all active habits as incomplete for a new day.
//   - addFriend(userId): add another user's ObjectId to friends (no duplicates).
//   - removeFriend(userId): remove an existing friend reference.
//   - attachChallenge(challengeId): add a challenge reference and ensure
//     participant lists are in sync.
//   - detachChallenge(challengeId): remove challenge participation reference.
// Notes:
//   - Export the compiled mongoose model as `User` for reuse across routes.
//   - Ensure timestamps and virtuals are enabled in schema options.
