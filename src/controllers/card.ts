import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  console.log(req.user?._id);

  return Card.create({ name, link })
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  return Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

export const likeCard = (req: Request) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
);

export const dislikeCard = (req: Request) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
);