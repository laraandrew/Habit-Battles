import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/db.js';
import app from '../src/app.js';


let mongod;


beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDB(mongod.getUri());
});


afterAll(async () => {
    await disconnectDB();
    await mongod.stop();
});


it('creates a user and computes completionPct virtual', async () => {
    const res = await request(app)
    .post('/users')
    .send({ name: 'Andrew', age: 22, habits: [
    { name: 'Water', color: 'blue', completed: true },
    { name: 'Read', color: 'green', completed: false }
    ]});
    expect(res.status).toBe(201);
    expect(res.body.completionPct).toBe(50);
});


it('rejects duplicate habit names (case-insensitive)', async () => {
    const res = await request(app)
    .post('/users')
    .send({ name: 'Dup', habits: [
        { name: 'Read', color: 'red' },
        { name: 'read', color: 'green' }
    ]});
    expect(res.status).toBe(400);
});