import { PrismaClient } from "@prisma/client";

/**
 * Next.js evaluates route modules while collecting page data during `next build`.
 * Vercel may not expose secrets in that step (or NEXT_PHASE may be unset), so allow a
 * non-connecting placeholder only when we are clearly in a build/CI context without a URL.
 * Runtime still requires a real DATABASE_URL.
 */
function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const isBuildContext =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-export" ||
    (process.env.VERCEL === "1" && process.env.CI === "1");

  if (isBuildContext) {
    return "postgresql://build:build@127.0.0.1:5432/build";
  }

  throw new Error("Please define the DATABASE_URL environment variable");
}

const DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: DATABASE_URL },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
