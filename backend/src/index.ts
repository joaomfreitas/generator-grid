import express, { Request, Response } from 'express';
import cors from 'cors';
import paymentRoutes from '../routes/paymentRoutes';
import http from 'http';
import { Server } from 'socket.io';
import { Payment } from '../models/payment';
import { getPayments } from '../services/paymentService';

const app = express();
const port = 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', paymentRoutes);

const generateGrid = (biasChar?: string, isEmpty = false): string[][] => {
    const grid = Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => isEmpty ? '' : getRandomChar())
    );

    if (biasChar && biasChar !== '') {
        const biasCount = 20; //número de vezes em que a letra pode ser colocada sendo que 100x0.2 = 20
        let placedBias = grid.map(row => row.filter(char => char === biasChar)).flat().length;

        while (placedBias < biasCount) {
            const randomRow = Math.floor(Math.random() * 10);
            const randomCol = Math.floor(Math.random() * 10);

            if (grid[randomRow][randomCol] !== biasChar) {
                grid[randomRow][randomCol] = biasChar;
                placedBias++;
            }
        }
    }

    return grid;
};


const getRandomChar = (): string => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    // retornar uma letra aleatória na posição random de array de 0 até alphabet.length
    return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const divideByInteger = (num: number): number => {
    let numberValidated = num;
    for (let i = 2; i <= num; i++) {
        let result = num / i;
        if (result <= 9) {
            numberValidated = result;
        }
    }
    return numberValidated;
}


const calculateCode = (grid: string[][]): string => {
    const now = new Date();
    const seconds = now.getSeconds();
    const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

    const char1 = grid[3][6];
    const char2 = grid[6][3];

    const countChar1 = grid.flat().filter(char => char === char1).length;
    const countChar2 = grid.flat().filter(char => char === char2).length;

    const validatedCount1 = countChar1 > 9 ? divideByInteger(countChar1) : countChar1;
    const validatedCount2 = countChar2 > 9 ? divideByInteger(countChar2) : countChar2;

    return `${validatedCount1}${validatedCount2}`;
};

let grid: string[][] = generateGrid('', true);
let code: string = '';
let biasChar: string = '';
let timeout: ReturnType<typeof setTimeout> | null = null;

app.get('/grid', (req, res) => {
    //testing biasChar
    const biasChar = 'y';

    const grid = generateGrid(biasChar);
    res.json({ grid });
});

app.post('/grid-code', (req: Request, res: Response) => {
    io.emit('gridOccupied', true);
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        io.emit('gridOccupied', false);
    }, 3000)

    if (req.body.biasChar && biasChar !== req.body.biasChar && req.body.biasChar !== '') {
        io.emit('waitingCharacter', biasChar);
        biasChar = req.body.biasChar !== biasChar ? req.body.biasChar : biasChar || '';
    }

    grid = generateGrid(biasChar);
    code = calculateCode(grid);

    io.emit('gridUpdate', { grid, code, biasChar });

    res.json({ grid, code, biasChar });
});

app.post('/bias-char', (req: Request, res: Response) => {
    biasChar = req.body.biasChar;
    io.emit('waitingCharacter', biasChar);
    res.json({ biasChar });
})

app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});


app.get('/warmup', (req, res) => {
    res.json({ grid, code });
})

io.on('connection', (socket) => {
    console.log('connected ->', socket.id);

    socket.on('newPayment', (updatedPayments: Payment[]) => {
        io.emit('paymentUpdate', getPayments());
    });

    socket.on('disconnect', () => {
        console.log('disconnected ->', socket.id);
    })
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});