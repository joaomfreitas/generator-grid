import React, { useState, useEffect } from 'react';

const generateGrid = (): string[][] => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => getRandomChar())
    );
};

const getRandomChar = (): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    // retornar uma letra aleatória na posição random de array de 0 até alphabet.length
    return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const GridGenerator: React.FC = () => {
    const [grid, setGrid] = useState<string[][]>(generateGrid());
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null;

        if (isGenerating) {
            interval = setInterval(() => {
                setGrid(generateGrid());
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
    );
};

export default GridGenerator;