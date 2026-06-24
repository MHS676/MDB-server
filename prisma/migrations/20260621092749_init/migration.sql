-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "revenueBilledRecurringMonthly" DOUBLE PRECISION,
    "revenueBilledReceivedCash" DOUBLE PRECISION,
    "revenueBilledReceivedBank" DOUBLE PRECISION,
    "revenueBilledOutstandingCash" DOUBLE PRECISION,
    "revenueBilledOutstandingBank" DOUBLE PRECISION,
    "revenueTillEndReceivedCash" DOUBLE PRECISION,
    "revenueTillEndReceivedBank" DOUBLE PRECISION,
    "revenueTillEndOutstandingCash" DOUBLE PRECISION,
    "revenueTillEndOutstandingBank" DOUBLE PRECISION,
    "expenditureBudgetedCash" DOUBLE PRECISION,
    "expenditureBudgetedBank" DOUBLE PRECISION,
    "expenditureActualCash" DOUBLE PRECISION,
    "expenditureActualBank" DOUBLE PRECISION,
    "vatAccruedCash" DOUBLE PRECISION,
    "vatAccruedBank" DOUBLE PRECISION,
    "vatPaidCash" DOUBLE PRECISION,
    "vatPaidBank" DOUBLE PRECISION,
    "tdsIncomeCash" DOUBLE PRECISION,
    "tdsIncomeBank" DOUBLE PRECISION,
    "tdsExpenditureCash" DOUBLE PRECISION,
    "tdsExpenditureBank" DOUBLE PRECISION,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
