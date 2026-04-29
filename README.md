# TradeJournal — Professional Trading Dashboard

> A sophisticated trading journal and analytics platform built for serious traders. Built for Deliverable 2 of the Web Engineering course (Spring 2026).

---

## Overview

Success in trading depends on consistency and self-awareness. TradeJournal provides a centralized workspace for logging trades with virtual paper money, analyzing P&L stats, journaling execution quality, and tracking real-time market prices — all in a premium dark-mode interface.

---

## Screenshots

| Dashboard | Live Trades | Log Trade |
|---|---|---|
| GSAP-animated P&L counters, equity curve | Real-time Binance WebSocket prices | 3-step form with R:R calculator |

---

## Features (Deliverable 2)

### Core Pages
- **Dashboard** — Animated performance metrics (Total P&L, Win Rate, Avg R:R, Total Trades), equity growth SVG curve, daily P&L bar chart, scrolling live market ticker, recent trade table
- **Log Trade** — 3-step form (General → Orders → Journal) with live Risk:Reward calculator, mood selector, star rating, timeframe pills, animated progress bar, success toast
- **Live Trades Tracker** — Real-time Binance WebSocket prices for BTC/ETH/BNB, Twelve Data polling for AAPL/TSLA/NVDA/EURUSD/Gold, candlestick chart viewer, BUY/SELL modal
- **Trading Journal** — Complete trade history with filter tabs (All / Winners / Losers), symbol search, CSV export, delete with confirmation, stats strip (win rate, total P&L)
- **Profile** — Personal info settings, **Paper Trading Account** panel with balance, P&L vs start, expiry countdown, full transaction history, Reset button

### Real-Time Market Data
- **Crypto (BTC, ETH, BNB)** — Binance public WebSocket, true real-time, no API key required
- **Stocks (AAPL, TSLA, NVDA)** — Twelve Data REST API, polled every 12 seconds
- **Forex & Commodities (EUR/USD, Gold)** — Twelve Data REST API, polled every 12 seconds
- Price flash animation (green/red) on every tick
- `● REAL-TIME` badge for crypto, `≈ ~12s` label for stocks/forex
- Graceful fallback to last cached seed price on network error

### Virtual Paper Trading Credits
- **Starting balance**: $10,000 USD virtual credits
- **Win** → balance increases by the logged P&L amount
- **Loss** → balance decreases (floor: $0 — account blown)
- **30-day expiry** — auto-resets to $10,000 after 30 days
- **Navbar badge** — live balance shown in green (above $10k) or red (below)
- **Full transaction history** on Profile page
- Stored in `localStorage` (migrated to MongoDB in Deliverable 3)

### Premium UI & Animations
- **Dark Mode Design System** — HSL-tuned palette, glassmorphism cards, gradient borders
- **GSAP Animations** — 12 keyframe animations across the app:
  - Animated number counters (profit, win rate, total trades)
  - Equity line SVG draw-in (stroke-dashoffset)
  - Bar chart bars grow from base
  - Staggered table row entrances
  - Form field stagger on page load
  - Float animation on logo
- **Market Ticker Strip** — Scrolling live prices across the top of Dashboard
- **Login Page** — 4-slide auto-advancing carousel with unique accent glow per slide, GSAP fade-up transitions
- **Notification bell** with pulsing red dot animation

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 |
| **Routing** | React Router DOM v7 |
| **UI Components** | React-Bootstrap 5 |
| **Styling** | Bootstrap 5 + Vanilla CSS (custom design system) |
| **Animations** | GSAP (GreenSock Animation Platform) |
| **Icons** | Lucide React |
| **Real-Time Data** | Binance public WebSocket (crypto) |
| **Market API** | Twelve Data REST API (stocks, forex, commodities) |
| **State Management** | React Hooks (useState, useEffect, useRef, useMemo) |
| **Local Persistence** | localStorage (virtual balance, trade history) |
| **Build Tool** | Vite 8 |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top bar with virtual balance badge + notification bell
│   └── Sidebar.jsx         # Collapsible nav with gradient active indicator
├── layouts/
│   └── MainLayout.jsx      # Navbar + Sidebar shell with Outlet
├── pages/
│   ├── Login.jsx           # 4-slide GSAP carousel login page
│   ├── Dashboard.jsx       # GSAP-animated metrics, equity chart, ticker
│   ├── AddTrade.jsx        # 3-step trade log form with R:R calculator
│   ├── LiveTrades.jsx      # Real-time watchlist + candlestick chart
│   ├── TradesList.jsx      # Trade journal with filter, search, CSV export
│   └── Profile.jsx         # Settings + Paper Trading Account panel
└── services/
    ├── api.js              # Shared in-memory CRUD trade store
    ├── marketData.js       # Binance WebSocket + Twelve Data polling
    └── virtualBalance.js   # localStorage paper trading account (30-day TTL)
```

---

## Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/usmanwajid09/TradeJournal
cd TradeJournal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:
```env
VITE_TWELVE_DATA_KEY=your_free_key_here
```

> **Crypto prices (BTC, ETH, BNB) work immediately with no API key** via Binance public WebSocket.
> Stock/forex prices (AAPL, TSLA, EUR/USD, Gold) require a free [Twelve Data](https://twelvedata.com) API key (no credit card).

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Git Branches

| Branch | Purpose |
|---|---|
| `main` | Stable version — functional fixes, shared CRUD store, all actions working |
| `feature/premium-ui-overhaul` | Premium dark UI, GSAP animations, real-time market data, virtual credits |

---

## Project Deliverables Status

- [x] **Deliverable 1**: UI/UX Design (Figma)
- [x] **Deliverable 2**: Frontend Development
  - [x] All pages implemented and routed
  - [x] Shared in-memory data store (all CRUD actions functional)
  - [x] Real-time market data via Binance WebSocket + Twelve Data
  - [x] Virtual paper trading credits system ($10,000, 30-day TTL)
  - [x] GSAP-powered premium animations throughout
  - [x] Premium dark-mode design system
- [x] **Deliverable 3**: Backend Development (Hexagonal Architecture)
  - [x] Node.js + Express REST API
  - [x] MongoDB for trade persistence + user management
  - [x] Hexagonal Architecture (Entities, Use Cases, Adapters)
  - [x] JWT Authentication
  - [x] Complete Trade CRUD (Create, Read, Update, Delete)
- [ ] **Deliverable 4**: Integration & Deployment

---

## Team Members

| Name | GitHub |
|---|---|
| Usman Wajid | [@usmanwajid09](https://github.com/usmanwajid09) |
| Ahmad Masood | [@AhmadMasood13](https://github.com/AhmadMasood13) |

**Instructor**: Sir Kamran Arshad ([@M-K-Arshad](https://github.com/M-K-Arshad))  
**TA**: Simal Butt ([@simalbutt](https://github.com/simalbutt))

---

*Developed as part of the Web Engineering project requirement — Spring 2026.*
