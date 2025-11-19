import 'dotenv/config';
import { connectDB } from './db.js';
import app from './app.js';


const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habit_battles';


(async () => {
await connectDB(URI);
app.listen(PORT, () => console.log(`API on :${PORT}`));
})();