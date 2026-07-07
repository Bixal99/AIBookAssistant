import { BookOpen, FileUp, Sparkles } from "lucide-react";

const uploadSteps = [
  "Choose a PDF that is under the supported file size.",
  "Add a title and any optional notes for the book.",
  "Submit to begin processing the book for chat and voice access.",
];

export default function NewBookPage() {
  return (
    <main className="new-book">
      <section className="new-book-wrapper">
        <div className="flex items-center gap-3 text-[var(--color-brand)]">
          <Sparkles className="size-5" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            Add New Book
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="page-title-xl">
            Upload a book to start a new conversation
          </h1>
          <p className="subtitle max-w-2xl">
            Create a new book entry by uploading a PDF, then turn it into an
            interactive reading experience with AI-powered chat.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form className="space-y-6 rounded-2xl border border-[var(--border-subtle)] bg-white p-6 shadow-soft-md">
            <div className="space-y-2">
              <label className="form-label" htmlFor="title">
                Book title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter the title of your book"
                className="form-input"
              />
            </div>

            <div className="space-y-2">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                placeholder="Optional context or summary for the book"
                className="form-input resize-none"
              />
            </div>

            <label className="upload-dropzone upload-dropzone-uploaded">
              <input className="sr-only" type="file" accept="application/pdf" />
              <FileUp className="upload-dropzone-icon" />
              <span className="upload-dropzone-text">
                Drop your PDF here or click to browse
              </span>
              <span className="upload-dropzone-hint">PDF files only</span>
            </label>

            <button type="submit" className="form-btn">
              Upload Book
            </button>
          </form>

          <aside className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-soft-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-[var(--accent-warm)]" />
              <h2 className="section-title">What happens next</h2>
            </div>

            <ul className="space-y-3">
              {uploadSteps.map((step, index) => (
                <li key={step} className="library-step-item">
                  <span className="library-step-number">{index + 1}</span>
                  <p className="library-step-description">{step}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
