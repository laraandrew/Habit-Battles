// server/src/routes/challenges.js
// Overview:
//   Express router for challenge-related endpoints. Manages creation, enrollment,
//   progress updates, and duration adjustments for collaborative challenges.
// Expected routes to implement:
//   - GET /challenges           : list all challenges with optional participant
//                                 population.
//   - POST /challenges          : create a challenge with name, dateStarted,
//                                 duration, participants, and avgPercentagePerUser
//                                 defaults.
//   - GET /challenges/:id       : fetch a challenge and its participant details.
//   - PATCH /challenges/:id     : update metadata (name, duration) and track
//                                 extensions.
//   - POST /challenges/:id/extend : extend challenge time by provided days and
//                                   notify participants.
//   - POST /challenges/:id/participants : add participant(s) and sync averages.
//   - DELETE /challenges/:id/participants/:uid : remove participant and clean up.
// Controller helpers to implement:
//   - validateChallengePayload(payload): ensure schema alignment before saving.
//   - extendChallenge(id, days): increase duration and persist to db.
//   - syncParticipantAverages(challengeId, participantUpdates): recalc
//     avgPercentagePerUser list.
//   - fetchGlobalVisibilityFeed(): return public challenges viewable by everyone.
// Notes:
//   - Collaborate with user routes to maintain friend relationships where
//     challenges are globally visible (everyone can see everyone else for now).
