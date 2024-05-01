import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const getUserById = (req: Request, res: Response) => {
  return User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};