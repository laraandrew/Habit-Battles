# Habit Battles


**Tech:** Express + Mongoose + Jest + Supertest; React + Vite.


### Run locally
- `cd server && cp .env.example .env && npm i && npm run dev`
- `cd web && npm i && VITE_API_BASE_URL=http://localhost:3001 npm run dev`


### API
- `POST /users` → create user
- `GET /users?limit&cursor` → list (cursor pagination)
- `PATCH /users/:id` → update profile
- `POST /habits/:userId` → add habit `{ name, color }`
- `PATCH /habits/:userId/:habitId` → update fields `{ completed, isActive }`
- `POST /habits/:userId/reset` → reset all completions
- `POST /challenges` → create
- `POST /challenges/:id/participants/:userId/pct` → append a daily pct
- `GET /challenges/:id/winner` → winner `{ user, avg }`


### Notes & Tradeoffs
- **Mongoose features showcased:** subdocuments, virtuals, instance methods, validation hooks, indexes, population, cursor-style pagination.
- **Scalability:** move habits to a separate collection if subdocument arrays grow; add compound indexes; event-driven aggregation for daily pct; background jobs for daily reset; use S3 for media if needed.