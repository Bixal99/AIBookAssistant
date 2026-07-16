-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "bookId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("bookId","categoryId")
);

-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "theme" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- AlterTable: Book ownership + cover size
-- Drop global unique on slug first
DROP INDEX IF EXISTS "Book_slug_key";

ALTER TABLE "Book" ADD COLUMN "userId" TEXT;
ALTER TABLE "Book" ADD COLUMN "coverFileSize" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: VoiceSession ownership
ALTER TABLE "VoiceSession" ADD COLUMN "userId" TEXT;

-- Ensure no orphan rows remain (dev wipe should have cleared books)
DELETE FROM "VoiceSession" WHERE "userId" IS NULL;
DELETE FROM "Book" WHERE "userId" IS NULL;

-- Make required
ALTER TABLE "Book" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "VoiceSession" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "BookCategory_categoryId_idx" ON "BookCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ReadingHistory_userId_lastOpenedAt_idx" ON "ReadingHistory"("userId", "lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_bookId_key" ON "ReadingHistory"("userId", "bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_slug_key" ON "Book"("userId", "slug");

-- CreateIndex
CREATE INDEX "Book_userId_createdAt_idx" ON "Book"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "VoiceSession_userId_startedAt_idx" ON "VoiceSession"("userId", "startedAt");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceSession" ADD CONSTRAINT "VoiceSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCategory" ADD CONSTRAINT "BookCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
