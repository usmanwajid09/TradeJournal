import axiosInstance from './axiosInstance';

/**
 * API Service Layer - Production Integration
 * 
 * Communicates with the Node.js/Express backend following Hexagonal Architecture.
 */

export const getTrades = async () => {
    try {
        const response = await axiosInstance.get('/trades');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch trades:', error);
        throw error;
    }
};

export const getTradeById = async (id) => {
    try {
        const response = await axiosInstance.get(`/trades/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Failed to fetch trade ${id}:`, error);
        throw error;
    }
};

export const getStats = async () => {
    try {
        const trades = await getTrades();
        const total      = trades.length;
        const wins       = trades.filter(t => t.status === 'Profit').length;
        const totalPnl   = trades.reduce((s, t) => s + (parseFloat(t.pnl) || 0), 0);
        const winRate    = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
        const avgPnl     = total > 0 ? (totalPnl / total).toFixed(2) : '0.00';
        
        return { total, wins, losses: total - wins, totalPnl, winRate, avgPnl };
    } catch (error) {
        return { total: 0, wins: 0, losses: 0, totalPnl: 0, winRate: '0.0', avgPnl: '0.00' };
    }
};

export const addTrade = async (tradeData) => {
    try {
        const response = await axiosInstance.post('/trades', tradeData);
        return response.data;
    } catch (error) {
        console.error('Failed to log trade:', error);
        throw error;
    }
};

export const updateTrade = async (id, updates) => {
    try {
        const response = await axiosInstance.put(`/trades/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error('Failed to update trade:', error);
        throw error;
    }
};

export const deleteTrade = async (id) => {
    try {
        const response = await axiosInstance.delete(`/trades/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete trade:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : { name: 'Guest', email: '', role: 'Trial User' };
};
