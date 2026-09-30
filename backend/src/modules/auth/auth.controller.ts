import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';
const SALT_ROUNDS = 12;

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, facilityId } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: { message: 'Email already registered', status: 409 } });
    }

    if (role === UserRole.ADMIN) {
      // Admins can be without a facility
    } else {
      if (!facilityId) {
        return res
          .status(400)
          .json({ error: { message: 'Facility is required for non-admin users', status: 400 } });
      }
      const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
      if (!facility) {
        return res
          .status(404)
          .json({ error: { message: 'Assigned facility does not exist', status: 404 } });
      }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, facilityId },
      select: { id: true, name: true, email: true, role: true, facilityId: true, createdAt: true },
    });

    return res.status(201).json({ data: { message: 'User registered successfully', user } });
  } catch (_error) {
    return res
      .status(500)
      .json({ error: { message: 'Internal server error during registration', status: 500 } });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { facility: true },
    });

    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid email or password', status: 401 } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: { message: 'Invalid email or password', status: 401 } });
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const payload = {
      userId: user.id,
      role: user.role,
      facilityId: user.facilityId,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    return res.status(200).json({
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          facility: user.facility
            ? {
                id: user.facility.id,
                name: user.facility.name,
                type: user.facility.type,
              }
            : null,
        },
      },
    });
  } catch (_error) {
    return res
      .status(500)
      .json({ error: { message: 'Internal server error during login', status: 500 } });
  }
};
