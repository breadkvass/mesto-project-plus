import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/user';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/userd', createUser);

export default router;