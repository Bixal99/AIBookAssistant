import React from "react";
import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";
import { getAllBooks } from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import Link from "next/link";

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
    <main className="wrapper container">
      <HeroSection />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
        <h2 className="text-3xl font-serif font-bold text-[#212a3b]">
          Recent Books
        </h2>
        <Search />
      </div>

      {!bookResults.success ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-900">
          <p className="font-semibold">Books could not be loaded.</p>
          <p className="mt-1 text-sm">
            Check your MongoDB connection string and make sure the database is
            reachable.
          </p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#c7baa3] bg-white/70 px-6 py-10 text-center text-[#5b5462]">
          <p className="text-lg font-semibold text-[#212a3b]">
            {hasQuery
              ? "No matching books found."
              : "No books have been added yet."}
          </p>
          <p className="mt-2 text-sm">
            {hasQuery
              ? "Try a different title or author, or clear the search to view the full library."
              : "Upload your first PDF to start building your library and generate AI conversations."}
          </p>
          <Link
            href="/books/new"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#212a3b] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Add a book
          </Link>
        </div>
      ) : (
        <div className="library-books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Page;
