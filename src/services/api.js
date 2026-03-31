/**
 * API Service Layer - Mock for Deliverable 2
 *
 * In Deliverable 3, this will be replaced with actual Axios calls to the
 * Node.js/Express backend following Hexagonal Architecture.
 */

// In-memory trade store — persists within the session (resets on page refresh).
// Replaces the old static array so AddTrade, TradesList, and Dashboard share state.
let tradeStore = [
    { id: 1, symbol: 'EURUSD',  side: 'Long',  entry: '1.0852', exit: '1.0924', size: 1.0,  rr: '1:2.1', profit: '+$720',   pnl: 720,   status: 'Profit', mood: '😊', rating: 4, strategy: 'Trend Following', timeframe: '1H', notes: 'Strong breakout above resistance. Clean entry on retest.',  date: '2024-03-20' },
    { id: 2, symbol: 'BTCUSDT', side: 'Short', entry: '64200',  exit: '63500',  size: 0.5,  rr: '1:3.4', profit: '+$1,200', pnl: 1200,  status: 'Profit', mood: '😎', rating: 5, strategy: 'Supply & Demand', timeframe: '4H', notes: 'Bearish engulfing at key supply zone. Perfect entry.',        date: '2024-03-22' },
    { id: 3, symbol: 'GBPUSD',  side: 'Long',  entry: '1.2620', exit: '1.2580', size: 1.0,  rr: '1:1.2', profit: '-$350',   pnl: -350,  status: 'Loss',   mood: '😐', rating: 2, strategy: 'Breakout',       timeframe: '1H', notes: 'False breakout above prior high. Stopped out.',              date: '2024-03-21' },
    { id: 4, symbol: 'GOLD',    side: 'Long',  entry: '2150',   exit: '2180',   size: 0.2,  rr: '1:4.5', profit: '+$1,500', pnl: 1500,  status: 'Profit', mood: '🔥', rating: 5, strategy: 'Trend Following', timeframe: '4H', notes: 'Geopolitical news push. Held for full target.',              date: '2024-03-23' },
    { id: 5, symbol: 'NASDAQ',  side: 'Short', entry: '18200',  exit: '18350',  size: 0.1,  rr: '1:1.0', profit: '-$250',   pnl: -250,  status: 'Loss',   mood: '😤', rating: 1, strategy: 'Mean Reversion', timeframe: '15m', notes: 'Went against the trend. Lesson learned.',                   date: '2024-03-22' },
    { id: 6, symbol: 'USDJPY',  side: 'Short', entry: '151.20', exit: '150.80', size: 1.0,  rr: '1:2.0', profit: '+$400',   pnl: 400,   status: 'Profit', mood: '😊', rating: 3, strategy: 'Supply & Demand', timeframe: '1H', notes: 'Supply zone held perfectly. Took partial at 151.00.',        date: '2024-03-19' },
    { id: 7, symbol: 'ETHUSDT', side: 'Long',  entry: '3200',   exit: '3480',   size: 0.3,  rr: '1:3.0', profit: '+$840',   pnl: 840,   status: 'Profit', mood: '😎', rating: 4, strategy: 'Trend Following', timeframe: '4H', notes: 'BTC correlation trade. Held overnight.',                     date: '2024-03-18' },
    { id: 8, symbol: 'AAPL',    side: 'Long',  entry: '175.00', exit: '181.40', size: 10,   rr: '1:2.8', profit: '+$640',   pnl: 640,   status: 'Profit', mood: '😊', rating: 3, strategy: 'Earnings Play',   timeframe: 'D',  notes: 'Pre-earnings momentum. Exited before report.',             date: '2024-03-17' },
    { id: 9, symbol: 'XAUUSD',  side: 'Long',  entry: '2130',   exit: '2098',   size: 0.1,  rr: '1:0.8', profit: '-$320',   pnl: -320,  status: 'Loss',   mood: '😨', rating: 1, strategy: 'Breakout',       timeframe: '1H', notes: 'Chased the breakout. Classic FOMO trade.',                 date: '2024-03-16' },
    { id: 10, symbol: 'TSLA',   side: 'Short', entry: '185.00', exit: '178.50', size: 5,    rr: '1:2.5', profit: '+$325',   pnl: 325,   status: 'Profit', mood: '😎', rating: 4, strategy: 'Supply & Demand', timeframe: '4H', notes: 'Weak hands shaken out. Supply zone triggered short.',       date: '2024-03-15' },
];

let nextId = tradeStore.length + 1;

// ── READ ──────────────────────────────────────────────────────────────────────

export const getTrades = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...tradeStore]), 300);
    });
};

export const getStats = async () => {
    const trades = [...tradeStore];
    const total      = trades.length;
    const wins       = trades.filter(t => t.status === 'Profit').length;
    const totalPnl   = trades.reduce((s, t) => s + t.pnl, 0);
    const winRate    = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
    const avgPnl     = total > 0 ? (totalPnl / total).toFixed(2) : '0.00';
    return { total, wins, losses: total - wins, totalPnl, winRate, avgPnl };
};

// ── CREATE ────────────────────────────────────────────────────────────────────

export const addTrade = async (tradeData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const pnl = parseFloat(tradeData.profit?.replace(/[^0-9.-]/g, '')) || 0;
            const newTrade = {
                id:       nextId++,
                date:     new Date().toISOString().split('T')[0],
                status:   pnl >= 0 ? 'Profit' : 'Loss',
                pnl,
                ...tradeData,
            };
            tradeStore.push(newTrade);
            resolve({ success: true, trade: newTrade });
        }, 300);
    });
};

// ── UPDATE ────────────────────────────────────────────────────────────────────

export const updateTrade = async (id, updates) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = tradeStore.findIndex(t => t.id === id);
            if (idx !== -1) tradeStore[idx] = { ...tradeStore[idx], ...updates };
            resolve({ success: true });
        }, 200);
    });
};

// ── DELETE ────────────────────────────────────────────────────────────────────

export const deleteTrade = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            tradeStore = tradeStore.filter(t => t.id !== id);
            resolve({ success: true });
        }, 200);
    });
};

// ── PROFILE ───────────────────────────────────────────────────────────────────

export const getUserProfile = async () => {
    return { name: 'Ahmad Masood', email: 'ahmad@tradejournal.io', role: 'Pro Trader' };
};
