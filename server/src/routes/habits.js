// server/src/routes/habits.js
// Overview:
//   Express router focused on habit operations when addressed directly rather
//   than through the parent user resource.
// Expected routes to implement:
//   - GET /habits                : list all habits across users (global view).
//   - GET /users/:id/habits      : retrieve a specific user's habits.
//   - PATCH /users/:id/habits/:hid/complete : mark a habit complete for the day.
//   - POST /users/:id/habits     : create a new habit for a user with name, color,
//                                  and dateStarted fields.
//   - DELETE /users/:id/habits/:hid: remove a habit and adjust completion stats.
// Controller helpers to implement:
//   - sanitizeHabitPayload(payload): validate habit names, colors, and start dates.
//   - applyCompletion(userId, habitId): toggle completion and persist on the user.
//   - computeHabitStreak(userId, habitId): return streak info for UI badges.
// Notes:
//   - Should re-use the Habit subdocument schema from models/Habit.js.
