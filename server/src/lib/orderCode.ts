import { prisma } from "./prisma.js";

function formatDatePart(d: Date) {
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

export async function generateOrderCode(now = new Date()) {
  const datePart = formatDatePart(now);
  const prefix = `BD-${datePart}-`;

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const count = await prisma.order.count({
    where: { createdAt: { gte: todayStart } },
  });

  const seq = String(count + 1).padStart(4, "0");
  let code = `${prefix}${seq}`;

  const exists = await prisma.order.findUnique({ where: { code } });
  if (exists) {
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    code = `${prefix}${rand}`;
  }

  return code;
}
