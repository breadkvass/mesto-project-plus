import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserProfile,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getUserProfile);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);

export default router;