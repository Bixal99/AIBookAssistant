"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { markAllNotificationsRead } from "@/lib/actions/notification.actions";
import { Button } from "@/components/ui/button";

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      className="rounded-full"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await markAllNotificationsRead();
          router.refresh();
        });
      }}
    >
      {pending ? "Updating…" : "Mark all as read"}
    </Button>
  );
}
