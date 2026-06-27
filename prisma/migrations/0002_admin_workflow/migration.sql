-- AlterTable
ALTER TABLE "ContactInquiry"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN "internalNote" TEXT,
ADD COLUMN "handledAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ContactInquiry_status_createdAt_idx" ON "ContactInquiry"("status", "createdAt");
