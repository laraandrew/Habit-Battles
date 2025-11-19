import { Router } from 'express';
import { Challenge } from '../models/Challenge.js';

const r = Router();


r.post('/', async (req, res, next) => {
    try { 
        const c = await Challenge.create(req.body); 
        res.status(201).json(c); 
    }
    catch (e) { next(e); }
});


r.get('/', async (req, res) => {
    const list = await Challenge.find().populate('participants.user');
    res.json(list);
});


r.get('/:id', async (req, res, next) => {
    try {
        const c = await Challenge.findById(req.params.id).populate('participants.user');
        if (!c) return res.status(404).end(); res.json(c);
    } catch (e) { next(e); }
});


r.post('/:id/participants/:userId/pct', async (req, res, next) => {
    try {
        const c = await Challenge.findById(req.params.id);
        if (!c) return res.status(404).end();
        c.updateParticipantPct(req.params.userId, Number(req.body.pct));
        await c.save();
        res.json(c);
    } catch (e) { next(e); }
});


r.get('/:id/winner', async (req, res, next) => {
    try {
        const c = await Challenge.findById(req.params.id);
        if (!c) return res.status(404).end();
        res.json(c.winner());
    } catch (e) { next(e); }
});


export default r;