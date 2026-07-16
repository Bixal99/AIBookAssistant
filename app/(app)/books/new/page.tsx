import UploadForm from "@/components/UploadForm";

const Page = async () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <section className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-[var(--landing-ink)] sm:text-3xl">
            Add a New Book
          </h1>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Upload a PDF to generate your interactive reading experience
          </p>
        </div>
      </section>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-card p-4 text-card-foreground sm:p-5">
        <UploadForm />
      </div>
    </div>
  );
};

export default Page;
