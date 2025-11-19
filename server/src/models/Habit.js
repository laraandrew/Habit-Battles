// server/src/models/Habit.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

export const HABIT_COLORS = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'indigo',
  'violet',
];

const HabitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 48,
    },
    completed: { type: Boolean, default: false },
    color: {
      type: String,
      enum: HABIT_COLORS,
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

// Simple instance method example
HabitSchema.methods.toggle = function () {
  this.completed = !this.completed;
  return this.completed;
};

export default HabitSchema;   // NOTE: exporting the SCHEMA, not a model
