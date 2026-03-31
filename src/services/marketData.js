/**
 * marketData.js — Real-Time Price Service
 *
 * Crypto  : Binance public WebSocket  — no API key, true real-time
 * Stocks  : Twelve Data REST polling  — free API key (8 req/min)
 * Forex   : Twelve Data REST polling  — same free key
 * Fallback: Returns last cached price  when API unavailable
 */

// ── Symbol metadata ──────────────────────────────────────────────────────────
export const SYMBOLS = {
    BTC:    { type: 'crypto',  binance: 'btcusdt',  twelveSymbol: null,        decimals: 2,  displayName: 'Bitcoin',          logo: '₿',  exchange: 'CRYPTO' },
    ETH:    { type: 'crypto',  binance: 'ethusdt',  twelveSymbol: null,        decimals: 2,  displayName: 'Ethereum',         logo: 'Ξ',  exchange: 'CRYPTO' },
    BNB:    { type: 'crypto',  binance: 'bnbusdt',  twelveSymbol: null,        decimals: 2,  displayName: 'BNB',              logo: '🟡', exchange: 'CRYPTO' },
    AAPL:   { type: 'stock',   binance: null,        twelveSymbol: 'AAPL',      decimals: 2,  displayName: 'Apple Inc.',       logo: '🍎', exchange: 'NASDAQ' },
    TSLA:   { type: 'stock',   binance: null,        twelveSymbol: 'TSLA',      decimals: 2,  displayName: 'Tesla, Inc.',      logo: '⚡', exchange: 'NASDAQ' },
    NVDA:   { type: 'stock',   binance: null,        twelveSymbol: 'NVDA',      decimals: 2,  displayName: 'NVIDIA Corp.',     logo: '🟢', exchange: 'NASDAQ' },
    EURUSD: { type: 'forex',   binance: null,        twelveSymbol: 'EUR/USD',   decimals: 4,  displayName: 'Euro / US Dollar', logo: '🇪🇺', exchange: 'FOREX'  },
    GOLD:   { type: 'commod',  binance: null,        twelveSymbol: 'XAU/USD',   decimals: 2,  displayName: 'Gold Spot',        logo: '🌕', exchange: 'COMMOD' },
};

// ── Seed prices (shown before first real tick arrives) ───────────────────────
const seedPrices = {
    BTC: 64215, ETH: 3482, BNB: 608,
    AAPL: 182.42, TSLA: 175.05, NVDA: 875.20,
    EURUSD: 1.0852, GOLD: 2158.4,
};

// ── Internal state ───────────────────────────────────────────────────────────
const priceCache    = { ...seedPrices };    // latest price per symbol
const subscribers   = {};                   // symbol → [callback, ...]
const openSockets   = {};                   // symbol → WebSocket
let   pollingTimer  = null;
let   pollSymbols   = [];                   // non-crypto symbols to poll

const API_KEY = import.meta.env.VITE_TWELVE_DATA_KEY || 'demo';

// ── Helper: notify all subscribers for a symbol ──────────────────────────────
function notify(symbol, price) {
    priceCache[symbol] = price;
    (subscribers[symbol] || []).forEach(cb => cb(symbol, price));
    // also fire wildcard '*' subscribers
    (subscribers['*'] || []).forEach(cb => cb(symbol, price));
}

// ── CRYPTO: Binance public WebSocket ─────────────────────────────────────────
function connectBinance(symbol) {
    const meta = SYMBOLS[symbol];
    if (!meta?.binance) return;
    if (openSockets[symbol]) return; // already connected

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${meta.binance}@ticker`);

    ws.onmessage = (evt) => {
        try {
            const data = JSON.parse(evt.data);
            const price = parseFloat(parseFloat(data.c).toFixed(meta.decimals));
            if (!isNaN(price) && price > 0) notify(symbol, price);
        } catch (_) { /* ignore bad frames */ }
    };

    ws.onerror = () => { /* silently keep last cached price */ };
    ws.onclose = () => {
        delete openSockets[symbol];
        // reconnect after 3s
        setTimeout(() => connectBinance(symbol), 3000);
    };

    openSockets[symbol] = ws;
}

// ── STOCK/FOREX: Twelve Data REST polling ────────────────────────────────────
async function pollTwelveData() {
    if (!pollSymbols.length) return;

    // Batch all non-crypto symbols into one request
    const syms = pollSymbols.map(s => SYMBOLS[s].twelveSymbol).join(',');

    try {
        const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(syms)}&apikey=${API_KEY}`;
        const res  = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();

        pollSymbols.forEach(symbol => {
            const key    = SYMBOLS[symbol].twelveSymbol;
            const raw    = pollSymbols.length === 1 ? data : data[key];
            if (!raw?.price) return;
            const price  = parseFloat(parseFloat(raw.price).toFixed(SYMBOLS[symbol].decimals));
            if (!isNaN(price) && price > 0) notify(symbol, price);
        });
    } catch (_) { /* keep last cached prices on network error */ }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Subscribe to live price updates for a symbol.
 * The callback is called immediately with the cached seed price,
 * then again each time a new price arrives.
 *
 * @param {string}   symbol  — e.g. 'BTC', 'AAPL', 'EURUSD'
 * @param {function} cb      — (symbol, price) => void
 * @returns {function}       — unsubscribe function
 */
export function subscribeToPrice(symbol, cb) {
    if (!subscribers[symbol]) subscribers[symbol] = [];
    subscribers[symbol].push(cb);

    // Fire immediately with cached price
    if (priceCache[symbol] != null) cb(symbol, priceCache[symbol]);

    return () => {
        subscribers[symbol] = subscribers[symbol].filter(fn => fn !== cb);
    };
}

/**
 * Subscribe to ALL symbol price updates.
 * @param {function} cb — (symbol, price) => void
 * @returns {function}  — unsubscribe
 */
export function subscribeToAllPrices(cb) {
    if (!subscribers['*']) subscribers['*'] = [];
    subscribers['*'].push(cb);

    // Fire for all cached prices immediately
    Object.entries(priceCache).forEach(([sym, price]) => cb(sym, price));

    return () => {
        subscribers['*'] = subscribers['*'].filter(fn => fn !== cb);
    };
}

/**
 * Get the last known price for a symbol (synchronous).
 */
export function getLastPrice(symbol) {
    return priceCache[symbol] ?? null;
}

/**
 * Get all current cached prices.
 */
export function getAllPrices() {
    return { ...priceCache };
}

/**
 * Start all live connections. Call once at app startup.
 */
export function startMarketData() {
    // Connect Binance for crypto
    Object.keys(SYMBOLS)
        .filter(s => SYMBOLS[s].type === 'crypto')
        .forEach(connectBinance);

    // Collect non-crypto for polling
    pollSymbols = Object.keys(SYMBOLS).filter(s => SYMBOLS[s].type !== 'crypto');

    // Poll immediately, then every 12 seconds
    pollTwelveData();
    pollingTimer = setInterval(pollTwelveData, 12000);
}

/**
 * Stop all connections and polling.
 */
export function stopMarketData() {
    Object.values(openSockets).forEach(ws => { try { ws.close(); } catch (_) {} });
    Object.keys(openSockets).forEach(k => delete openSockets[k]);
    if (pollingTimer) { clearInterval(pollingTimer); pollingTimer = null; }
    pollSymbols = [];
}

/**
 * Get display-formatted price string for a symbol.
 */
export function formatPrice(symbol, price) {
    if (price == null) return '—';
    const meta = SYMBOLS[symbol];
    return price.toLocaleString('en-US', {
        minimumFractionDigits: meta?.decimals ?? 2,
        maximumFractionDigits: meta?.decimals ?? 2,
    });
}
