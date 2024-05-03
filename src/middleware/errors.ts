import { NextFunction, Request, Response } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors';

type ErrorHandler = {
  error: Error | CelebrateError;
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
  } else if (isCelebrateError(error)) {
    status = 400;
  }
  res.status(status).json({
    message: error.message,
  });

  next();
};

export default errorHandler;