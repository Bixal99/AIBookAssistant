import { redirect } from "next/navigation";

import SettingsForm from "@/components/settings/SettingsForm";
import { getUserProfile } from "@/lib/actions/profile.actions";
import { ROUTES } from "@/lib/auth-constants";

export default async function SettingsPage() {
  const profile = await getUserProfile();
  if (!profile.success || !profile.data) {
    redirect(ROUTES.signIn);
  }

  return <SettingsForm initial={profile.data} />;
}
