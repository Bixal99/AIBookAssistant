"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  deleteBook,
  updateBookMetadata,
} from "@/lib/actions/book.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  bookId: string;
  title: string;
  author: string;
  slug: string;
  category?: string;
};

export default function LibraryBookActions({
  bookId,
  title,
  author,
  category,
}: Props) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title,
    author,
    category: category || "",
  });

  const onSave = async () => {
    setBusy(true);
    const result = await updateBookMetadata(bookId, form);
    setBusy(false);
    if (!result.success) {
      toast.error(
        typeof result.error === "string"
          ? result.error
          : "Failed to update book",
      );
      return;
    }
    toast.success("Book updated");
    setEditOpen(false);
    router.refresh();
  };

  const onDelete = async () => {
    setBusy(true);
    const result = await deleteBook(bookId);
    setBusy(false);
    if (!result.success) {
      toast.error("Failed to delete book");
      return;
    }
    toast.success("Book deleted");
    setDeleteOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setForm({ title, author, category: category || "" });
            setEditOpen(true);
          }}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={form.category}
                placeholder="Optional"
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled={busy}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{title}”?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This permanently removes the book, segments, voice sessions, and
            stored files.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={busy}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
