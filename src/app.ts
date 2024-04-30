import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';

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
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}
start();