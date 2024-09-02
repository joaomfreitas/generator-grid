import React, { createContext, useState, useContext, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface GridContextProps {
    grid: string[][];
    gridOccupied: boolean;
    code: string;
    codeWaiting: boolean;
    biasChar: string;
    isGenerating: boolean;
    isWaiting: boolean;
    socket: Socket | null;
    setGrid: React.Dispatch<React.SetStateAction<string[][]>>;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    setBiasChar: React.Dispatch<React.SetStateAction<string>>;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
    setIsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
    updateBiasChar: (biasChar: string) => void;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

const generateEmptyGrid = (): string[][] => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => '')
    );
};

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [grid, setGrid] = useState<string[][]>(generateEmptyGrid());
    const [gridOccupied, setGridOccupied] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [codeWaiting, setCodeWaiting] = useState<boolean>(false);
    const [biasChar, setBiasChar] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    const [initialGrid, setInitialGrid] = useState<boolean>(false);
    const [socket] = useState<Socket>(() => io('http://localhost:3000'));

    useEffect(() => {
        socket.on('gridUpdate', (data) => {
            setGrid(data.grid);
            setCode(data.code);
            console.log('data here ' + data.biasChar + ' ' + biasChar);
            if (data.biasChar !== biasChar)
                setBiasChar(data.biasChar);
        });

        socket.on('gridOccupied', (data) => {
            setGridOccupied(data);
        })

        socket.on('waitingCharacter', (biasChar) => {
            setCodeWaiting(true);
            setBiasChar(biasChar);
            setTimeout(() => {
                setCodeWaiting(false);
            }, 4000);
        })

        gridWarmup();

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

    useEffect(() => {
        if (biasChar !== '')
            updateBiasChar();
    }, [biasChar]);

    const gridWarmup = () => {
        fetch('http://localhost:3000/warmup', {
            method: 'GET',
        })
            .then(response => response.json())
            .then((data) => {
                setGrid(data.grid);
                setCode(data.code);
            })
            .catch((err) => console.error(err));
    }
    const gridFetching = () => {
        fetch('http://localhost:3000/grid-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then((data) => {
                setGrid(data.grid);
                setCode(data.code);
            })
            .catch((err) => console.error(err));
    };

    const updateBiasChar = () => {
        fetch('http://localhost:3000/bias-char', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ biasChar }),
        })
            .then(response => response.json())
            .catch((err) => console.error(err));
    }

    return (
        <GridContext.Provider value={{
            grid,
            gridOccupied,
            code,
            codeWaiting,
            biasChar,
            isGenerating,
            isWaiting,
            socket,
            setGrid,
            setCode,
            setBiasChar,
            setIsGenerating,
            setIsWaiting,
            updateBiasChar
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
