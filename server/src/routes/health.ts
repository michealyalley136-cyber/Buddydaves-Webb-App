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

healthRouter.get("/menu", async (_req, res) => {
  try {
    const itemCount = await prisma.menuItem.count({ where: { active: true } });
    const categoryCount = await prisma.menuCategory.count({ where: { active: true } });
    res.json({
      ok: itemCount > 0,
      menuItems: itemCount,
      menuCategories: categoryCount,
    });
  } catch {
    res.status(503).json({ ok: false, menuItems: 0, menuCategories: 0 });
  }
});
