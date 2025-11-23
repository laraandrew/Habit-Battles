import { Router } from 'express';
import { User } from '../models/User.js';

const r = Router();

// Add a habit to a user account.
r.post('/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).end();
    user.habits.push(req.body); // rely on schema validation
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

// Update a habit (toggle completion/activation) for a user.
r.patch('/:userId/:habitId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).end();
    const habit = user.habits.id(req.params.habitId);
    if (!habit) return res.status(404).end();
    Object.assign(habit, req.body); // e.g., { completed: true } or { isActive: false }
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Reset all habit completions for a user (intended for daily reset jobs).
r.post('/:userId/reset', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).end();
    user.resetCompletions();
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default r;
