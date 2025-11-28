// server/src/models/Challenge.js
// Overview:
//   Mongoose schema representing collaborative habit challenges between users.
//   Tracks challenge metadata, participants, and shared progress metrics.
// Schema requirements:
//   - name: String, required; human-readable challenge label.
//   - dateStarted: Date; when the challenge began.
//   - duration: Number; length of the challenge in days.
//   - participants: Array<ObjectId> referencing User documents taking part.
//   - avgPercentagePerUser: Array<Number>; parallel list tracking each
//     participant's average completion percentage for reporting.
// Virtuals/helpers to implement:
//   - isActive virtual: determine whether challenge is ongoing based on start
//     date and duration.
//   - daysRemaining virtual: compute how many days are left.
// Hooks/methods to implement:
//   - extendDuration(days): add days to the challenge duration for all users.
//   - addParticipant(userId): insert a user reference and default percentage
//     entry; ensure no duplicates.
//   - removeParticipant(userId): drop a user and associated percentage entry.
//   - updateAverages(updates): batch update avgPercentagePerUser values.
// Notes:
//   - Export the compiled mongoose model as `Challenge` for reuse across routes.
//   - Maintain indexes to optimize participant lookups.
