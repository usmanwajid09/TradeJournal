import { validateRegister, validateLogin } from '../validation/AuthValidation.js';

/**
 * AuthController - Primary Adapter
 * Drivers for the Authentication use cases via HTTP.
 */
class AuthController {
    constructor(registerUser, loginUser) {
        this.registerUser = registerUser;
        this.loginUser = loginUser;
    }

    async register(req, res, next) {
        try {
            // 1. Validation
            const { error } = validateRegister(req.body);
            if (error) {
                res.status(400);
                throw new Error(error.details[0].message);
            }

            const { name, email, password } = req.body;
            const user = await this.registerUser.execute({ name, email, password });
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            next(error); // Sends to errorMiddleware
        }
    }

    async login(req, res, next) {
        try {
            // 1. Validation
            const { error } = validateLogin(req.body);
            if (error) {
                res.status(400);
                throw new Error(error.details[0].message);
            }

            const { email, password } = req.body;
            const result = await this.loginUser.execute({ email, password });
            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            next(error); // Sends to errorMiddleware
        }
    }
}

export default AuthController;
