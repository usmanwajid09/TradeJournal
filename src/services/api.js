/**
 * API Service Layer - Mock for Deliverable 2
 * 
 * In Deliverable 3, this will be replaced with actual Axios calls to the 
 * Node.js/Express backend following Hexagonal Architecture.
 */

// Mock data for trades
const MOCK_TRADES = [
    { id: 1, symbol: 'BTC/USDT', type: 'Long', entry: 52400, exit: 54100, pnl: 1700, status: 'Closed' },
    { id: 2, symbol: 'TSLA', type: 'Short', entry: 185, exit: 180, pnl: 5, status: 'Closed' },
    { id: 3, symbol: 'ETH/USDT', type: 'Long', entry: 2800, exit: null, pnl: 150, status: 'Open' },
];

export const getTrades = async () => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_TRADES);
        }, 500);
    });
};

export const addTrade = async (tradeData) => {
    console.log('Adding trade:', tradeData);
    // TODO: Implement POST request to Express backend in Deliverable 3
    return { success: true, message: 'Trade logged successfully!' };
};

// Placeholder for user profile integration
export const getUserProfile = async () => {
    return { name: 'John Doe', email: 'john@example.com', role: 'Pro Trader' };
};
