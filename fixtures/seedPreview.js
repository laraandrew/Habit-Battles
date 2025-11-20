#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'sampleData.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

const { users = [], challenges = [] } = data;
const challenge = challenges[0];

function isoDate(d) { return new Date(d).toISOString().slice(0,10); }

if (challenge) {
  const start = new Date(challenge.startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + Number(challenge.durationDays || 0));
  console.log(`Challenge: ${challenge.name}`);
  console.log(`  Start: ${isoDate(start)}`);
  console.log(`  Duration (days): ${challenge.durationDays}`);
  console.log(`  Calculated End: ${isoDate(end)}`);
  console.log('');
}

for (const u of users) {
  console.log(`User: ${u.name} (age ${u.age})`);
  if (u.habits && u.habits.length) {
    console.log('  Habits:');
    for (const h of u.habits) {
      console.log(`    - ${h.name} [${h.color}] active:${h.isActive} completed:${h.completed}`);
    }
  } else {
    console.log('  (no habits)');
  }
  console.log(`  Current challenge id: ${u.currentChallenge || 'none'}`);
  console.log('');
}

console.log('Preview complete. To use this data in tests, import `fixtures/sampleData.json`.');
