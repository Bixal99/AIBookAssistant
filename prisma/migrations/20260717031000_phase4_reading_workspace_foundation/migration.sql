CREATE TABLE "ReadingProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "currentPage" INTEGER NOT NULL DEFAULT 1,
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingSession_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ReadingProgress" (
    "id",
    "userId",
    "bookId",
    "currentPage",
    "totalPages",
    "percentage",
    "lastOpenedAt",
    "createdAt",
    "updatedAt"
)
SELECT
    'rp_' || substr(md5(random()::text || clock_timestamp()::text || "userId" || "bookId"), 1, 24),
    "userId",
    "bookId",
    1,
    0,
    0,
    "lastOpenedAt",
    "lastOpenedAt",
    "lastOpenedAt"
FROM "ReadingHistory";

CREATE UNIQUE INDEX "ReadingProgress_userId_bookId_key" ON "ReadingProgress"("userId", "bookId");
CREATE INDEX "ReadingProgress_userId_idx" ON "ReadingProgress"("userId");
CREATE INDEX "ReadingProgress_bookId_idx" ON "ReadingProgress"("bookId");
CREATE INDEX "ReadingProgress_userId_lastOpenedAt_idx" ON "ReadingProgress"("userId", "lastOpenedAt");

CREATE INDEX "ReadingSession_userId_startedAt_idx" ON "ReadingSession"("userId", "startedAt");
CREATE INDEX "ReadingSession_bookId_startedAt_idx" ON "ReadingSession"("bookId", "startedAt");

ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReadingSession" ADD CONSTRAINT "ReadingSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReadingSession" ADD CONSTRAINT "ReadingSession_bookId_fkey"
  FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP TABLE "ReadingHistory";
