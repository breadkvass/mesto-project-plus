export class NotFoundError extends Error {
  status: number;

  constructor(message = 'Не найдено') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export class UnauthorizedError extends Error {
  status: number;

  constructor(message = 'Отстутвует авторизация') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

export class BadRequestError extends Error {
  status: number;

  constructor(message = 'Некорректнный запрос') {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

export class ForbiddenError extends Error {
  status: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.name = 'ForbiddenError';
    this.status = 403;
  }
}