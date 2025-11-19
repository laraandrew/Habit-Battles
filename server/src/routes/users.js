import { Router } from 'express';
import { User } from '../models/User.js';


const r = Router();


r.post('/', async (req, res, next) => {
    try { 
        const u = await User.create(req.body); 
        res.status(201).json(u); 
    }
    catch (e) { next(e); }
});


r.get('/', async (req, res) => {
    const { limit = 20, cursor } = req.query;
    const q = User.find();
    if (cursor) q.where('_id').gt(cursor);
    const items = await q.limit(Number(limit)+1).exec();
    const nextCursor = items.length > limit ? items.pop().id : null;
    res.json({ items, nextCursor });
});


r.get('/:id', async (req, res, next) => {
    try { const u = await User.findById(req.params.id).populate('friends');
        if (!u) return res.status(404).end(); res.json(u);
    } catch (e) { next(e); }
});


r.patch('/:id', async (req, res, next) => {
    try { 
        const u = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!u) return res.status(404).end(); res.json(u);
    } catch (e) { next(e); }
});


r.delete('/:id', async (req, res, next) => {
    try { 
        await User.findByIdAndDelete(req.params.id); 
        res.status(204).end(); 
    }
    catch (e) { next(e); }
});


// Add/Remove friend
r.post('/:id/friends/:friendId', async (req, res, next) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).end();
        if (!u.friends.find(f=>String(f)===req.params.friendId)) u.friends.push(req.params.friendId);
        await u.save();
        res.json(u);
    } catch (e) { next(e); }
});


r.delete('/:id/friends/:friendId', async (req, res, next) => {
    try {
        const u = await User.findById(req.params.id);
        if (!u) return res.status(404).end();
        u.friends = u.friends.filter(f => String(f) !== req.params.friendId);
        await u.save();
        res.json(u);
    } catch (e) { next(e); }
});


export default r;