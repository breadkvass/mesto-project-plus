import { NextFunction, Request, Response } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors';


const errorHandler = (
  error: Error | CelebrateError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode || 500;
  console.log(error);

  if (
    error instanceof NotFoundError
    || error instanceof UnauthorizedError
    || error instanceof BadRequestError
    || error instanceof ForbiddenError
  ) {
    status = error.status;
  } else if (isCelebrateError(error)) {
    status = 400;
  }
  res.status(status).json({
    message: error.message,
  });

  next();
};

export default errorHandler;