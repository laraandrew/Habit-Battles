// server/src/index.js
// Overview:
//   Application entrypoint for the backend service. Responsible for starting the
//   HTTP server (or exporting for serverless) after initializing dependencies.
// Responsibilities to implement:
//   - Load environment configuration (ports, database URIs, feature flags).
//   - Initialize database connection via db.js before binding the server.
//   - Import and use the Express app from app.js.
//   - Start listening on configured port and log startup details.
//   - Gracefully handle shutdown signals and propagate close events to database
//     connections.
// Notes:
//   - Keep this file minimal; heavy initialization should live in helpers.
