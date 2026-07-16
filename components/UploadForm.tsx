"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { UploadSchema } from "@/lib/zod";
import { BookUploadFormValues } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ACCEPTED_PDF_TYPES } from "@/lib/constants";
import FileUploader from "./FileUploader";
import VoiceSelector from "./VoiceSelector";
import LoadingOverlay, {
  type UploadStepId,
} from "./LoadingOverlay";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

type ProgressState = {
  progress: number;
  stepId: UploadStepId;
  detail?: string;
};

const fieldLabel = "text-sm font-medium text-[var(--landing-ink)]";

/** Parse + index after navigation so the chat opens without waiting. */
async function indexBookInBackground(bookId: string, pdfFile: File) {
  try {
    const parsedPDF = await parsePDFFile(pdfFile);
    if (parsedPDF.content.length === 0) {
      toast.error("Could not extract text — voice search may be limited.");
      return;
    }
    const segments = await saveBookSegments(bookId, parsedPDF.content);
    if (!segments.success) {
      toast.error("Indexing failed — voice search may be limited.");
    }
  } catch (error) {
    console.error("Background indexing failed", error);
    toast.error("Indexing failed — voice search may be limited.");
  }
}

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressState, setProgressState] = useState<ProgressState>({
    progress: 0,
    stepId: "check",
  });
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setStep = (
    stepId: UploadStepId,
    progress: number,
    detail?: string,
  ) => {
    setProgressState({ stepId, progress, detail });
  };

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      category: "",
      persona: "",
      pdfFile: undefined,
    },
  });

  const onSubmit = async (data: BookUploadFormValues) => {
    setIsSubmitting(true);
    setStep("check", 8);

    try {
      const existsCheck = await checkBookExists(data.title);

      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const fileTitle = data.title.replace(/\s+/g, "-").toLowerCase();
      const pdfFile = data.pdfFile;

      setStep("uploadPdf", 20, "0%");
      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
        onUploadProgress: ({ percentage }) => {
          const mapped = 20 + Math.round((percentage / 100) * 50);
          setStep("uploadPdf", mapped, `${Math.round(percentage)}%`);
        },
      });
      setStep("uploadPdf", 72, "Complete");

      setStep("create", 82, "Writing to library…");
      const book = await createBook({
        title: data.title,
        author: data.author,
        persona: data.persona,
        category: data.category?.trim() || undefined,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        fileSize: pdfFile.size,
      });

      if (!book.success || !book.data) {
        toast.error((book.error as string) || "Failed to create book");
        return;
      }

      if (book.alreadyExists) {
        toast.info("Book with same title already exists.");
        form.reset();
        router.push(`/books/${book.data.slug}`);
        return;
      }

      setStep("done", 100, "Opening chat…");
      toast.success(
        "Book uploaded — opening chat. Indexing continues in the background.",
      );
      form.reset();
      router.push(`/books/${book.data.slug}`);

      // Do not await — chat should open immediately
      void indexBookInBackground(book.data._id, pdfFile);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload book. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setProgressState({ progress: 0, stepId: "check" });
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {isSubmitting ? (
        <LoadingOverlay
          progress={progressState.progress}
          stepId={progressState.stepId}
          detail={progressState.detail}
        />
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch">
            <FileUploader
              control={form.control}
              name="pdfFile"
              label="Book PDF File"
              acceptTypes={ACCEPTED_PDF_TYPES}
              icon={Upload}
              placeholder="Click to upload PDF"
              hint="Max 50MB · indexing runs after you enter chat"
              disabled={isSubmitting}
              compact
            />

            <div className="grid gap-3 content-start sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className={fieldLabel}>Title</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 bg-[var(--bg-primary)] dark:bg-[var(--bg-secondary)]"
                        placeholder="ex: Rich Dad Poor Dad"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabel}>Author</FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 bg-[var(--bg-primary)] dark:bg-[var(--bg-secondary)]"
                        placeholder="ex: Robert Kiyosaki"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={fieldLabel}>
                      Category{" "}
                      <span className="font-normal text-[var(--text-muted)]">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-10 bg-[var(--bg-primary)] dark:bg-[var(--bg-secondary)]"
                        placeholder="e.g. Fiction, ML"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={fieldLabel}>
                  Assistant Voice
                </FormLabel>
                <FormControl>
                  <VoiceSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    compact
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-[var(--landing-maroon)] text-base font-semibold !text-white hover:bg-[var(--landing-maroon-hover)]"
          >
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UploadForm;
