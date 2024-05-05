import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getUserProfile,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.get('/:userId', getUserById);

export default router;