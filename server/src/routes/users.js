// server/src/routes/users.js
// Overview:
//   Express router responsible for user-related endpoints: profile management,
//   habit lifecycle, and social graph interactions.
// Expected routes to implement:
//   - GET /users            : list users with optional filtering/sorting.
//   - POST /users           : create a new user with default habits metadata.
//   - GET /users/:id        : fetch a single user and populated relationships.
//   - PATCH /users/:id      : update profile fields (name, age, currentDay,
//                             startDay) and persist habit/relationship updates.
//   - DELETE /users/:id     : remove a user and cascade cleanup of friendships
//                             and challenge participation.
//   - POST /users/:id/habits        : add a habit subdocument to a user.
//   - PATCH /users/:id/habits/:hid : update or toggle a specific habit.
//   - DELETE /users/:id/habits/:hid: remove a habit from the user.
//   - POST /users/:id/friends      : add a friend relationship (bidirectional
//                                    add for now so everyone can see each other).
//   - DELETE /users/:id/friends/:fid: remove a friend and cleanup reciprocal
//                                     references.
//   - POST /users/:id/challenges/:cid/attach: enroll a user into a challenge
//                                            and sync participant lists.
//   - POST /users/:id/challenges/:cid/detach: remove user from a challenge.
// Controller helpers to implement:
//   - validateUserPayload(payload): enforce schema constraints before persistence.
//   - syncFriendship(aId, bId): ensure friendships are mirrored for both users.
//   - updateHabitStatus(userId, habitId, isComplete): toggle habit completion and
//     update completionPct virtuals accordingly.
//   - recordDailyProgress(userId): roll over to a new day, reset habit completion
//     flags, and increment currentDay.
// Notes:
//   - This file should initialize and export an Express Router once backend is
//     re-implemented.
