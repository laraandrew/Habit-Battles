# Code Review: Habit Battles

This review covers the backend and its interaction points.

## Strengths
- **Clear separation of resources**: users, habits, and challenges are routed separately and backed by dedicated models.
- **Validation via Mongoose**: schemas enforce key constraints (e.g., habit name lengths, challenge duration bounds).
- **Operational guardrails**: environment validation for MongoDB URI and logging for DB connectivity are in place.

## Risks & Opportunities
- **Time-zone explicitness**: daily percentages now use a platform-level PST label to avoid cross-region drift; ensure cron/reset jobs use the same helper.
- **Participant idempotency**: added participant endpoints are idempotent on user id; clients should rely on server responses rather than assuming creation.
- **Input validation**: consider centralized request validation (e.g., celebrate/zod) to catch malformed payloads before hitting the database.
- **Authentication**: endpoints are unauthenticated; before production, add auth middleware and ownership checks.

## Follow-up suggestions
- Add integration tests around challenge creation, participant additions, and daily snapshot overwrites.
- Extend `/challenges/:id/winner` to return populated user details for leaderboard UIs.
- Expose a scheduler-friendly endpoint or worker to roll over daily percentages automatically at midnight PST.
