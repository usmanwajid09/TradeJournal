/**
 * virtualBalance.js — Paper Trading Virtual Credits
 *
 * Stores a virtual trading balance in localStorage with:
 * - Starting balance: $10,000
 * - 30-day TTL (auto-resets, never goes below $0)
 * - Full history of trades that affected the balance
 *
 * In Deliverable 3 this will be replaced with a MongoDB-backed API.
 */

const STORAGE_KEY = 'tradejournal_virtual_balance';
const STARTING_BALANCE = 10_000;
const EXPIRY_DAYS      = 30;

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (_) { return null; }
}

function saveStore(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) { /* storage full — ignore */ }
}

function makeFreshStore() {
    const now       = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);
    return {
        balance:   STARTING_BALANCE,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        history:   [],
    };
}

function isExpired(store) {
    return new Date() > new Date(store.expiresAt);
}

// ── Ensure store exists and is not expired ────────────────────────────────────
function ensureStore() {
    let store = getStore();
    if (!store || isExpired(store)) {
        store = makeFreshStore();
        saveStore(store);
    }
    return store;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get the current virtual balance.
 * @returns {{ balance: number, expiresAt: string, daysLeft: number, isNew: boolean }}
 */
export function getBalance() {
    const store    = ensureStore();
    const now      = new Date();
    const expiry   = new Date(store.expiresAt);
    const daysLeft = Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)));
    return {
        balance:   store.balance,
        expiresAt: store.expiresAt,
        daysLeft,
        pnlSinceStart: parseFloat((store.balance - STARTING_BALANCE).toFixed(2)),
        startingBalance: STARTING_BALANCE,
    };
}

/**
 * Apply a trade result to the virtual balance.
 * @param {number} pnl     — positive = profit, negative = loss
 * @param {string} reason  — e.g. "AAPL Long (+$240.50)"
 * @returns {{ newBalance: number, change: number }}
 */
export function applyTrade(pnl, reason = '') {
    const store      = ensureStore();
    const change     = parseFloat(pnl.toFixed(2));
    const newBalance = parseFloat(Math.max(0, store.balance + change).toFixed(2));

    store.balance = newBalance;
    store.history.unshift({
        id:        Date.now(),
        date:      new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
        time:      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        change,
        balance:   newBalance,
        reason,
        type:      change >= 0 ? 'profit' : 'loss',
    });

    // Keep only last 100 entries
    if (store.history.length > 100) store.history = store.history.slice(0, 100);

    saveStore(store);
    return { newBalance, change };
}

/**
 * Get full trade history for the virtual account.
 * @returns {Array}
 */
export function getHistory() {
    return ensureStore().history;
}

/**
 * Force-reset the balance back to $10,000 and extend expiry by 30 more days.
 * @returns {object} fresh store
 */
export function resetBalance() {
    const fresh = makeFreshStore();
    saveStore(fresh);
    return getBalance();
}

/**
 * Format a balance number as a currency string.
 * e.g. 10240.5 → "$10,240.50"
 */
export function formatBalance(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        .format(amount);
}

/**
 * Returns true if the account is expired (so UI can prompt renewal).
 */
export function isAccountExpired() {
    const store = getStore();
    return !store || isExpired(store);
}
