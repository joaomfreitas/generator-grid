import express from 'express';

import cors from 'cors';

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const generateGrid = (empty = false): string[][] => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => empty ? '' : getRandomChar())
    );
};

const getRandomChar = (): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    // retornar uma letra aleatória na posição random de array de 0 até alphabet.length
    return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const calculateCode = (grid: string[][]): string => {
    const now = new Date();
    const seconds = now.getSeconds();
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    const char1 = grid[3][6];
    const char2 = grid[6][3];

    const countChar1 = grid.flat().filter(char => char === char1).length;
    const countChar2 = grid.flat().filter(char => char === char2).length;

    const validatedCount1 = countChar1 > 9 ? Math.floor(countChar1 / 2) : countChar1;
    const validatedCount2 = countChar2 > 9 ? Math.floor(countChar2 / 2) : countChar2;

    return `${validatedCount1}${validatedCount2}`;
};

app.get('/grid', (req, res) => {
    const grid = generateGrid();
    res.json({ grid });
});

app.get('/grid-code', (req, res) => {
    const grid = generateGrid();
    const code = calculateCode(grid);
    res.json({ grid, code });
});

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});