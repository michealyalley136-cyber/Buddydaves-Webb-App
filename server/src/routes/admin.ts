import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { writeAudit } from "../lib/audit.js";

export const adminRouter = Router();

adminRouter.use(requireAuth("admin"));

adminRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.menuCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  res.json({
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      active: c.active,
      sortOrder: c.sortOrder,
      itemCount: c._count.items,
    })),
  });
});

adminRouter.get("/menu-items", async (_req, res) => {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true },
  });
  res.json({
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.priceCents / 100,
      priceCents: i.priceCents,
      imageUrl: i.imageUrl,
      active: i.active,
      sortOrder: i.sortOrder,
      categoryId: i.categoryId,
      category: { id: i.category.id, name: i.category.name, slug: i.category.slug },
    })),
  });
});

const createItemSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

adminRouter.post("/menu-items", async (req, res) => {
  const parsed = createItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() });
    return;
  }
  const cat = await prisma.menuCategory.findUnique({ where: { id: parsed.data.categoryId } });
  if (!cat) {
    res.status(400).json({ error: "Invalid category" });
    return;
  }
  const priceCents = Math.round(parsed.data.price * 100);
  const item = await prisma.menuItem.create({
    data: {
      categoryId: parsed.data.categoryId,
      name: parsed.data.name,
      description: parsed.data.description,
      priceCents,
      imageUrl: parsed.data.imageUrl || null,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    },
  });
  const user = (req as AuthedRequest).user;
  await writeAudit(user?.id, "menu_item.created", { entity: "MenuItem", entityId: item.id });
  res.status(201).json({
    id: item.id,
    name: item.name,
    price: item.priceCents / 100,
    active: item.active,
    categoryId: item.categoryId,
  });
});

const patchItemSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullable().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryId: z.string().optional(),
});

adminRouter.patch("/menu-items/:id", async (req, res) => {
  const parsed = patchItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const id = req.params.id;
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const d = parsed.data;
  if (d.categoryId) {
    const cat = await prisma.menuCategory.findUnique({ where: { id: d.categoryId } });
    if (!cat) {
      res.status(400).json({ error: "Invalid category" });
      return;
    }
  }
  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name: d.name,
      description: d.description === null ? null : d.description,
      priceCents: d.price !== undefined ? Math.round(d.price * 100) : undefined,
      imageUrl: d.imageUrl === "" ? null : d.imageUrl,
      active: d.active,
      sortOrder: d.sortOrder,
      categoryId: d.categoryId,
    },
  });
  const user = (req as AuthedRequest).user;
  await writeAudit(user?.id, "menu_item.updated", { entity: "MenuItem", entityId: id });
  res.json({
    id: item.id,
    name: item.name,
    price: item.priceCents / 100,
    active: item.active,
    categoryId: item.categoryId,
  });
});

adminRouter.delete("/menu-items/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.menuItem.delete({ where: { id } });
  } catch {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const user = (req as AuthedRequest).user;
  await writeAudit(user?.id, "menu_item.deleted", { entity: "MenuItem", entityId: id });
  res.status(204).end();
});

adminRouter.get("/recent-orders", async (_req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 120,
  });
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      code: o.code,
      status: o.status,
      customerName: o.customerName,
      total: o.totalCents / 100,
      createdAt: o.createdAt,
    })),
  });
});

adminRouter.get("/orders/summary", async (_req, res) => {
  const [pending, preparing, ready, todayCount] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PREPARING" } }),
    prisma.order.count({ where: { status: "READY" } }),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);
  res.json({ pending, preparing, ready, todayOrders: todayCount });
});
