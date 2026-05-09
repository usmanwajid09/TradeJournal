import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import connectDB from './config/db.js';

// Domain Repositories (Ports)
import MongoUserRepository from './adapters/secondary/db/MongoUserRepository.js';
import MongoTradeRepository from './adapters/secondary/db/MongoTradeRepository.js';

// Application Use Cases
import RegisterUser from './core/application/use-cases/RegisterUser.js';
import LoginUser from './core/application/use-cases/LoginUser.js';
import { LogTrade, GetTrades, DeleteTrade, UpdateTrade, GetTrade } from './core/application/use-cases/TradeUseCases.js';

// Primary Adapters (Web)
import AuthController from './adapters/primary/http/controllers/AuthController.js';
import createAuthRoutes from './adapters/primary/http/routes/AuthRoutes.js';
import TradeController from './adapters/primary/http/controllers/TradeController.js';
import createTradeRoutes from './adapters/primary/http/routes/TradeRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();

// 1. Connect to Database
connectDB();

const app = express();

// Trust proxy is required when hosted on Railway/Vercel/Heroku
// so rate limiters use the real client IP instead of the proxy IP.
app.set('trust proxy', 1);

// 2. CORS — must be FIRST before body parsers so preflight OPTIONS works
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    // Vercel preview & production URLs — set FRONTEND_URL in Railway env vars
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Also allow any vercel.app subdomain for preview deployments
        if (origin.endsWith('.vercel.app')) return callback(null, true);
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. Security headers
app.use(helmet());

// 4. Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', generalLimiter);

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // raised from 10 to 20 so testing doesn't lock you out
    message: 'Too many login/register attempts, please try again after an hour',
});
app.use('/api/auth', authLimiter);

// 5. Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// 6. Body parsing
app.use(express.json({ limit: '10kb' }));

// 7. Security sanitization
app.use(mongoSanitize());
app.use(hpp());

// 8. Dependency Injection (Wiring the Hexagon)
const userRepository  = new MongoUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase    = new LoginUser(userRepository);
const authController  = new AuthController(registerUserUseCase, loginUserUseCase);

const tradeRepository    = new MongoTradeRepository();
const logTradeUseCase    = new LogTrade(tradeRepository);
const getTradesUseCase   = new GetTrades(tradeRepository);
const deleteTradeUseCase = new DeleteTrade(tradeRepository);
const updateTradeUseCase = new UpdateTrade(tradeRepository);
const getTradeUseCase    = new GetTrade(tradeRepository);
const tradeController    = new TradeController(logTradeUseCase, getTradesUseCase, deleteTradeUseCase, updateTradeUseCase, getTradeUseCase);

// 9. Routes
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/trades', createTradeRoutes(tradeController));

// 10. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'TradeJournal API running', env: process.env.NODE_ENV });
});

// 11. 404 handler
app.use((req, res, next) => {
    res.status(404);
    next(new Error(`Route not found - ${req.originalUrl}`));
});

// 12. Global Error Handler (Last middleware)
app.use(errorMiddleware);

// 13. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] TradeJournal API running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
