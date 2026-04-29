import Joi from 'joi';

/**
 * Trade Validation Schema
 */
const tradeSchema = Joi.object({
    symbol: Joi.string().required(),
    side: Joi.string().valid('Long', 'Short').required(),
    entry: Joi.number().required(),
    exit: Joi.number().allow(null, ''),
    size: Joi.number().allow(null, ''),
    rr: Joi.string().allow(null, ''),
    pnl: Joi.number().allow(null, ''),
    status: Joi.string().valid('Profit', 'Loss', 'Break-even', 'Open').default('Open'),
    mood: Joi.string().allow(null, ''),
    rating: Joi.number().min(1).max(5).allow(null, ''),
    strategy: Joi.string().allow(null, ''),
    timeframe: Joi.string().allow(null, ''),
    notes: Joi.string().allow(null, ''),
    date: Joi.date().allow(null, '')
});

export const validateTrade = (data) => tradeSchema.validate(data);
