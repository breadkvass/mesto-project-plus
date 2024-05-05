import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../types/errors';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new BadRequestError('Не задан идентификатор пользователя')
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new UnauthorizedError('Ошибка авторизации')
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const { password: hashedPwd, ...userWithoutPwd } = newUser.toObject();

    res.status(201).json(userWithoutPwd);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new UnauthorizedError('Ошибка авторизации')
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { name, about }, {
      runValidators: true, new: true,
    });

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const userId = req.user?._id;

  console.log(`Обновление аватара для ${userId} на ${avatar}`);
  try {
    if (!userId) {
      throw new UnauthorizedError('Ошибка авторизации')
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, {
      runValidators: true, new: true,
    });

    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new BadRequestError('Не передан email пользователя');
    }

    if (!password) {
      throw new BadRequestError('Не передан пароль пользователя');
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedError('Неправильный email или пароль');
    }

    const token = jwt.sign({ _id: user._id }, 'secret-key', {
      expiresIn: '1w',
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Успешный вход' });
  } catch(error) {
    next(error);
  }
};