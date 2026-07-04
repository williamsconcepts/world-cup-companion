import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./sockets";

import authRoutes from "./routes/auth.routes";
import matchRoutes from "./routes/matches.routes";
import predictionRoutes from "./routes/predictions.routes";
import fantasyRoutes from "./routes/fantasy.routes";
import ratingRoutes from "./routes/ratings.routes";
import discussionRoutes from "./routes/discussions.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";

const app = express();
const httpServer = http.createServer(app);

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/fantasy", fantasyRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(errorHandler);

initSocket(httpServer);

httpServer.listen(env.port, () => {
  console.log(`World Cup Companion API listening on port ${env.port}`);
});
