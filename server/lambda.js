// server/lambda.js
import 'dotenv/config';
import serverless from 'serverless-http';
import app from './src/app.js';
import { connectDB } from './src/db.js';

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error('❌ Missing MONGODB_URI env var');
  throw new Error('Missing MONGODB_URI');
}

let isConnected = false;

// Wrap the Express app for Lambda
const expressHandler = serverless(app);

export const handler = async (event, context) => {
  // Don’t wait for Node’s event loop to be empty (important for DB reuse)
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await connectDB(URI);
    isConnected = true;
  }

  return expressHandler(event, context);
};
