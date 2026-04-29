import jwt from 'jsonwebtoken';

/**
 * Auth Middleware - Professional JWT Verification
 * Ensures the request has a valid Bearer token.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Authorization denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds {id, role} to req
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Token is invalid or expired.' });
    }
};

export default authMiddleware;
