import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/password.js";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const loginsPath = path.join(rootDir, "DEFAULT_LOGINS.txt");

/** Only categories that contain approved menu items */
const categories = [
  { name: "Sandwiches", slug: "sandwiches", sortOrder: 10 },
  { name: "Sides", slug: "sides", sortOrder: 20 },
  { name: "Drinks", slug: "drinks", sortOrder: 30 },
];

const REMOVED_CATEGORY_SLUGS = ["bbq", "breakfast", "frozen-treats"];

const APPROVED_ITEM_NAMES = [
  "Philly Cheesesteak",
  "Double Mushroom Melt",
  "Cheese Curds",
  "Gallon Fresh Made Rootbeer",
  "Rootbeer Float",
];

const staffEmail = "staff@buddyda.local";
const adminEmail = "admin@buddyda.local";
const defaultPassword = "BuddyDave2026!";

async function main() {
  for (const c of categories) {
    await prisma.menuCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder, active: true },
      create: c,
    });
  }

  await prisma.menuCategory.updateMany({
    where: { slug: { in: REMOVED_CATEGORY_SLUGS } },
    data: { active: false },
  });

  const bySlug = (slug: string) =>
    prisma.menuCategory.findFirstOrThrow({ where: { slug } });

  const sandwich = await bySlug("sandwiches");
  const sides = await bySlug("sides");
  const drinks = await bySlug("drinks");

  const menuSeeds: {
    categoryId: string;
    name: string;
    description: string | null;
    priceCents: number;
    imageUrl: string;
    sortOrder: number;
  }[] = [
    {
      categoryId: sandwich.id,
      name: "Philly Cheesesteak",
      description: "Provolone cheese with seasoned grilled peppers and onions",
      priceCents: 799,
      imageUrl:
        "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80",
      sortOrder: 10,
    },
    {
      categoryId: sandwich.id,
      name: "Double Mushroom Melt",
      description: null,
      priceCents: 769,
      imageUrl:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80",
      sortOrder: 20,
    },
    {
      categoryId: sides.id,
      name: "Cheese Curds",
      description: null,
      priceCents: 599,
      imageUrl:
        "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&q=80",
      sortOrder: 10,
    },
    {
      categoryId: drinks.id,
      name: "Gallon Fresh Made Rootbeer",
      description: "Fresh made rootbeer",
      priceCents: 799,
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
      sortOrder: 10,
    },
    {
      categoryId: drinks.id,
      name: "Rootbeer Float",
      description: "Rootbeer made fresh daily",
      priceCents: 499,
      imageUrl:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      sortOrder: 20,
    },
  ];

  for (const m of menuSeeds) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: m.name },
    });
    if (existing) {
      await prisma.menuItem.update({
        where: { id: existing.id },
        data: {
          categoryId: m.categoryId,
          description: m.description,
          priceCents: m.priceCents,
          imageUrl: m.imageUrl,
          sortOrder: m.sortOrder,
          active: true,
        },
      });
    } else {
      await prisma.menuItem.create({
        data: {
          categoryId: m.categoryId,
          name: m.name,
          description: m.description,
          priceCents: m.priceCents,
          imageUrl: m.imageUrl,
          sortOrder: m.sortOrder,
          active: true,
        },
      });
    }
  }

  await prisma.menuItem.updateMany({
    where: { name: { notIn: APPROVED_ITEM_NAMES } },
    data: { active: false },
  });

  const staffHash = await hashPassword(defaultPassword);
  await prisma.user.upsert({
    where: { email: staffEmail },
    update: { passwordHash: staffHash, name: "Staff User", role: Role.staff },
    create: {
      email: staffEmail,
      passwordHash: staffHash,
      name: "Staff User",
      role: Role.staff,
    },
  });
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: staffHash, name: "Admin User", role: Role.admin },
    create: {
      email: adminEmail,
      passwordHash: staffHash,
      name: "Admin User",
      role: Role.admin,
    },
  });

  const body = [
    "Buddy Dave's — DEFAULT LOGINS (local development only)",
    "=======================================================",
    "",
    `Staff:  ${staffEmail}`,
    `Admin:  ${adminEmail}`,
    `Password (both): ${defaultPassword}`,
    "",
    "Rotate these credentials before any public deployment.",
    "This file is gitignored and created by: npm run db:seed -w server",
    "",
  ].join("\n");

  fs.writeFileSync(loginsPath, body, "utf8");
  console.log(`Wrote ${loginsPath}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
