import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthService } from '../services/authService';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.registerUser(req.body);
  return res.status(201).json({
    message: 'User registered successfully',
    user,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const authResult = await AuthService.loginUser(req.body);
  return res.status(200).json(authResult);
});