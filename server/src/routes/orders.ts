import { Router } from "express";
import { z } from "zod";
import { OrderStatus, OrderType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { generateOrderCode } from "../lib/orderCode.js";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  orderType: z.enum(["pickup", "drive_thru"]),
  customerName: z.string().min(1).max(120),
  phone: z.string().min(7).max(32),
  pickupTime: z.string().max(80).optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
});

ordersRouter.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order payload", details: parsed.error.flatten() });
    return;
  }
  const body = parsed.data;

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: body.items.map((i) => i.menuItemId) }, active: true },
  });
  if (menuItems.length !== new Set(body.items.map((i) => i.menuItemId)).size) {
    res.status(400).json({ error: "One or more menu items are invalid" });
    return;
  }

  const byId = new Map(menuItems.map((m) => [m.id, m]));
  let totalCents = 0;
  const lineItems = body.items.map((line) => {
    const m = byId.get(line.menuItemId)!;
    totalCents += m.priceCents * line.quantity;
    return {
      menuItemId: m.id,
      name: m.name,
      priceCents: m.priceCents,
      quantity: line.quantity,
    };
  });

  const code = await generateOrderCode();

  const order = await prisma.order.create({
    data: {
      code,
      orderType: body.orderType as OrderType,
      customerName: body.customerName,
      phone: body.phone,
      pickupTime: body.pickupTime,
      notes: body.notes,
      totalCents,
      status: OrderStatus.PENDING,
      items: { create: lineItems },
    },
    include: { items: true },
  });

  res.status(201).json({
    id: order.id,
    code: order.code,
    status: order.status,
    orderType: order.orderType,
    total: order.totalCents / 100,
    customerName: order.customerName,
    phone: order.phone,
    pickupTime: order.pickupTime,
    notes: order.notes,
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.priceCents / 100,
    })),
  });
});

ordersRouter.get("/:code", async (req, res) => {
  const code = req.params.code?.trim();
  if (!code) {
    res.status(400).json({ error: "Order code required" });
    return;
  }
  const order = await prisma.order.findFirst({
    where: { code: { equals: code, mode: "insensitive" } },
    include: { items: true },
  });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({
    id: order.id,
    code: order.code,
    status: order.status,
    orderType: order.orderType,
    total: order.totalCents / 100,
    customerName: order.customerName,
    phone: order.phone,
    pickupTime: order.pickupTime,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.priceCents / 100,
    })),
  });
});
