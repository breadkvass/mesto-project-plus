import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import { NotFoundError } from './types/errors';
import { errorHandler } from './middleware/errors';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function start() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017', {
      dbName: 'mestodb',
      user: 'admin',
      pass: 'admin',
    });
    app.use('/users', usersRouter);
    app.use('/cards', cardsRouter);

    app.use((req: Request, res: Response, next: NextFunction) => {
      req.user = {
        _id: '6630ef28bcdc68e00ab0f609',
      };
      next();
    });

    app.use((_req, _res, next) => {
      next(new NotFoundError('Запрашиваемый ресурс не найден'));
    });
    app.use(errorHandler);
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();