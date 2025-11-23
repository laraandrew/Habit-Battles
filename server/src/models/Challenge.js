import mongoose from 'mongoose';
import { getPstDateLabel } from '../utils/time.js';

// A single per-day percentage snapshot for a participant.
const ParticipantDaySchema = new mongoose.Schema(
  {
    dateLabel: { type: String, required: true }, // YYYY-MM-DD in PST
    pct: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

// Represents a user taking part in a challenge.
const ParticipantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dailySnapshots: {
      // percentage recorded once per PST day
      type: [ParticipantDaySchema],
      default: [],
    },
  },
  { _id: false }
);

const ChallengeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    durationDays: {
      type: Number,
      min: [7, 'Duration must be at least 7 days'],
      max: [365, 'Duration cannot be longer than 1 year'],
      required: true,
    },
    participants: {
      type: [ParticipantSchema],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ChallengeSchema.virtual('endDate').get(function () {
  const d = new Date(this.startDate);
  d.setDate(d.getDate() + this.durationDays);
  return d;
});

/**
 * Add a new participant to the challenge if they are not already present.
 */
ChallengeSchema.methods.addParticipant = function (userId) {
  const alreadyThere = this.participants.find(
    (p) => p.user.toString() === String(userId)
  );
  if (alreadyThere) return alreadyThere;
  const newParticipant = { user: userId, dailySnapshots: [] };
  this.participants.push(newParticipant);
  return newParticipant;
};

/**
 * Record or overwrite a participant's percentage for a given PST day.
 * Only one record per day is kept, ensuring we store the end-of-day number.
 */
ChallengeSchema.methods.recordDailyPct = function (userId, pct, dateLabel) {
  const participant = this.participants.find(
    (p) => p.user.toString() === String(userId)
  );
  if (!participant) throw new Error('Participant not in challenge');

  const label = dateLabel || getPstDateLabel();
  const existing = participant.dailySnapshots.find((d) => d.dateLabel === label);
  if (existing) {
    existing.pct = pct;
  } else {
    participant.dailySnapshots.push({ dateLabel: label, pct });
  }
  return label;
};

ChallengeSchema.methods.averagePct = function (userId) {
  const participant = this.participants.find(
    (p) => p.user.toString() === String(userId)
  );
  if (!participant || !participant.dailySnapshots.length) return 0;
  const sum = participant.dailySnapshots.reduce((a, b) => a + b.pct, 0);
  return Math.round(sum / participant.dailySnapshots.length);
};

ChallengeSchema.methods.winner = function () {
  if (!this.participants.length) return null;
  let best = null;
  let bestAvg = -1;
  for (const participant of this.participants) {
    const avg = participant.dailySnapshots.length
      ? Math.round(
          participant.dailySnapshots.reduce((a, b) => a + b.pct, 0) /
            participant.dailySnapshots.length
        )
      : 0;
    if (avg > bestAvg) {
      bestAvg = avg;
      best = participant.user;
    }
  }
  return { user: best, avg: bestAvg };
};

export const Challenge = mongoose.model('Challenge', ChallengeSchema);
