import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
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
    isPending: !u.lastLoginAt,
  }));

  res.status(200).json({ data });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, facilityId, password } = req.body;

  // Use a default password if not provided (for invite logic)
  const tempPassword = password || process.env.DEFAULT_INVITE_PASSWORD || crypto.randomBytes(6).toString('hex');
  const passwordHash = await bcrypt.hash(tempPassword, 10);

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
  res.status(201).json({ data: { ...safeUser, tempPassword: password ? undefined : tempPassword } });
});



export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { facility: true }
  });
  if (!user) throw new NotFoundError('User not found');
  const { passwordHash: _, ...safeUser } = user;
  res.status(200).json({ data: safeUser });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, email, role, facilityId } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { name, email, role, facilityId },
    include: { facility: true }
  });
  const { passwordHash: _, ...safeUser } = user;
  res.status(200).json({ data: safeUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await prisma.user.delete({ where: { id } });
  res.status(200).json({ data: { success: true } });
});
