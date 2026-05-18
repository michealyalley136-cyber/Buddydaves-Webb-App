import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({ ok: true, service: "buddy-daves-api", time: new Date().toISOString() });
});

healthRouter.get("/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "up" });
  } catch (e) {
    res.status(503).json({ ok: false, database: "down" });
  }
});
