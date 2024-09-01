import { Request, Response } from 'express';
import {
    createPayment,
    getPayments,
} from '../services/paymentService';

export const createPaymentHandler = (req: Request, res: Response) => {
    const { name, amount, grid, code } = req.body;

    if (!name || !amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid payment data' });
    }

    const payment = createPayment(name, amount, grid, code);
    res.status(201).json(payment);
};

export const getPaymentsHandler = (req: Request, res: Response) => {
    res.json(getPayments());
};