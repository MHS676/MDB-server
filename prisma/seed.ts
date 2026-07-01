import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default user if doesn't exist
  const user = await prisma.user.upsert({
    where: { email: 'admin@falcon.com' },
    update: {},
    create: {
      id: 1,
      email: 'admin@falcon.com',
      name: 'Admin User',
      password: 'hashed_password_here',
    },
  });

  console.log('✓ User created/updated:', user);

  const june2026 = await prisma.financialRecord.findFirst({
    where: {
      userId: user.id,
      month: '06',
      year: '2026',
    },
  });

  const juneRecordData = {
    userId: user.id,
    month: '06',
    year: '2026',
    revenueBilledRecurringMonthly: 4520000,
    revenueBilledReceivedCash: 1820000,
    revenueBilledReceivedBank: 1300000,
    revenueBilledOutstandingCash: 185000,
    revenueBilledOutstandingBank: 95000,
    revenueTillEndReceivedCash: 2100000,
    revenueTillEndReceivedBank: 1020000,
    revenueTillEndOutstandingCash: 1585000,
    revenueTillEndOutstandingBank: 125000,
    expenditureBudgetedCash: 2100000,
    expenditureBudgetedBank: 300000,
    expenditureActualCash: 1890000,
    expenditureActualBank: 250000,
    vatAccruedCash: 315000,
    vatAccruedBank: 210000,
    vatPaidCash: 195000,
    vatPaidBank: 80000,
    tdsIncomeCash: 145000,
    tdsIncomeBank: 60000,
    tdsExpenditureCash: 88000,
    tdsExpenditureBank: 40000,
  };

  const juneFinancialRecord = june2026
    ? await prisma.financialRecord.update({
        where: { id: june2026.id },
        data: juneRecordData,
      })
    : await prisma.financialRecord.create({
        data: juneRecordData,
      });

  console.log('✓ June 2026 financial record created/updated:', juneFinancialRecord);

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
