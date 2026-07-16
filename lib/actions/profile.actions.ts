"use server";

import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireAuthSession } from "@/lib/book-access";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ProfileSchema = z.object({
  name: z.string().min(1).max(80),
  bio: z.string().max(500).optional().nullable(),
  theme: z.enum(["light", "dark", "system"]).optional().nullable(),
  image: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => !v || v === "" || /^https?:\/\//.test(v),
      "Enter a valid image URL",
    ),
});

export async function getUserProfile() {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  return {
    success: true as const,
    data: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      bio: profile?.bio ?? "",
      theme: profile?.theme ?? "system",
    },
  };
}

export async function updateUserProfile(input: z.infer<typeof ProfileSchema>) {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const parsed = ProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid profile data" };
  }

  const { name, bio, theme, image } = parsed.data;

  await auth.api.updateUser({
    body: {
      name,
      image: image || undefined,
    },
    headers: await headers(),
  });

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      bio: bio || null,
      theme: theme || "system",
    },
    update: {
      bio: bio || null,
      theme: theme || "system",
    },
  });

  return { success: true as const };
}

export async function changeUserPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await requireAuthSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  if (!input.currentPassword || input.newPassword.length < 8) {
    return { success: false as const, error: "Invalid password" };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      },
      headers: await headers(),
    });
    return { success: true as const };
  } catch (e) {
    console.error("changePassword failed", e);
    return {
      success: false as const,
      error: "Could not change password. Check your current password.",
    };
  }
}
