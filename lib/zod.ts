import { z } from 'zod';
import {MAX_FILE_SIZE, ACCEPTED_PDF_TYPES} from './constants';
import { AUTH_COPY } from './auth-constants';

export const SignInSchema = z.object({
    email: z.email({ message: "Enter a valid email address" }),
    password: z.string().min(1, "Password is required"),
});

export const SignUpSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(80, "Name is too long"),
        email: z.email({ message: "Enter a valid email address" }),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password is too long"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: AUTH_COPY.errors.passwordMismatch,
        path: ["confirmPassword"],
    });

export const UploadSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    author: z.string().min(1, "Author name is required").max(100, "Author name is too long"),
    category: z.string().max(80, "Category is too long").optional().or(z.literal("")),
    persona: z.string().min(1, "Please select a voice"),
    pdfFile: z.instanceof(File, { message: "PDF file is required" })
        .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 50MB")
        .refine((file) => ACCEPTED_PDF_TYPES.includes(file.type), "Only PDF files are accepted"),
});
