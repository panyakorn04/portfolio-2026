-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "deliveryMode" TEXT NOT NULL DEFAULT 'database',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactInquiry_email_createdAt_idx" ON "ContactInquiry"("email", "createdAt");

-- CreateIndex
CREATE INDEX "ContactInquiry_locale_createdAt_idx" ON "ContactInquiry"("locale", "createdAt");

