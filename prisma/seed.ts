import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MDB-backend database seed...');

  try {
    // ============================================
    // 1. Seed Companies
    // ============================================
    console.log('\n📋 Seeding Companies...');
    
    const batbCompany = await prisma.company.upsert({
      where: { code: 'COMP-003' },
      update: {},
      create: {
        code: 'COMP-003',
        name: 'BATB',
      },
    });
    console.log(`✅ Company created: ${batbCompany.name} (${batbCompany.code})`);

    const falconCompany = await prisma.company.upsert({
      where: { code: 'COMP-001' },
      update: {},
      create: {
        code: 'COMP-001',
        name: 'Falcon Security Limited',
      },
    });
    console.log(`✅ Company created: ${falconCompany.name} (${falconCompany.code})`);

    const robiCompany = await prisma.company.upsert({
      where: { code: 'COMP-002' },
      update: {},
      create: {
        code: 'COMP-002',
        name: 'Robi',
      },
    });
    console.log(`✅ Company created: ${robiCompany.name} (${robiCompany.code})`);

    // ============================================
    // 2. Seed Users
    // ============================================
    console.log('\n👤 Seeding Users...');
    
    await prisma.user.deleteMany({});

    const hashedPassword = await bcrypt.hash('FalconPassword123!', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@falconsecurity.com',
        name: 'Admin User',
        password: hashedPassword,
      },
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // ============================================
    // 3. Seed Financial Records for BATB
    // ============================================
    console.log('\n💰 Seeding Financial Records for BATB...');

    const august2026Record = await prisma.financialRecord.create({
      data: {
        userId: adminUser.id,
        companyId: batbCompany.id,
        month: '08',
        year: '2026',
        revenueBilledRecurringMonthly: 5500000,
        revenueBilledReceivedCash: 2200000,
        revenueBilledReceivedBank: 1650000,
        revenueBilledOutstandingCash: 825000,
        revenueBilledOutstandingBank: 412500,
        revenueTillEndReceivedCash: 3300000,
        revenueTillEndReceivedBank: 1980000,
        revenueTillEndOutstandingCash: 1210000,
        revenueTillEndOutstandingBank: 605000,
        expenditureBudgetedCash: 2750000,
        expenditureBudgetedBank: 550000,
        expenditureActualCash: 2420000,
        expenditureActualBank: 495000,
        vatAccruedCash: 412500,
        vatAccruedBank: 275000,
        vatPaidCash: 330000,
        vatPaidBank: 220000,
        tdsIncomeCash: 181500,
        tdsIncomeBank: 99000,
        tdsExpenditureCash: 121000,
        tdsExpenditureBank: 49500,
      },
    });
    console.log(`✅ August 2026 financial record created for BATB`);

    const june2026Record = await prisma.financialRecord.create({
      data: {
        userId: adminUser.id,
        companyId: batbCompany.id,
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
      },
    });
    console.log(`✅ June 2026 financial record created for BATB`);

    console.log('\n✨ Seed completed successfully!');
    console.log(`📊 Total companies seeded: 3`);
    console.log(`👤 Total users seeded: 1`);
    console.log(`💰 Total financial records created: 2`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
