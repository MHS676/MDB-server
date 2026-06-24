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
