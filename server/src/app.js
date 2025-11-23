import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pinoHttp from 'pino-http';
import usersRouter from './routes/users.js';
import habitsRouter from './routes/habits.js';
import challengesRouter from './routes/challenges.js';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(pinoHttp({ autoLogging: false }));

// Simple health checks for uptime monitoring.
app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/ping', (req, res) => res.json({ ok: true }));

// Mount resource routers.
app.use('/users', usersRouter);
app.use('/habits', habitsRouter); // convenience endpoints
app.use('/challenges', challengesRouter);

app.get('/', (req, res) => {
  res.send('Habit Battles API is running 🚀');
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 400;
  res.status(status).json({ error: err.message || 'Unexpected error' });
});

export default app;
