import express from 'express';

/**
 * Creates the Auth Router and injects the controller.
 * Following Hexagonal Architecture, routes depend on the controller adapter.
 */
const createAuthRoutes = (authController) => {
    const router = express.Router();

    // Bind methods to ensure 'this' context is preserved if needed
    router.post('/register', (req, res) => authController.register(req, res));
    router.post('/login', (req, res) => authController.login(req, res));

    return router;
};

export default createAuthRoutes;
