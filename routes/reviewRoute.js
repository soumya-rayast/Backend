import express from 'express';
import { createReview, getReviewsByItemId } from '../controllers/reviewController.js';
import  authUser from '../middleware/auth.js'; 
const router = express.Router();

router.post('/', authUser , createReview); 
router.get('/:itemId', getReviewsByItemId);

export default router;
