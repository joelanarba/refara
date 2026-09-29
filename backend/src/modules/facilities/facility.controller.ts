import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { asyncHandler } from '../../middleware/errorHandler';

export const getFacilities = asyncHandler(async (_req: Request, res: Response) => {
  const facilities = await prisma.facility.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          incomingReferrals: {
            where: { status: { notIn: ['COMPLETED', 'REJECTED', 'CANCELLED'] } },
          },
        },
      },
    },
  });

  const data = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    type: f.type,
    location: f.location,
    isOnline: true, // Always online for MVP
    activeReferrals: f._count.incomingReferrals,
  }));

  res.status(200).json({ data }); // frontend apiService automatically checks for `data` or returns raw json
});

export const createFacility = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, location } = req.body;
  const facility = await prisma.facility.create({
    data: { name, type, location },
  });
  res.status(201).json({ data: facility });
});
