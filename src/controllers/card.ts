import { Request, Response, NextFunction } from 'express';
import { Card } from '../models/card';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '../types/errors';
import HttpStatusCode from '../types/http-codes';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    next(new Error('Ошибка получения карточек'));
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const ownerId = req.user?._id;

  try {
    if (!ownerId) {
      throw new UnauthorizedError('Ошибка авторизации')
    }
    const newCard = await Card.create({ name, link, owner: ownerId });

    res.status(HttpStatusCode.OK).json(newCard);
  } catch (error) {
    next(error || new Error('Ошибка создания карточки'));
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new UnauthorizedError('Ошибка авторизации')
    }
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (card.owner?.toString() !== userId) {
      throw new ForbiddenError();
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    res.json({ message: 'Карточка успешно удалена', deletedCard });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { runValidators: true, new: true },
    );

    if (!likedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.json(likedCard);
  } catch (error) {
    next(error);
  }
};

export const unlikeCard = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const unlikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!unlikedCard) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.json(unlikedCard);
  } catch (error) {
    next(error);
  }
};