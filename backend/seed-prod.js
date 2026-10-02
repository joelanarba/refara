const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const facility = await prisma.facility.create({
    data: {
      name: 'Adabraka Community Clinic',
      type: 'HEALTH_CENTER',
      location: 'Adabraka, Accra',
    }
  });

  const hash = await bcrypt.hash(process.env.SEED_PASSWORD || require('crypto').randomBytes(8).toString('hex'), 10);
  
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@refara.com',
      passwordHash: hash,
      role: 'ADMIN',
      facilityId: facility.id
    }
  });

  console.log('Seeded admin@refara.com / [SECURE_PASSWORD_PROVIDED_BY_ENV]');
}

main().catch(console.error).finally(() => prisma.$disconnect());


