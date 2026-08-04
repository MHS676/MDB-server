-- CreateTable
CREATE TABLE "Expenditure" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalEscort" INTEGER NOT NULL DEFAULT 0,
    "coverVan" INTEGER NOT NULL DEFAULT 0,
    "receivedAmount" INTEGER NOT NULL DEFAULT 0,
    "expenditure" INTEGER NOT NULL DEFAULT 0,
    "surplusDue" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "sourceFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expenditure_pkey" PRIMARY KEY ("id")
);
