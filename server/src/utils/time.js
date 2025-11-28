// server/src/utils/time.js
// Overview:
//   Time and date utility helpers shared across routes and models.
// Functions to implement:
//   - getStartOfDay(date = new Date()): return a Date normalized to midnight for
//     consistent comparisons.
//   - daysBetween(start, end): return integer number of days between two dates.
//   - addDays(date, count): return a new Date advanced by `count` days.
//   - isSameDay(a, b): determine if two dates fall on the same calendar day.
// Usage expectations:
//   - Used by habit streak calculations and challenge duration logic.
//   - Should avoid timezone surprises by normalizing to UTC or configured tz.
