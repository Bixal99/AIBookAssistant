import { redirect } from "next/navigation";

import { getBookBySlug, recordBookOpen } from "@/lib/actions/book.actions";
import BookSessionNav from "@/components/BookSessionNav";
import VapiControls from "@/components/VapiControls";
import { requireSession } from "@/lib/auth-session";
import { ROUTES } from "@/lib/auth-constants";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireSession(`/books/${slug}`);

  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect(ROUTES.library);
  }

  const book = result.data;
  await recordBookOpen(book.id);

  return (
    <div className="book-page-container">
      <BookSessionNav />
      <VapiControls book={book} />
    </div>
  );
}
