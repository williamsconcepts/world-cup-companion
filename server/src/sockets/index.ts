import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { env } from "../config/env";
import { verifyToken } from "../utils/jwt";

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        socket.data.userId = verifyToken(token).userId;
      } catch {
        // Allow anonymous, read-only connections too
      }
    }
    next();
  });

  io.on("connection", (socket) => {
    // Live match score/event updates
    socket.on("match:join", (matchId: string) => socket.join(`match:${matchId}`));
    socket.on("match:leave", (matchId: string) => socket.leave(`match:${matchId}`));

    // Fan discussion threads
    socket.on("post:join", (postId: string) => socket.join(`post:${postId}`));
    socket.on("post:leave", (postId: string) => socket.leave(`post:${postId}`));
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.io not initialized yet");
  return io;
}

// Called from admin/webhook tooling when a match score changes
export function broadcastMatchUpdate(matchId: string, payload: unknown) {
  getIO().to(`match:${matchId}`).emit("match:update", payload);
}
