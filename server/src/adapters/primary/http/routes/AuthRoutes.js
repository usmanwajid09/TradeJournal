import express from 'express';

/**
 * Creates the Auth Router and injects the controller.
 * Following Hexagonal Architecture, routes depend on the controller adapter.
 */
const createAuthRoutes = (authController) => {
    const router = express.Router();

    // Bind methods to ensure 'this' context is preserved if needed
    router.post('/register', (req, res, next) => authController.register(req, res, next));
    router.post('/login', (req, res, next) => authController.login(req, res, next));

    return router;
};

export default createAuthRoutes;
