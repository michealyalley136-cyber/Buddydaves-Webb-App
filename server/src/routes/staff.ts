import { Router } from "express";
import { z } from "zod";
import { OrderStatus, OrderType } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { writeAudit } from "../lib/audit.js";
import { generateOrderCode } from "../lib/orderCode.js";

export const staffRouter = Router();

staffRouter.get(
  "/orders",
  requireAuth("staff", "admin"),
  async (req, res) => {
    const view = req.query.view as string | undefined;
    const where =
      view === "completed"
        ? { status: OrderStatus.COMPLETED }
        : { status: { not: OrderStatus.COMPLETED } };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: view === "completed" ? "desc" : "desc" },
      include: { items: true },
      take: 200,
    });
    res.json({
      orders: orders.map((o) => ({
        id: o.id,
        code: o.code,
        status: o.status,
        orderType: o.orderType,
        customerName: o.customerName,
        phone: o.phone,
        pickupTime: o.pickupTime,
        notes: o.notes,
        total: o.totalCents / 100,
        createdAt: o.createdAt,
        itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
      })),
    });
  }
);

const patchSchema = z.object({
  status: z.enum([
    OrderStatus.PENDING,
    OrderStatus.PREPARING,
    OrderStatus.READY,
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED,
  ]),
});

staffRouter.patch(
  "/orders/:id/status",
  requireAuth("staff", "admin"),
  async (req, res) => {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const id = req.params.id;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const next = parsed.data.status;
    const updated = await prisma.order.update({
      where: { id },
      data: { status: next },
    });
    const user = (req as AuthedRequest).user;
    await writeAudit(user?.id, "order.status_changed", {
      entity: "Order",
      entityId: id,
      meta: { from: order.status, to: next },
    });
    res.json({ id: updated.id, code: updated.code, status: updated.status });
  }
);

/** Demo / kitchen trial — creates a pending order for presentation. */
staffRouter.post(
  "/demo-order",
  requireAuth("staff", "admin"),
  async (req, res) => {
    const item = await prisma.menuItem.findFirst({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    if (!item) {
      res.status(400).json({ error: "No active menu items to demo" });
      return;
    }

    const code = await generateOrderCode();
    const order = await prisma.order.create({
      data: {
        code,
        orderType: OrderType.pickup,
        customerName: "Demo Customer",
        phone: "(865) 555-0100",
        pickupTime: "ASAP",
        notes: "Kitchen demo order — safe to complete or cancel",
        totalCents: item.priceCents,
        status: OrderStatus.PENDING,
        items: {
          create: [
            {
              menuItemId: item.id,
              name: item.name,
              priceCents: item.priceCents,
              quantity: 1,
            },
          ],
        },
      },
      include: { items: true },
    });

    const user = (req as AuthedRequest).user;
    await writeAudit(user?.id, "order.demo_created", {
      entity: "Order",
      entityId: order.id,
      meta: { code: order.code },
    });

    res.status(201).json({
      id: order.id,
      code: order.code,
      status: order.status,
      orderType: order.orderType,
      customerName: order.customerName,
      phone: order.phone,
      pickupTime: order.pickupTime,
      notes: order.notes,
      total: order.totalCents / 100,
      createdAt: order.createdAt,
      itemCount: order.items.reduce((n, i) => n + i.quantity, 0),
    });
  }
);
