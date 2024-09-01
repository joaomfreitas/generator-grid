import React, { useState, useEffect } from 'react';
import CodeDisplay from './CodeDisplay';

interface GridResponse {
    grid: string[][];
    code: string;
}

const GridGenerator: React.FC = () => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [code, setCode] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null;

        if (isGenerating) {
            if (grid.length === 0) {
                setGrid([]);
            }
            interval = setInterval(() => {
                fetch('http://localhost:3000/grid-code')
                    .then(response => response.json())
                    .then((data: GridResponse) => {
                        setGrid(data.grid);
                        setCode(data.code);
                    });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isGenerating]);


    const startGenerator = () => {
        setIsGenerating(true);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <button
                    onClick={startGenerator}
                    className="mb-6 px-4 py-2 bg-gray-500 text-white font-bold rounded hover:bg-gray-700 transition"
                >
                    GENERATE 2D GRID
                </button>
                <div className="grid grid-cols-10 gap-1">
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