import 'dotenv/config';

import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const psychologist = await prisma.user.upsert({
    where: {
      email: 'psychologist@example.com',
    },
    update: {},
    create: {
      email: 'psychologist@example.com',
      passwordHash: 'temporary_hash',
      role: UserRole.PSYCHOLOGIST,
      profile: {
        create: {
          firstName: 'Анна',
          lastName: 'Психолог',
          timezone: 'Europe/Moscow',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const client = await prisma.user.upsert({
    where: {
      email: 'client@example.com',
    },
    update: {},
    create: {
      email: 'client@example.com',
      passwordHash: 'temporary_hash',
      role: UserRole.CLIENT,
      profile: {
        create: {
          firstName: 'Иван',
          lastName: 'Клиент',
          timezone: 'Europe/Moscow',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log('Seed completed');
  console.log({
    psychologist,
    client,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed');
    console.error(error);

    await prisma.$disconnect();
    process.exit(1);
  });
