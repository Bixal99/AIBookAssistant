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

export const auth = betterAuth({
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
