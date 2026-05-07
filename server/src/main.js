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

dotenv.config();

// 1. Connect to Database
connectDB();

const app = express();

// 2. Global Middlewares
// 🛡️ Security: Set security HTTP headers (MIT Guide Section 3)
app.use(helmet());

// Middlewares will be added after body parsing

// 🛡️ Security: Rate Limiting to prevent DoS/Brute Force (MIT Guide Section 5)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', generalLimiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login/register attempts, please try again after an hour',
});
app.use('/api/auth', authLimiter);

// 📝 Logging: Professional request logging (SOA Audit requirement)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
app.use(cors());

// 🛡️ Security: Data sanitization against NoSQL query injection (MIT Guide Section 4)
app.use(mongoSanitize());

// 🛡️ Security: Prevent HTTP Parameter Pollution
app.use(hpp());

// 3. Dependency Injection (Wiring the Hexagon)
// User Context
const userRepository = new MongoUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const loginUserUseCase = new LoginUser(userRepository);
const authController = new AuthController(registerUserUseCase, loginUserUseCase);

// Trade Context
const tradeRepository = new MongoTradeRepository();
const logTradeUseCase = new LogTrade(tradeRepository);
const getTradesUseCase = new GetTrades(tradeRepository);
const deleteTradeUseCase = new DeleteTrade(tradeRepository);
const updateTradeUseCase = new UpdateTrade(tradeRepository);
const getTradeUseCase = new GetTrade(tradeRepository);
const tradeController = new TradeController(logTradeUseCase, getTradesUseCase, deleteTradeUseCase, updateTradeUseCase, getTradeUseCase);

// 4. Routes
app.use('/api/auth', createAuthRoutes(authController));
app.use('/api/trades', createTradeRoutes(tradeController));

// 5. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'TradeJournal Backend is running' });
});

// 6. Global Error Handler (Last middleware)
import errorMiddleware from './middleware/errorMiddleware.js';
app.use((req, res, next) => {
    res.status(404);
    next(new Error(`Route not found - ${req.originalUrl}`));
});
app.use(errorMiddleware);

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Server] TradeJournal API running on port ${PORT}`);
});
