-- CreateTable "companies"
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_code_key" ON "companies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- AddForeignKey for financial_records
ALTER TABLE "financial_records" ADD COLUMN "companyId" INTEGER NOT NULL DEFAULT 1;

-- Add index on companyId
CREATE INDEX "financial_records_companyId_idx" ON "financial_records"("companyId");

-- AddForeignKey
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
