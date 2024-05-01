import { Router } from 'express';
import { getCards, createCard, deleteCard } from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);

export default router;