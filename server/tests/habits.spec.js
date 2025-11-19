import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../src/db.js';
import app from '../src/app.js';


let mongod, userId, habitId;


beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectDB(mongod.getUri());
    const u = await request(app).post('/users').send({ name:'A', habits:[{name:'Walk', color:'teal'}]});
    userId = u.body._id; habitId = u.body.habits[0]._id;
});


afterAll(async () => { 
    await disconnectDB(); 
    await mongod.stop(); 
});


it('toggles habit completion and updates pct', async () => {
    let res = await request(app).patch(`/habits/${userId}/${habitId}`).send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completionPct).toBe(100);
});


it('resets all completions', async () => {
    const res = await request(app).post(`/habits/${userId}/reset`).send();
    expect(res.status).toBe(200);
    expect(res.body.completionPct).toBe(0);
});