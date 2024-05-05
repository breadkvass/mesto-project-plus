import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import { NotFoundError } from './types/errors';
import errorHandler from './middleware/errors';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function start() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
      dbName: 'mestodb',
    });
    app.use('/users', usersRouter);
    app.use('/cards', cardsRouter);
    app.use('/signin', usersRouter);
    app.use('/signup', usersRouter);
    app.use('/me', usersRouter);
    app.use('/me/avatar', usersRouter);

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