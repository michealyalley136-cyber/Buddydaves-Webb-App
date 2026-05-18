import { prisma } from "./prisma.js";
import type { Prisma } from "@prisma/client";

export async function writeAudit(
  userId: string | undefined,
  action: string,
  opts?: { entity?: string; entityId?: string; meta?: Prisma.InputJsonValue }
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity: opts?.entity,
      entityId: opts?.entityId,
      meta: opts?.meta,
    },
  });
}
