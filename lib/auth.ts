import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/db";
import { ROLES } from "@/lib/auth-constants";

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.trim().toLowerCase());
}

function getAuthBaseUrl(): string {
  const envUrl = process.env.BETTER_AUTH_URL;
  if (envUrl && (!process.env.VERCEL || !envUrl.includes("localhost"))) {
    return envUrl;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return envUrl || "http://localhost:3000";
}

export const auth = betterAuth({
  baseURL: getAuthBaseUrl(),
  trustedOrigins: [
    "https://*.vercel.app",
    "http://localhost:3000",
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_BASE_URL ? [process.env.NEXT_PUBLIC_BASE_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = isAdminEmail(user.email) ? ROLES.admin : ROLES.user;
          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: ROLES.user,
      adminRoles: [ROLES.admin],
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
