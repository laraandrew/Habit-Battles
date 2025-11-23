import { Router } from 'express';
import { User } from '../models/User.js';

const r = Router();

// Create a user with basic profile details and optional habits/friends.
r.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

// List users with simple cursor pagination for large collections.
r.get('/', async (req, res) => {
  const { limit = 20, cursor } = req.query;
  const query = User.find();
  if (cursor) query.where('_id').gt(cursor);
  const items = await query.limit(Number(limit) + 1).exec();
  const nextCursor = items.length > limit ? items.pop().id : null;
  res.json({ items, nextCursor });
});

// Retrieve a single user and populate their friends for convenience.
r.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('friends');
    if (!user) return res.status(404).end();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Update user details, habits, or challenge association with validation.
r.patch('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).end();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Delete a user profile and all embedded habit data.
r.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

// Add a friend relationship by user id, de-duplicated server-side.
r.post('/:id/friends/:friendId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).end();
    if (!user.friends.find((f) => String(f) === req.params.friendId))
      user.friends.push(req.params.friendId);
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// Remove a friend relationship between two users.
r.delete('/:id/friends/:friendId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).end();
    user.friends = user.friends.filter((f) => String(f) !== req.params.friendId);
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default r;
