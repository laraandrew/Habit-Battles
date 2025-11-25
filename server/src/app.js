// server/src/app.js
// Overview:
//   Initializes the Express application. Wire up middleware, routes, and error
//   handling in this module.
// Responsibilities to implement:
//   - Configure JSON/body parsing, CORS, request logging, and security headers.
//   - Mount route modules for users, habits, and challenges under appropriate
//     base paths.
//   - Centralize 404 handling and error serialization for API clients.
//   - Export the configured Express app for serverless handlers or Node servers
//     to import.
// Notes:
//   - Keep middleware order intentional (logging -> parsing -> routes -> errors).
//   - Include healthcheck endpoint for uptime monitoring.
