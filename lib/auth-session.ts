import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ROUTES, ROLES, type AppRole } from "@/lib/auth-constants";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession(callbackUrl?: string) {
  const session = await getSession();

  if (!session) {
    const params = new URLSearchParams();
    if (callbackUrl) {
      params.set("callbackUrl", callbackUrl);
    }
    const query = params.toString();
    redirect(query ? `${ROUTES.signIn}?${query}` : ROUTES.signIn);
  }

  return session;
}

export function getUserRole(
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>,
): AppRole {
  const role = session.user.role;
  if (role === ROLES.admin) return ROLES.admin;
  return ROLES.user;
}

export function isAdmin(
  session: NonNullable<Awaited<ReturnType<typeof getSession>>> | null,
): boolean {
  if (!session) return false;
  return getUserRole(session) === ROLES.admin;
}
