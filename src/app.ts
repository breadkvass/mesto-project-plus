import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import { NotFoundError } from './types/errors';
import errorHandler from './middleware/errors';
import { auth, requestLogger } from './middleware/auth';
import { createUser, login } from './controllers/user';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

async function start() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://127.0.0.1:27017', {
      dbName: 'mestodb',
      user: 'admin',
      pass: 'admin',
    });

    app.post('/signin', login);
    app.post('/signup', createUser);

    app.use('/users', auth, usersRouter);
    app.use('/me', auth, usersRouter);
    app.use('/me/avatar', auth, usersRouter);
    app.use('/cards', auth, cardsRouter);

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

