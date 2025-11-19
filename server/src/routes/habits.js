import { Router } from 'express';
import { User } from '../models/User.js';


const r = Router();


// Add a habit to a user
r.post('/:userId', async (req, res, next) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).end();
        u.habits.push(req.body); // rely on schema validation
        await u.save();
        res.status(201).json(u);
    } catch (e) { next(e); }
});


// Toggle completion / activate / deactivate
r.patch('/:userId/:habitId', async (req, res, next) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).end();
        const h = u.habits.id(req.params.habitId);
        if (!h) return res.status(404).end();
        Object.assign(h, req.body); // e.g., { completed: true } or { isActive: false }
        await u.save();
        res.json(u);
    } catch (e) { next(e); }
});


// Reset all completions for a user (daily reset)
r.post('/:userId/reset', async (req, res, next) => {
    try {
        const u = await User.findById(req.params.userId);
        if (!u) return res.status(404).end();
        u.resetCompletions();
        await u.save();
        res.json(u);
    } catch (e) { next(e); }
});


export default r;