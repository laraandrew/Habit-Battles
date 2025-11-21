// server/src/db.js
import mongoose from 'mongoose';

const options = {
  // keep it short so failures are obvious in dev
  serverSelectionTimeoutMS: 8000,
};

/**
 * Connect to MongoDB using the provided URI.
 * - On success: logs host + db name
 * - On failure: throws so the caller can exit the process
 */
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, options);

    const conn = mongoose.connection;
    console.log(
      `✅ MongoDB connected successfully. Host: ${conn.host} • DB: ${conn.name}`
    );

    conn.on('error', (err) => {
      console.error('❌ MongoDB runtime connection error:', err.message);
    });

    conn.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    console.error('❌ MongoDB initial connection error:');
    console.error(err.message || err);
    // IMPORTANT: rethrow so index.js can stop the server
    throw err;
  }
}
