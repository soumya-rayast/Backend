import express from 'express';
import { getSalesStats } from '../controllers/salesController.js';
import authUser from '../middleware/auth.js';

const salesRouter = express.Router();

salesRouter.get('/sales-stats', authUser, getSalesStats);

export default salesRouter;
