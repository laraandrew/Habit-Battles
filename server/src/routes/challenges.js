import { Router } from 'express';
import { Challenge } from '../models/Challenge.js';
import { getPstDateLabel } from '../utils/time.js';

const r = Router();

// Create a challenge with base details and optional participants.
r.post('/', async (req, res, next) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (e) {
    next(e);
  }
});

// Retrieve all challenges with participants populated.
r.get('/', async (req, res) => {
  const list = await Challenge.find().populate('participants.user');
  res.json(list);
});

// Fetch a single challenge by id with populated participants.
r.get('/:id', async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate(
      'participants.user'
    );
    if (!challenge) return res.status(404).end();
    res.json(challenge);
  } catch (e) {
    next(e);
  }
});

// Modify challenge metadata (name, start/end window, duration).
r.patch('/:id', async (req, res, next) => {
  try {
    const allowedFields = ['name', 'startDate', 'durationDays'];
    const payload = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate('participants.user');
    if (!challenge) return res.status(404).end();
    res.json(challenge);
  } catch (e) {
    next(e);
  }
});

// Add a participant to the challenge.
r.post('/:id/participants', async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).end();
    challenge.addParticipant(req.body.userId);
    await challenge.save();
    await challenge.populate('participants.user');
    res.status(201).json(challenge);
  } catch (e) {
    next(e);
  }
});

// Record the end-of-day completion percentage for a participant in PST.
r.post('/:id/participants/:userId/pct', async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).end();
    const pct = Number(req.body.pct);
    const dateLabel = req.body.dateLabel || getPstDateLabel();
    challenge.recordDailyPct(req.params.userId, pct, dateLabel);
    await challenge.save();
    await challenge.populate('participants.user');
    res.json({ challenge, dateLabel });
  } catch (e) {
    next(e);
  }
});

// Return the current winner based on the highest average percentage.
r.get('/:id/winner', async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).end();
    res.json(challenge.winner());
  } catch (e) {
    next(e);
  }
});

export default r;
