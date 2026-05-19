import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { prisma } from "../lib/prisma.js";

export const menuRouter = Router();

menuRouter.get("/", asyncHandler(async (_req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    res.json({
      categories: categories
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          items: c.items.map((i) => ({
            id: i.id,
            categoryId: i.categoryId,
            name: i.name,
            description: i.description,
            price: i.priceCents / 100,
            priceCents: i.priceCents,
            imageUrl: i.imageUrl,
          })),
        }))
        .filter((c) => c.items.length > 0),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[menu] Failed to load menu:", message);
    res.status(503).json({ error: "Menu unavailable" });
  }
}));
