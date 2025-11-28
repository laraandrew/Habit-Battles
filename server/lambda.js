// server/lambda.js
// Overview:
//   Serverless adapter for the Express backend so it can run in AWS Lambda or
//   similar FaaS environments.
// Responsibilities to implement:
//   - Load environment configuration (e.g., MONGODB_URI) required for startup.
//   - Initialize database connectivity once per cold start and reuse across
//     invocations.
//   - Wrap and export the Express app handler via serverless-http (or equivalent).
//   - Ensure callbackWaitsForEmptyEventLoop is disabled to allow connection reuse.
// Notes:
//   - Keep this entrypoint lightweight; heavy bootstrapping belongs in src/.
