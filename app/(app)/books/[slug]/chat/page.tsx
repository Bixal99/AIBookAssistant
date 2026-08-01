import { redirect } from "next/navigation";

import BookAssistantPage from "@/components/workspace/BookAssistantPage";
import { getBookWorkspaceBySlug } from "@/lib/actions/book.actions";
import { ROUTES } from "@/lib/auth-constants";

export const dynamic = "force-dynamic";

export default async function BookChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getBookWorkspaceBySlug(slug);

  if (!result.success || !result.data) {
    redirect(ROUTES.library);
  }

  return <BookAssistantPage book={result.data} />;
}
