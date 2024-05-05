import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../types/errors';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Токен не обнаружен'));
  }

  try {
    const payload = jwt.verify(token, 'secret-key') as { _id: string };

    req.user = payload;

    next();
  } catch (error) {
    next(new UnauthorizedError('Невалидный токен'));
  }
};