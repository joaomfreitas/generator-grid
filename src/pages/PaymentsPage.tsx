import React, { useState, useEffect } from 'react';
import CodeDisplay from '../components/CodeDisplay';

interface Payment {
    id: string;
    name: string;
    amount: number;
    grid: string[][];
    code: string;
}

const PaymentsPage: React.FC = () => {
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
                    />
                </div>
                <div>
                    <p className="text-gray-500">Amount</p>
                    <input
                        type="number"
                        className="border border-gray-300 p-2 bg-white w-44"
                        placeholder="Amount"
                    />
                </div>
                <button
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
                                <tr className="text-gray-700">
                                    <td className="px-4 py-3 border">
                                        <div className="flex items-center text-sm">
                                            <p>Payment 1</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-ms font-semibold border">100</td>
                                    <td className="px-4 py-3 text-ms font-semibold border">34</td>

                                    <td className="px-4 py-3 text-ms font-semibold border">100</td>
                                </tr>
                                <tr className="text-gray-700">
                                    <td className="px-4 py-3 border">
                                        <div className="flex items-center text-sm">

                                            <p>Payment 1</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-ms font-semibold border">100</td>
                                    <td className="px-4 py-3 text-ms font-semibold border">34</td>

                                    <td className="px-4 py-3 text-ms font-semibold border">100</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PaymentsPage;
