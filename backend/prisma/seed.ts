import { PrismaClient, FacilityType, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.referralStatusHistory.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.user.deleteMany();
  await prisma.facility.deleteMany();

  const chps = await prisma.facility.create({
    data: { name: 'Amasaman CHPS Compound', facilityType: FacilityType.CHPS, location: 'Ga West, Greater Accra' },
  });

  const hospital = await prisma.facility.create({
    data: { name: 'Korle Bu Teaching Hospital', facilityType: FacilityType.TEACHING_HOSPITAL, location: 'Accra' },
  });

  const hashedAdminPassword = await bcrypt.hash('AdminPass@2026', 12);
  const hashedWorkerPassword = await bcrypt.hash('WorkerPass@2026', 12);

  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@health.gov.gh',
      passwordHash: hashedAdminPassword,
      role: Role.ADMIN,
      facilityId: hospital.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Nurse Ama',
      email: 'ama@amasaman-chps.gh',
      passwordHash: hashedWorkerPassword,
      role: Role.REFERRING_WORKER,
      facilityId: chps.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Dr. Mensah',
      email: 'mensah@korlebu.gh',
      passwordHash: hashedWorkerPassword,
      role: Role.RECEIVING_WORKER,
      facilityId: hospital.id,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });