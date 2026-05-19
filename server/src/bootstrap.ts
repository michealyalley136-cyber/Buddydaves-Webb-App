import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./lib/prisma.js";

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Sync schema and seed menu/users when the database is empty (first Railway deploy).
 * Set SKIP_DB_BOOTSTRAP=true to disable (e.g. local dev with manual db:push).
 */
export async function runBootstrap(): Promise<void> {
  if (process.env.SKIP_DB_BOOTSTRAP === "true") {
    return;
  }
  if (process.env.NODE_ENV !== "production" && process.env.FORCE_DB_BOOTSTRAP !== "true") {
    return;
  }

  try {
    execSync("npx prisma db push --skip-generate", {
      cwd: serverRoot,
      stdio: "inherit",
      env: process.env,
    });
  } catch (e) {
    console.error("[bootstrap] prisma db push failed:", e);
    throw e;
  }

  let menuCount = 0;
  try {
    menuCount = await prisma.menuItem.count();
  } catch (e) {
    console.error("[bootstrap] Could not read menu items:", e);
    throw e;
  }

  if (menuCount > 0) {
    console.log(`[bootstrap] Database ready (${menuCount} menu items).`);
    return;
  }

  console.log("[bootstrap] No menu items — running seed…");
  try {
    execSync("npm run db:seed", {
      cwd: serverRoot,
      stdio: "inherit",
      env: process.env,
    });
  } catch (e) {
    console.error("[bootstrap] Seed failed:", e);
    throw e;
  }
}
