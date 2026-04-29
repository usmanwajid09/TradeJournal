import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// 2. Middlewares
app.use(express.json());
app.use(cors());

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
