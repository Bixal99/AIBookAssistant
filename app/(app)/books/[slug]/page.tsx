import { redirect } from "next/navigation";

import BookWorkspace from "@/components/workspace/BookWorkspace";
import { getBookWorkspaceBySlug } from "@/lib/actions/book.actions";
import { ROUTES } from "@/lib/auth-constants";

export const dynamic = "force-dynamic";

export default async function BookWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getBookWorkspaceBySlug(slug);

  if (!result.success || !result.data) {
    redirect(ROUTES.library);
  }

  return <BookWorkspace book={result.data} />;
}
