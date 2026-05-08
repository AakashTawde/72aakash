import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { env } from "./env";
import { authRouter } from "./routes/auth";
import { usersRouter } from "./routes/users";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// 404 fallback for /api/*
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const server = http.createServer(app);

// Socket.io — used later (Phase 3) for incoming-call ring.
// Scaffolded now so web/mobile clients can connect.
const io = new SocketServer(server, {
  cors: { origin: env.CORS_ORIGIN, credentials: true },
});

io.on("connection", (socket) => {
  // TODO: authenticate via JWT in handshake (Phase 3)
  socket.on("disconnect", () => {
    // no-op
  });
});

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${env.PORT}`);
});
