import express from 'express';
import authMiddleware from '../../../../middleware/authMiddleware.js';
import { validateTrade } from '../validation/TradeValidation.js';

/**
 * Creates the Trade Router and injects the controller.
 * All routes are protected by authMiddleware.
 */
const createTradeRoutes = (tradeController) => {
    const router = express.Router();

    // Middleware to validate trade data on creation
    const tradeValidationMiddleware = (req, res, next) => {
        if (req.method === 'POST') {
            const { error } = validateTrade(req.body);
            if (error) {
                res.status(400);
                return next(new Error(error.details[0].message));
            }
        }
        next();
    };

    router.use(authMiddleware);

    router.get('/', (req, res, next) => tradeController.getAll(req, res, next));
    router.get('/:id', (req, res, next) => tradeController.getById(req, res, next));
    router.post('/', tradeValidationMiddleware, (req, res, next) => tradeController.create(req, res, next));
    router.put('/:id', tradeValidationMiddleware, (req, res, next) => tradeController.update(req, res, next));
    router.delete('/:id', (req, res, next) => tradeController.remove(req, res, next));

    return router;
};

export default createTradeRoutes;
