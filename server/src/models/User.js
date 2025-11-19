// server/src/models/User.js
import mongoose from 'mongoose';
import HabitSchema from './Habit.js';

const { Schema } = mongoose;

const FriendRef = { type: Schema.Types.ObjectId, ref: 'User' };

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 5, max: 120 },

    // Array of subdocuments – no 'model' option here
    habits: {
      type: [HabitSchema],
      default: [],
    },

    friends: {
      type: [FriendRef],
      default: [],
    },

    currentChallenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ===== Virtuals =====
UserSchema.virtual('completionPct').get(function () {
  if (!this.habits?.length) return 0;
  const active = this.habits.filter((h) => h.isActive);
  if (!active.length) return 0;
  const completed = active.filter((h) => h.completed).length;
  return Math.round((completed / active.length) * 100);
});

UserSchema.virtual('friendCount').get(function () {
  return this.friends?.length || 0;
});

// ===== Indexes =====
UserSchema.index({ name: 1 });

// ===== Hooks =====
UserSchema.pre('validate', function (next) {
  const names = new Set();
  for (const h of this.habits) {
    const key = h.name.trim().toLowerCase();
    if (names.has(key)) {
      return next(new Error('Duplicate habit name: ' + h.name));
    }
    names.add(key);
  }
  next();
});

// ===== Methods =====
UserSchema.methods.resetCompletions = function () {
  this.habits.forEach((h) => {
    h.completed = false;
  });
};

export const User = mongoose.model('User', UserSchema);
