const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash(process.env.SEED_PASSWORD || require('crypto').randomBytes(8).toString('hex'), 10);

  // 1. Create a CHPS Compound (Referring)
  const chps = await prisma.facility.create({
    data: {
      name: 'Osu Maternity Home',
      type: 'CHPS_COMPOUND',
      location: 'Osu, Accra',
    }
  });

  const referringWorker = await prisma.user.create({
    data: {
      name: 'Grace Osei',
      email: 'grace@refara.com',
      passwordHash: hash,
      role: 'REFERRING_WORKER',
      facilityId: chps.id
    }
  });

  // 2. Create a Teaching Hospital (Receiving)
  const hospital = await prisma.facility.create({
    data: {
      name: 'Korle Bu Teaching Hospital',
      type: 'TEACHING_HOSPITAL',
      location: 'Korle Bu, Accra',
    }
  });

  const receivingWorker = await prisma.user.create({
    data: {
      name: 'Dr. Kwame Mensah',
      email: 'kwame@refara.com',
      passwordHash: hash,
      role: 'RECEIVING_WORKER',
      facilityId: hospital.id
    }
  });

  console.log('Seeded Grace (grace@refara.com) as REFERRING_WORKER at Osu Maternity Home');
  console.log('Seeded Dr. Kwame (kwame@refara.com) as RECEIVING_WORKER at Korle Bu Teaching Hospital');
}

main().catch(console.error).finally(() => prisma.$disconnect());


