"use client";

import { useState, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import {
  changeUserPassword,
  updateUserProfile,
} from "@/lib/actions/profile.actions";
import { authClient } from "@/lib/auth-client";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ProfileFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  bio: z.string().max(500).optional(),
  theme: z.enum(["light", "dark", "system"]),
  image: z.string().optional(),
});

const PasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
type PasswordValues = z.infer<typeof PasswordSchema>;

type SettingsFormProps = {
  initial: {
    name: string;
    email: string;
    image?: string | null;
    bio: string;
    theme: string;
  };
};

const sectionClass =
  "space-y-5 rounded-2xl border border-[var(--border-subtle)] bg-card p-5 text-card-foreground shadow-none sm:p-6";

const fieldInputClass =
  "h-10 bg-[var(--bg-primary)] dark:bg-[var(--bg-secondary)]";

const selectClass =
  "flex h-10 w-full rounded-xl border border-[var(--border-medium)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--landing-ink)] outline-none focus-visible:border-[var(--landing-maroon)] focus-visible:ring-[3px] focus-visible:ring-[var(--landing-maroon)]/20 dark:bg-[var(--bg-secondary)]";

function PasswordInput({
  className,
  autoComplete,
  ...props
}: ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={cn(className, "pr-11")}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-[var(--text-secondary)] hover:text-[var(--landing-maroon)]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export default function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: initial.name,
      bio: initial.bio,
      theme: (initial.theme as ProfileFormValues["theme"]) || "system",
      image: initial.image || "",
    },
  });

  const pwForm = useForm<PasswordValues>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSaveProfile = async (values: ProfileFormValues) => {
    setSaving(true);
    const result = await updateUserProfile(values);
    setSaving(false);
    if (!result.success) {
      toast.error(result.error || AUTH_COPY.errors.generic);
      return;
    }
    setTheme(values.theme);
    toast.success("Profile updated");
    router.refresh();
  };

  const onChangePassword = async (values: PasswordValues) => {
    setPwSaving(true);
    const result = await changeUserPassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
    setPwSaving(false);
    if (!result.success) {
      toast.error(result.error || AUTH_COPY.errors.generic);
      return;
    }
    toast.success("Password changed");
    pwForm.reset();
  };

  const onSignOut = async () => {
    await authClient.signOut();
    router.push(ROUTES.home);
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 text-[var(--landing-ink)]">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-[var(--landing-ink)] sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Manage your profile, appearance, and security.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={sectionClass}>
          <h2 className="font-serif text-xl font-semibold text-[var(--landing-ink)]">
            Profile
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSaveProfile)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input className={fieldInputClass} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--landing-ink)]">
                  Email
                </label>
                <Input
                  value={initial.email}
                  disabled
                  className={fieldInputClass}
                />
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        className={fieldInputClass}
                        placeholder="https://…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input
                        className={fieldInputClass}
                        placeholder="A short bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <FormControl>
                      <select
                        className={selectClass}
                        value={field.value}
                        onChange={(e) => {
                          const next = e.target
                            .value as ProfileFormValues["theme"];
                          field.onChange(next);
                          setTheme(next);
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="rounded-full"
                >
                  {saving ? "Saving…" : "Save profile"}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <section className={sectionClass}>
          <h2 className="font-serif text-xl font-semibold text-[var(--landing-ink)]">
            Password
          </h2>
          <Form {...pwForm}>
            <form
              onSubmit={pwForm.handleSubmit(onChangePassword)}
              className="grid gap-4"
            >
              <FormField
                control={pwForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={fieldInputClass}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={pwForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          className={fieldInputClass}
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={pwForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          className={fieldInputClass}
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={pwSaving}
                className="w-fit rounded-full"
              >
                {pwSaving ? "Updating…" : "Change password"}
              </Button>
            </form>
          </Form>
        </section>
      </div>

      <section className="space-y-4 rounded-2xl border border-destructive/30 bg-card p-5 sm:p-6">
        <h2 className="font-serif text-xl font-semibold text-destructive">
          Danger Zone
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Sign out of BookBy on this device. Account deletion is not available
          in this release — contact support if you need your account removed.
        </p>
        <Separator />
        <Button
          variant="destructive"
          type="button"
          onClick={onSignOut}
          className="rounded-full"
        >
          Sign out
        </Button>
      </section>
    </div>
  );
}
