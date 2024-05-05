import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../types/errors';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.token || req.headers.authorization?.split(' ')[1];

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

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let log = `[${formatted_date}] ${method}:${url} ${status}`;
  console.log(log);
  next();
};