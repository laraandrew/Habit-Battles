# Habit Battles API Overview

This document summarizes the backend endpoints, models, and daily snapshot rules introduced for challenge tracking.

## Core resources

### Users (`/users`)
- `POST /users` – create a user profile.
- `GET /users` – list users with a cursor and limit query params.
- `GET /users/:id` – fetch a single user with friends populated.
- `PATCH /users/:id` – update user properties, embedded habits, or active challenge reference.
- `DELETE /users/:id` – remove a user entirely.
- `POST /users/:id/friends/:friendId` – add a friend relationship.
- `DELETE /users/:id/friends/:friendId` – remove a friend relationship.

### Habits (`/habits`)
- `POST /habits/:userId` – add a new habit for the user.
- `PATCH /habits/:userId/:habitId` – update habit flags such as `completed` or `isActive`.
- `POST /habits/:userId/reset` – reset all habit completions for a user (intended for daily reset jobs).

### Challenges (`/challenges`)
- `POST /challenges` – create a challenge with base fields and optional participants.
- `GET /challenges` – list challenges with participants populated.
- `GET /challenges/:id` – fetch a challenge with populated participants.
- `PATCH /challenges/:id` – update challenge metadata (name, start date, duration).
- `POST /challenges/:id/participants` – add a participant by user id.
- `POST /challenges/:id/participants/:userId/pct` – record a participant's end-of-day percentage; accepts optional `dateLabel` or uses platform PST date.
- `GET /challenges/:id/winner` – compute the current winner based on average daily percentages.

## Daily snapshot policy
- Each participant stores **one percentage per PST day** using a `YYYY-MM-DD` label derived from the `America/Los_Angeles` timezone.
- Reposting for the same date overwrites that day's percentage instead of duplicating entries.
- Helpers in `server/src/utils/time.js` centralize the timezone calculation so scheduled jobs can align to midnight PST.

## Models
- `User` embeds `Habit` subdocuments and references friends and an active challenge.
- `Challenge` participants store per-day snapshots in `dailySnapshots`, making it easy to calculate averages and winners.

## Operational notes
- CORS is configured for `http://localhost:5173` with credentials allowed.
- The global error handler normalizes errors to `{ error: message }` responses.
- MongoDB connectivity logs successes and reports connection issues to aid deployment triage.
