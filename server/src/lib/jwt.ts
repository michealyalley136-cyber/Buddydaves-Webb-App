import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import type { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is required in production");
}

const secret = (JWT_SECRET ?? "dev-only-secret-change-me") as Secret;

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
};

export function signToken(payload: JwtPayload, expiresIn: SignOptions["expiresIn"] = "7d") {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}
