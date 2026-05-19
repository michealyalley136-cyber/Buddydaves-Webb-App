import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { getFallbackMenu, type MenuCategoryResponse } from "../lib/fallback-menu.js";
import { prisma } from "../lib/prisma.js";

export const menuRouter = Router();

type CategoryWithItems = {
  id: string;
  name: string;
  slug: string;
  items: {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    priceCents: number;
    imageUrl: string | null;
  }[];
};

function formatCategories(categories: CategoryWithItems[]): MenuCategoryResponse[] {
  return categories
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
    .filter((c) => c.items.length > 0);
}

menuRouter.get("/debug", asyncHandler(async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [
      menuCategoryTotal,
      menuItemTotal,
      menuCategoryActive,
      menuItemActive,
      sampleCategories,
      sampleItems,
    ] = await Promise.all([
      prisma.menuCategory.count(),
      prisma.menuItem.count(),
      prisma.menuCategory.count({ where: { active: true } }),
      prisma.menuItem.count({ where: { active: true } }),
      prisma.menuCategory.findMany({
        take: 5,
        orderBy: { sortOrder: "asc" },
        select: { name: true, slug: true, active: true },
      }),
      prisma.menuItem.findMany({
        take: 10,
        orderBy: { sortOrder: "asc" },
        select: { name: true, priceCents: true, active: true },
      }),
    ]);

    res.json({
      ok: true,
      database: "connected",
      counts: {
        menuCategoryTotal,
        menuItemTotal,
        menuCategoryActive,
        menuItemActive,
      },
      sampleCategories,
      sampleItems,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[menu/debug] Failed:", message);
    res.status(500).json({
      ok: false,
      database: "error",
      error: "Menu debug unavailable",
    });
  }
}));

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

    const formatted = formatCategories(categories);
    if (formatted.length === 0) {
      console.warn("[menu] No active menu items in database — serving fallback menu");
      res.json(getFallbackMenu());
      return;
    }

    res.json({ categories: formatted });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[menu] Failed to load menu:", message);
    res.status(500).json({ error: "Menu unavailable" });
  }
}));
