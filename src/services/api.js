import { INITIAL_TRADES } from './mockData';

const STORAGE_KEY = 'tradejournal_trades';

/**
 * Initialize storage with mock data if empty
 */
const initStorage = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRADES));
  }
};

// Ensure storage is seeded on load
initStorage();

/**
 * Fetch all trades from localStorage
 */
export const getTrades = async () => {
  // Simulate network delay for realistic UI feel
  return new Promise((resolve) => {
    setTimeout(() => {
      const trades = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // Sort by date descending
      trades.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(trades);
    }, 400);
  });
};

/**
 * Add a new trade to localStorage
 */
export const addTrade = async (trade) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trades = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newTrade = {
        ...trade,
        id: `t${Date.now()}`,
        date: trade.date || new Date().toISOString()
      };
      trades.push(newTrade);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
      resolve(newTrade);
    }, 600);
  });
};

/**
 * Update an existing trade
 */
export const updateTrade = async (id, updatedData) => {
  const trades = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const index = trades.findIndex(t => t.id === id);
  if (index !== -1) {
    trades[index] = { ...trades[index], ...updatedData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    return trades[index];
  }
  throw new Error('Trade not found');
};

/**
 * Delete a trade
 */
export const deleteTrade = async (id) => {
  const trades = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const filtered = trades.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return { success: true };
};

/**
 * Get Account Statistics
 */
export const getStats = async () => {
  const trades = await getTrades();
  const wins = trades.filter(t => t.result > 0);
  const losses = trades.filter(t => t.result <= 0);
  
  const totalPnL = trades.reduce((sum, t) => sum + t.result, 0);
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const avgRR = trades.length > 0 ? trades.reduce((sum, t) => sum + t.rr, 0) / trades.length : 0;
  
  // Calculate max drawdown (simplified)
  let peak = 50000; // start balance
  let balance = 50000;
  let maxDD = 0;
  
  // Sort by date ascending for equity curve
  const chronTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  chronTrades.forEach(t => {
    balance += t.result;
    if (balance > peak) peak = balance;
    const drawDown = peak - balance;
    if (drawDown > maxDD) maxDD = drawDown;
  });

  return {
    totalPnL,
    winRate: winRate.toFixed(1),
    avgRR: avgRR.toFixed(1),
    maxDD: maxDD.toFixed(2),
    totalTrades: trades.length,
    currentBalance: balance
  };
};

export const getUserProfile = async () => {
  return { name: 'Pro Trader', email: 'trading@journal.io', role: 'Prop Firm Trader', balance: 54210 };
};
