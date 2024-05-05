import { NextFunction, Request, Response } from 'express';
import { CelebrateError, isCelebrateError } from 'celebrate';

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../types/errors';
import HttpStatusCode from '../types/http-codes';


const errorHandler = (
  error: Error | CelebrateError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let status = res.statusCode === HttpStatusCode.OK
  ? HttpStatusCode.INTERNAL_SERVER_ERROR
  : res.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  console.log(error);

  if (
    error instanceof NotFoundError
    || error instanceof UnauthorizedError
    || error instanceof BadRequestError
    || error instanceof ForbiddenError
  ) {
    status = error.status;
  } else if (isCelebrateError(error)) {
    status = HttpStatusCode.BAD_REQUEST;
  }
  res.status(status).json({
    message: 'На сервере произошла ошибка',
  });

  next();
};

export default errorHandler;