import React, { createContext, useState, useContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface GridContextProps {
    grid: string[][];
    code: string;
    biasChar: string;
    isGenerating: boolean;
    isWaiting: boolean;
    socket: Socket | null;
    setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    setBiasChar: React.Dispatch<React.SetStateAction<string>>;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

const generateEmptyGrid = (): string[][] => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => '')
    );
};

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [grid, setGrid] = useState<string[][]>(generateEmptyGrid());
    const [code, setCode] = useState<string>('');
    const [biasChar, setBiasChar] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [initialGrid, setInitialGrid] = useState<boolean>(false);
    const [socket] = useState<Socket>(() => io('http://localhost:3000'));

    useEffect(() => {
        socket.on('gridUpdate', (data) => {
            setGrid(data.grid);
            setCode(data.code);
        });

        return () => {
            socket.off('gridUpdate');
        }
    }, []);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null;

        if (isGenerating) {
            if (initialGrid === false) {
                setInitialGrid(true);
                gridFetching();
            }
            interval = setInterval(() => {
                gridFetching();
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isGenerating, biasChar]);

    const gridFetching = () => {
        fetch('http://localhost:3000/grid-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ biasChar }),
        })
            .then(response => response.json())
            .then((data) => {
                setGrid(data.grid);
                setCode(data.code);
            })
            .catch((err) => console.error(err));
    };

    return (
        <GridContext.Provider value={{
            grid,
            code,
            biasChar,
            isGenerating,
            isWaiting,
            socket,
            setGrid,
            setCode,
            setBiasChar,
            setIsGenerating,
            setIsWaiting
        }}>
            {children}
        </GridContext.Provider>
    );
};

export const useGridContext = (): GridContextProps => {
    const context = useContext(GridContext);
    if (!context) {
        throw new Error('useGridContext must be used within a GridProvider');
    }
    return context;
};
