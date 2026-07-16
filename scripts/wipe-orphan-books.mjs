/**
 * Deletes all development books, cascading segments/sessions in DB,
 * and removes associated Vercel Blob files. Run BEFORE the ownership migration.
 *
 * Usage: node --env-file=.env.local scripts/wipe-orphan-books.mjs
 */
import { PrismaClient } from "@prisma/client";
import { del } from "@vercel/blob";

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      fileBlobKey: true,
      coverBlobKey: true,
    },
  });

  console.log(`Found ${books.length} book(s) to wipe.`);

  const blobKeys = books
    .flatMap((b) => [b.fileBlobKey, b.coverBlobKey])
    .filter((key) => typeof key === "string" && key.length > 0);

  if (blobKeys.length > 0) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn(
        "BLOB_READ_WRITE_TOKEN missing — skipping blob deletion. DB rows will still be removed.",
      );
    } else {
      console.log(`Deleting ${blobKeys.length} blob(s)...`);
      try {
        await del(blobKeys);
        console.log("Blob files deleted.");
      } catch (err) {
        console.warn("Blob deletion failed (continuing with DB wipe):", err);
      }
    }
  }

  // Cascades BookSegment + VoiceSession (current schema)
  const result = await prisma.book.deleteMany();
  console.log(`Deleted ${result.count} book row(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
