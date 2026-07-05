# World Cup Companion

A companion app for following a World Cup tournament: live matches, score predictions,
fantasy teams, player ratings, fan discussions, and a leaderboard.

## Stack

| Layer     | Tech                                      |
|-----------|--------------------------------------------|
| Frontend  | Next.js (App Router), TypeScript, Tailwind, Framer Motion |
| Backend   | Node.js, Express, TypeScript               |
| Database  | PostgreSQL via Prisma                      |
| Realtime  | Socket.io                                  |
| Hosting   | Frontend → Vercel · Backend/DB → Railway   |

## Project layout

```
world-cup-companion/
  server/   Express API, Prisma schema, Socket.io
  client/   Next.js frontend
```

## 1. Backend setup

```bash
cd server
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed               # optional: adds two teams, two players, one fixture
npm run dev                 # http://localhost:4000
```

Modules implemented in the API:

- **Auth** — `/api/auth/register`, `/login`, `/me` (JWT, bcrypt password hashing)
- **Matches** — `/api/matches`, `/api/matches/:id`
- **Predictions** — `/api/predictions` (upsert), `/api/predictions/mine` — locked once a match leaves `SCHEDULED`
- **Fantasy Team** — `/api/fantasy`, `/api/fantasy/:teamId/players`
- **Player Ratings** — `/api/ratings`, `/api/ratings/match/:matchId` (aggregated average)
- **Fan Discussions** — `/api/discussions`, `/api/discussions/:postId/comments` — broadcasts over Socket.io as posts/comments land
- **Leaderboard** — `/api/leaderboard`

Socket.io rooms: `match:{id}` for live score/event updates, `post:{id}` for a discussion thread,
`global` for the site-wide discussion feed.

## 2. Frontend setup

```bash
cd client
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your API
npm install
npm run dev                         # http://localhost:3000
```

Pages: `/` (landing), `/login`, `/register`, and `/dashboard/*` for each module
(matches, predictions, fantasy, ratings, discussions, leaderboard). The dashboard layout
guards all of these behind a signed-in session and shows a live scrolling score ticker. 

## 3. Deploying

**Backend (Railway)**
1. Create a new Railway project, add a PostgreSQL plugin.
2. Deploy the `server/` folder (Railway auto-detects Node — set the start command to
   `npm run build && npm run start`, or use `npm run prisma:migrate deploy` as a release step).
3. Set env vars: `DATABASE_URL` (from the Postgres plugin), `JWT_SECRET`, `CLIENT_URL`
   (your Vercel domain), `PORT` (Railway sets this automatically).

**Frontend (Vercel)**
1. Import the `client/` folder as a new Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL.
3. Deploy.

Once both are live, update each service's CORS/`CLIENT_URL` env var to point at the other's
final domain.

## Design notes

The visual identity leans into a stadium-scoreboard feel: a dark pitch-green base, a gold
accent reserved for primary actions and scores, and tabular-number "scoreboard" digits
(JetBrains Mono) wherever a score, points total, or countdown appears. Rajdhani is used for
display headings; Inter for body copy. The signature element is the live-scrolling score
ticker at the top of the dashboard, styled like a stadium LED board.

## Next steps to extend

- Wire real match-event ingestion (a cron job or webhook) into `broadcastMatchUpdate` so
  scores update in real time on the ticker.
- Add point-calculation jobs that run after a match finishes, updating `Prediction.pointsAwarded`,
  `FantasyTeam.totalPoints`, and `LeaderboardEntry`.
- Replace the raw match/player ID inputs on the Ratings page with real dropdowns once you're
  ready to wire it fully into the Matches module.
- Add refresh-token rotation if you want longer-lived sessions than the current JWT expiry.ok
