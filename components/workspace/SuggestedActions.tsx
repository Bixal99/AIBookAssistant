"use client";

type SuggestedActionsProps = {
  currentPage: number;
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function SuggestedActions({
  currentPage,
  onSelect,
  disabled,
}: SuggestedActionsProps) {
  const page = currentPage > 0 ? currentPage : 1;

  const prompts = [
    `Summarize page ${page} in clear plain language using only this book.`,
    `Explain the ideas on page ${page} simply, as if teaching a beginner.`,
    `Quiz me on page ${page} with 3 short questions and answers based only on this book.`,
    `List the key concepts on page ${page} with one-sentence definitions from the book.`,
    `Extract important quotes or definitions from page ${page}.`,
    `What related topics in this book connect to page ${page}?`,
  ];

  const labels = [
    "Summarize this page",
    "Explain simply",
    "Quiz me",
    "Key concepts",
    "Important quotes",
    "Related topics",
  ];

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--text-secondary)] uppercase">
        Suggested
      </p>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((prompt, index) => (
          <button
            key={labels[index]}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt)}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--landing-parchment-deep)] px-2.5 py-1 text-[11px] font-medium text-[var(--landing-ink)] transition-colors hover:bg-[var(--landing-maroon-soft)] hover:text-[var(--landing-maroon)] disabled:opacity-50"
          >
            {labels[index]}
          </button>
        ))}
      </div>
    </div>
  );
}
