import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);

export default router;