import React from "react";
import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";
import { getAllBooks } from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import Link from "next/link";
import { ROUTES } from "@/lib/auth-constants";
import LibraryBookActions from "@/components/library/LibraryBookActions";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;

  const bookResults = await getAllBooks(query);
  const books = bookResults.success ? (bookResults.data ?? []) : [];
  const hasQuery = Boolean(query?.trim());

  return (
    <div className="space-y-8">
      <HeroSection />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl font-bold text-[var(--landing-ink)]">
          Your Library
        </h2>
        <Search />
      </div>

      {!bookResults.success ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-5 text-destructive">
          <p className="font-semibold">Books could not be loaded.</p>
          <p className="mt-1 text-sm opacity-90">
            Check your PostgreSQL connection (`DATABASE_URL`) and make sure the
            database is reachable.
          </p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-medium)] bg-card px-6 py-10 text-center text-[var(--text-secondary)]">
          <p className="text-lg font-semibold text-[var(--landing-ink)]">
            {hasQuery
              ? "No matching books found."
              : "No books have been added yet."}
          </p>
          <p className="mt-2 text-sm">
            {hasQuery
              ? "Try a different title, author, or category."
              : "Upload your first PDF to start building your library."}
          </p>
          <Link
            href={ROUTES.booksNew}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--landing-maroon)] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Upload a book
          </Link>
        </div>
      ) : (
        <div className="library-books-grid">
          {books.map((book) => {
            const categoryName =
              "categories" in book && Array.isArray(book.categories)
                ? (
                    book.categories as Array<{
                      category?: { name?: string };
                    }>
                  )[0]?.category?.name
                : undefined;
            return (
            <div key={book._id} className="space-y-2">
              <BookCard
                title={book.title}
                author={book.author}
                coverURL={book.coverURL}
                slug={book.slug}
              />
              <LibraryBookActions
                bookId={book.id}
                title={book.title}
                author={book.author}
                slug={book.slug}
                category={categoryName}
              />
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
