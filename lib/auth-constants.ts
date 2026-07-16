export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/dashboard",
  library: "/library",
  booksNew: "/books/new",
  settings: "/settings",
  admin: "/admin",
  notifications: "/notifications",
} as const;

export const ROLES = {
  user: "user",
  admin: "admin",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export const AUTH_COPY = {
  brand: "BookBy",
  signIn: {
    headline: "Welcome back",
    support: "Sign in to open your dashboard and keep talking with your books.",
    submit: "Sign in",
    switchPrompt: "New here?",
    switchLink: "Create an account",
  },
  signUp: {
    headline: "Create your account",
    support: "Get started with BookBy — upload a PDF and explore it by voice.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchLink: "Sign in",
  },
  fields: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Re-enter your password",
  },
  errors: {
    generic: "Something went wrong. Please try again.",
    invalidCredentials: "Invalid email or password.",
    emailTaken: "An account with this email already exists.",
    passwordMismatch: "Passwords do not match.",
  },
  signOut: "Sign out",
  getStarted: "Get Started",
  signInCta: "Sign in",
} as const;
