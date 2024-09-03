import React, { useState, useEffect } from 'react';
import CodeDisplay from '../components/CodeDisplay';
import { useGridContext } from '../contexts/GridContext';

interface Payment {
    id: string;
    name: string;
    amount: number;
    grid: string[][];
    code: string;
}

const PaymentsPage: React.FC = () => {

    const { grid, code } = useGridContext();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentNAme, setPaymentName] = useState<string>('');
    const [paymentAmount, setPaymentAmount] = useState<number>(0);

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/payments');
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.log('Failed getting payments -> ', error);
        }
    }

    const handleAddPayment = async () => {
        const newPayment = {
            name: paymentNAme,
            amount: paymentAmount,
            grid,
            code
        }
        try {
            const response = await fetch('http://localhost:3000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPayment),
            });

            if (response.ok) {
                const updatedPayments = await response.json();
                setPayments(updatedPayments);
                setPaymentName('');
                setPaymentAmount(0);
            }
        } catch (error) {
            console.error('Failed adding payment -> ', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <CodeDisplay code={''} />
            <div className='w-full flex flex-row items-end gap-4'>
                <div>
                    <p className="text-gray-500">Payment</p>
                    <input
                        type="text"
                        className="border border-gray-300 p-2 bg-white w-44"
                        placeholder="Payment"
                        value={paymentNAme}
                        onChange={(e) => setPaymentName(e.target.value)}
                    />
                </div>
                <div>
                    <p className="text-gray-500">Amount</p>
                    <input
                        type="number"
                        className="border border-gray-300 p-2 bg-white w-44"
                        placeholder="Amount"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                </div>
                <button
                    onClick={handleAddPayment}
                    className="px-4 h-12 bg-gray-500 text-white font-bold rounded hover:bg-gray-700 transition"
                >
                    + ADD
                </button>
            </div>
            <div className="container mx-auto mt-4">
                Payments List
                <div className="w-full mb-8 mt-2 overflow-hidden rounded-lg shadow-lg">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                <tr className="text-md text-left">
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Grid</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {payments.map(payment => (
                                    <tr key={payment.id} className="text-gray-700">
                                        <td className="px-4 py-3 border">{payment.name}</td>
                                        <td className="px-4 py-3 text-ms font-semibold border">{payment.amount}</td>
                                        <td className="px-4 py-3 text-ms font-semibold border">{payment.code}</td>
                                        <td className="px-4 py-3 text-ms font-semibold border">
                                            100
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PaymentsPage;
