import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";
import { staffRouter } from "./routes/staff.js";
import { adminRouter } from "./routes/admin.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? (process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ?? true)
    : true;

app.use(
  cors({
    origin: corsOrigin,
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

app.listen(port, () => {
  console.log(`Buddy Dave's API listening on :${port}`);
});
