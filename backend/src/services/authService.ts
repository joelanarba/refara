import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../config/db';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-prod';
const SALT_ROUNDS = 12;

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
  facilityId: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export class AuthService {
  static async registerUser(dto: RegisterUserDTO) {
    const existingUser = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new ConflictError('Email already registered');

    // Verify facility existence if a facilityId is provided
    if (dto.facilityId) {
      const facility = await prisma.facility.findUnique({ where: { id: dto.facilityId } });
      if (!facility) throw new NotFoundError('Assigned facility does not exist');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: dto.role,
        facilityId: dto.role === Role.ADMIN ? null : dto.facilityId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        facilityId: true,
        createdAt: true,
      },
    });
  }

  static async loginUser(dto: LoginUserDTO) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
      include: { facility: true },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      role: user.role,
      facilityId: user.facilityId, // Null for ADMIN
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super-secret-key-change-in-prod', {
      expiresIn: '8h',
    });

    return {
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
              type: user.facility.facilityType,
            }
          : null, // Null for global ADMIN
      },
    };
  }
}