/**
 * Dev-only: set a new password for an existing user (credential account).
 *
 * Usage:
 *   node --env-file=.env scripts/reset-password.mjs <email> <newPassword>
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

const email = process.argv[2]?.trim().toLowerCase();
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error(
    "Usage: node --env-file=.env scripts/reset-password.mjs <email> <newPassword>",
  );
  process.exit(1);
}

if (newPassword.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  const hashed = await hashPassword(newPassword);

  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (!account) {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashed,
      },
    });
    console.log(`Created credential account and set password for ${user.email}`);
  } else {
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashed },
    });
    console.log(`Password updated for ${user.email}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
