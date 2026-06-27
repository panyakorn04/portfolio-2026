-- CreateTable
CREATE TABLE "ContactInquiryActivity" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorLabel" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "statusFrom" TEXT,
    "statusTo" TEXT,
    "internalNoteFrom" TEXT,
    "internalNoteTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactInquiryActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactInquiryActivity_inquiryId_createdAt_idx" ON "ContactInquiryActivity"("inquiryId", "createdAt");

-- AddForeignKey
ALTER TABLE "ContactInquiryActivity" ADD CONSTRAINT "ContactInquiryActivity_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "ContactInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
