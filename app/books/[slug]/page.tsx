import { redirect } from "next/navigation";

import { getBookBySlug } from "@/lib/actions/book.actions";
import VapiControls from "@/components/VapiControls";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="book-page-container">
      <Link href={ROUTES.library} className="back-btn-floating">
        <ArrowLeft className="size-6 text-[#212a3b]" />
      </Link>

      <VapiControls book={book} />
    </div>
  );
}
