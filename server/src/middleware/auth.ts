import type { RequestHandler } from "express";
import type { Role } from "@prisma/client";
import { verifyToken } from "../lib/jwt.js";

export type AuthedRequest = {
  user?: { id: string; email: string; role: Role };
};

function getBearer(req: Parameters<RequestHandler>[0]) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7);
}

export const requireAuth =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    const token = getBearer(req);
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const payload = verifyToken(token);
      if (roles.length && !roles.includes(payload.role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      (req as AuthedRequest).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
