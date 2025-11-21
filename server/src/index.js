import 'dotenv/config';
import { connectDB } from './db.js';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;
const URI = process.env.MONGODB_URI;

// --- Safety checks ---
if (!URI) {
  console.error('\n❌ ERROR: Missing MONGODB_URI in environment variables.');
  console.error('   Create a `.env` file with:');
  console.error('   MONGODB_URI="your connection string here"\n');
  process.exit(1);
}

(async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');

    await connectDB(URI);

    console.log('✅ MongoDB connected successfully.');
    console.log(`🌐 Server listening on port ${PORT}\n`);

    app.listen(PORT, () => {
      console.log(`➡️  API running at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('\n❌ Failed to start server.');
    console.error(err.stack || err);
    process.exit(1);
  }
})();
