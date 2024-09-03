import express from 'express';
import {
    createPaymentHandler,
    getPaymentsHandler,
} from '../controllers/paymentController';

const router = express.Router();

router.post('/payments', createPaymentHandler);
router.get('/payments', getPaymentsHandler);

export default router;