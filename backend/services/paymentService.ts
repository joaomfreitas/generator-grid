import { Payment } from '../models/payment';
import { v4 as uuidv4 } from 'uuid';

const payments: Payment[] = [];

export const createPayment = (name: string, amount: number, grid: string[][], code: string): Payment => {
    const newPayment: Payment = {
        id: uuidv4(),
        name,
        amount,
        grid,
        code,
    };

    payments.push(newPayment);
    return newPayment;
};

export const getPayments = (): Payment[] => payments;