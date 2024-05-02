import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors';

type ErrorHandler = {
  error: Error
  _req: Request,
  res: Response,
  next: NextFunction,
}

const errorHandler = ({
  error,
  res,
  next,
} : ErrorHandler) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode || 500;
  console.log(error);

  if (
    error instanceof NotFoundError
    || error instanceof UnauthorizedError
    || error instanceof BadRequestError
    || error instanceof ForbiddenError
  ) {
    status = error.status;
  } else {
    status = 400;
  }
  res.status(status).json({
    message: error.message,
  });

  next();
};

export default errorHandler;