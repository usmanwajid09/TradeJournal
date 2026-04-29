import Joi from 'joi';

/**
 * Auth Validation Schemas
 * Ensures incoming HTTP requests follow strict data rules.
 */

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const validateRegister = (data) => registerSchema.validate(data);
export const validateLogin    = (data) => loginSchema.validate(data);
