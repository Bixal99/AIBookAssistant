import Link from "next/link";
import { redirect } from "next/navigation";

import { getAllBooksAdmin } from "@/lib/actions/book.actions";
import { requireSession, isAdmin } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";

export default async function AdminPage() {
  const session = await requireSession(ROUTES.admin);
  if (!isAdmin(session)) {
    redirect(ROUTES.dashboard);
  }

  const result = await getAllBooksAdmin();
  const books = result.success ? (result.data ?? []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Admin</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          All books across users. Full admin analytics come later.
        </p>
      </div>

      {!result.success ? (
        <p className="text-sm text-destructive">Failed to load books.</p>
      ) : books.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">No books in the system.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-card text-card-foreground">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Uploaded</th>
                <th className="px-4 py-3 font-medium">Open</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                const owner =
                  "user" in book && book.user
                    ? (book.user as { email?: string; name?: string })
                    : null;
                return (
                  <tr
                    key={book.id}
                    className="border-b border-[var(--border-subtle)] last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">{book.title}</td>
                    <td className="px-4 py-3">{book.author}</td>
                    <td className="px-4 py-3">
                      {owner?.email || owner?.name || book.userId}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/books/${book.slug}`}
                        className="text-[var(--landing-maroon)] underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
