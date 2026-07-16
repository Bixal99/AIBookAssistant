import { ReactNode } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import z from "zod";
import { UploadSchema } from "@/lib/zod";

// ============================================
// DATABASE MODELS
// ============================================

export interface IBook {
  _id: string;
  id: string;
  userId: string;
  title: string;
  slug: string;
  author: string;
  persona?: string | null;
  fileURL: string;
  fileBlobKey: string;
  coverURL?: string | null;
  coverBlobKey?: string | null;
  fileSize: number;
  coverFileSize?: number;
  totalSegments: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  categories?: Array<{
    category: { id: string; name: string; slug: string };
  }>;
}

export interface IBookSegment {
  _id: string;
  id: string;
  bookId: string;
  content: string;
  segmentIndex: number;
  pageNumber?: number | null;
  wordCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IVoiceSession {
  _id: string;
  id: string;
  bookId: string;
  userId: string;
  startedAt: Date | string;
  endedAt?: Date | string | null;
  durationSeconds: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ============================================
// FORM & INPUT TYPES
// ============================================

export type BookUploadFormValues = z.infer<typeof UploadSchema>;

export interface CreateBook {
  title: string;
  author: string;
  persona?: string;
  category?: string;
  fileURL: string;
  fileBlobKey: string;
  coverURL?: string;
  coverBlobKey?: string;
  fileSize: number;
  coverFileSize?: number;
}

export interface TextSegment {
  text: string;
  segmentIndex: number;
  pageNumber?: number;
  wordCount: number;
}

export interface BookCardProps {
  title: string;
  author: string;
  coverURL?: string | null;
  slug: string;
}

export interface Messages {
  role: string;
  content: string;
}

export interface ShadowBoxProps {
  children: ReactNode;
  className?: string;
}

export interface VoiceSelectorProps {
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange: (voiceId: string) => void;
  compact?: boolean;
}

export interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface FileUploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  acceptTypes: string[];
  disabled?: boolean;
  icon: LucideIcon;
  placeholder: string;
  hint: string;
  compact?: boolean;
}

export interface StartSessionResult {
  success: boolean;
  sessionId?: string;
  maxDurationMinutes?: number;
  error?: string;
  isBillingError?: boolean;
}

export interface EndSessionResult {
  success: boolean;
  error?: string;
}

// Fallback module declarations for packages missing type definitions in this workspace
declare module "sonner";
declare module "@vercel/blob/client";
declare module "@hookform/resolvers/zod";
declare module "react-hook-form";
declare module "lucide-react";
declare module "next/navigation";
