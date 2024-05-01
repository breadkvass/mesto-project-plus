import { CelebrateError, isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';
import {
  BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError,
} from '../types/errors';

type ErrorHandler = {
  error: Error | CelebrateError | MongoError,
  _req: Request,
  res: Response,
  next: NextFunction,
}

export const errorHandler = ({ error, _req, res, next } : ErrorHandler)  => {
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
  } else if ((error as MongoError).code === 11000) {
    status = 409;
  }

  res.status(status).json({
    message: error.message,
  });

  next();
};