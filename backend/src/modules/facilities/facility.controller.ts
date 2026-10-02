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

export const getFacilityById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const facility = await prisma.facility.findUnique({
    where: { id },
  });
  if (!facility) throw new Error('Facility not found');
  res.status(200).json({ data: facility });
});

export const updateFacility = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, type, location } = req.body;
  const facility = await prisma.facility.update({
    where: { id },
    data: { name, type, location },
  });
  res.status(200).json({ data: facility });
});

export const deleteFacility = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.facility.delete({ where: { id } });
  res.status(200).json({ data: { success: true } });
});
