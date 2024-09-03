import React, { useState, useEffect } from 'react';
import CodeDisplay from './CodeDisplay';

interface GridResponse {
    grid: string[][];
    code: string;
}

const generateEmptyGrid = (): string[][] => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => '')
    );
};


const GridGenerator: React.FC = () => {
    const [grid, setGrid] = useState<string[][]>(generateEmptyGrid());
    const [code, setCode] = useState<string>('');
    const [biasChar, setBiasChar] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null;

        if (isGenerating) {
            if (grid.length === 0) {
                setGrid([]);
            }
            interval = setInterval(() => {
                console.log('biasChar -> ', biasChar);
                fetch('http://localhost:3000/grid-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ biasChar }),
                })
                    .then(response => response.json())
                    .then((data: GridResponse) => {
                        setGrid(data.grid);
                        setCode(data.code);
                    })
                    .catch((err) => console.error(err));

            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isGenerating, biasChar]);


    const handleBiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();

        if (value === '') {
            setBiasChar(value);
        } else if (value.match(/^[a-z]$/)) {
            setIsWaiting(true);
            setBiasChar(value);
            setTimeout(() => {
                setIsWaiting(false);
            }, 4000);
        }
    };
    const startGenerator = () => {
        setIsGenerating(true);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="w-full flex justify-between items-center mb-4">
                    <div>
                        <p className="text-gray-500">Character</p>
                        <input
                            type="text"
                            maxLength={1}
                            value={biasChar}
                            onChange={handleBiasChange}
                            disabled={isWaiting}
                            className="border border-gray-300 p-2 bg-white w-44"
                            placeholder="Enter a character (a-z)"
                        />
                        {isWaiting && (
                            <div className="text-red-500 ">Wait 4 seconds before changing the character</div>
                        )}
                    </div>
                    <button
                        onClick={startGenerator}
                        className="px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-700 transition"
                    >
                        GENERATE 2D GRID
                    </button>

                </div>
                <div className="grid grid-cols-10 gap-1 mb-8">
                    {grid.map((row, rowIndex) =>
                        row.map((char, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className="w-14 h-14 flex items-center justify-center bg-white border text-black border-gray-300 text-xl font-mono"
                            >
                                {char}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <CodeDisplay code={code} />
        </>
    );
};

export default GridGenerator;