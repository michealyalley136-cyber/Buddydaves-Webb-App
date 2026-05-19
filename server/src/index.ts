import "dotenv/config";
import express from "express";
import cors from "cors";
import { runBootstrap } from "./bootstrap.js";
import { healthRouter } from "./routes/health.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { staffRouter } from "./routes/staff.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const host = process.env.HOST ?? "0.0.0.0";

function resolveCorsOrigin(): boolean | string[] {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const origins =
    process.env.CORS_ORIGIN?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];
  if (origins.length === 0) {
    console.warn(
      "[cors] CORS_ORIGIN is empty in production — cross-origin browser calls to this API will be blocked. Set CORS_ORIGIN to your web app URL(s), comma-separated."
    );
    return false;
  }
  return origins;
}

app.use(
  cors({
    origin: resolveCorsOrigin(),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/staff", staffRouter);
app.use("/api/admin", adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[api]", err);
    if (res.headersSent) return;
    res.status(500).json({ error: "Internal server error" });
  }
);

async function main() {
  await runBootstrap();
  const server = app.listen(port, host, () => {
    console.log(`Buddy Dave's API listening on ${host}:${port}`);
    if (process.env.NODE_ENV === "production") {
      const cors = process.env.CORS_ORIGIN?.trim() || "(not set)";
      console.log(`[startup] CORS_ORIGIN: ${cors}`);
    }
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Stop the other process or run "npm run dev:clean" from the repo root.`
      );
      process.exit(1);
    }
    throw err;
  });
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
