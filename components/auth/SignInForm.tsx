"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { AUTH_COPY, ROUTES } from "@/lib/auth-constants";
import { SignInSchema } from "@/lib/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SignInValues = z.infer<typeof SignInSchema>;

type SignInFormProps = {
  callbackUrl?: string;
};

const SignInForm = ({ callbackUrl = ROUTES.library }: SignInFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    setSubmitting(true);
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: callbackUrl,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || AUTH_COPY.errors.invalidCredentials);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[var(--landing-ink)]">
                {AUTH_COPY.fields.email}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder={AUTH_COPY.fields.emailPlaceholder}
                  className="h-12 rounded-[10px] border-[var(--border-subtle)] bg-white/80 text-base shadow-[var(--shadow-soft-sm)]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[var(--landing-ink)]">
                {AUTH_COPY.fields.password}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder={AUTH_COPY.fields.passwordPlaceholder}
                    className="h-12 rounded-[10px] border-[var(--border-subtle)] bg-white/80 pr-11 text-base shadow-[var(--shadow-soft-sm)]"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-[var(--text-secondary)] hover:text-[var(--landing-maroon)]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={submitting}
          className="h-12 w-full cursor-pointer rounded-[10px] bg-[var(--landing-maroon)] text-base font-bold text-white shadow-[var(--shadow-soft-sm)] hover:bg-[var(--landing-maroon-hover)]"
          style={{ fontFamily: "var(--font-ibm-plex-serif), serif" }}
        >
          {submitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            AUTH_COPY.signIn.submit
          )}
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          {AUTH_COPY.signIn.switchPrompt}{" "}
          <Link
            href={ROUTES.signUp}
            className="font-semibold text-[var(--landing-maroon)] hover:opacity-80"
          >
            {AUTH_COPY.signIn.switchLink}
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;
