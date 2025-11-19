import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/db.js';
import app from '../src/app.js';


let mongod, u1, u2, challengeId;


beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDB(mongod.getUri());
    u1 = (await request(app).post('/users').send({ name:'P1' })).body._id;
    u2 = (await request(app).post('/users').send({ name:'P2' })).body._id;
});


afterAll(async () => { await disconnectDB(); await mongod.stop(); });


    it('creates challenge and computes winner by average pct', async () => {
        const c = await request(app).post('/challenges').send({
        name: 'Week Sprint', startDate: new Date(), durationDays: 3,
        participants: [{ user: u1 }, { user: u2 }]
    });
    expect(c.status).toBe(201);
    challengeId = c.body._id;


    await request(app).post(`/challenges/${challengeId}/participants/${u1}/pct`).send({ pct: 100 });
    await request(app).post(`/challenges/${challengeId}/participants/${u1}/pct`).send({ pct: 100 });
    await request(app).post(`/challenges/${challengeId}/participants/${u2}/pct`).send({ pct: 50 });


    const w = await request(app).get(`/challenges/${challengeId}/winner`).send();
    expect(w.status).toBe(200);
    expect(w.body.user).toBe(String(u1));
    expect(w.body.avg).toBeGreaterThan(50);
});