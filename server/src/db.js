// server/src/db.js
// Overview:
//   Database connection utilities using Mongoose. Provides functions to connect,
//   disconnect, and monitor MongoDB state for the backend service.
// Responsibilities to implement:
//   - connect(uri, options): establish a mongoose connection and register event
//     listeners for open/error/disconnected states.
//   - disconnect(): gracefully close the mongoose connection (used on shutdown or
//     in tests).
//   - getConnection(): helper to access the current mongoose connection instance.
//   - seedDevelopmentData(): optional helper to seed example users/habits/
//     challenges for local testing.
// Notes:
//   - Ensure mongoose models are registered before attempting to seed data.
//   - Centralize connection logging to avoid duplication across entrypoints.
