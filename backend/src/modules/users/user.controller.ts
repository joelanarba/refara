import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../config/db';
import { asyncHandler, NotFoundError } from '../../middleware/errorHandler';
import { UserRole } from '@prisma/client';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { facility: true },
  });

  const data = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    facilityName: u.facility?.name || 'System Admin',
    isActive: true, // Always active for MVP
  }));

  res.status(200).json({ data });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, facilityId, password } = req.body;

  // Use a default password if not provided (for invite logic)
  const plainPassword = password || 'Refara2026!';
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as UserRole,
      facilityId: facilityId || null,
    },
    include: { facility: true },
  });

  // Remove passwordHash from response
  const { passwordHash: _, ...safeUser } = user;
  res.status(201).json({ data: safeUser });
});
