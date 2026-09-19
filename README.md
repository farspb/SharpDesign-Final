# SharpKala — Advanced Financial & Bitcoin AI Intelligence Platform

[![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Ubuntu Ready](https://img.shields.io/badge/Ubuntu-20.04%20%7C%2022.04%20%7C%2024.04%20LTS-e95420?style=for-the-badge&logo=ubuntu&logoColor=white)](DEPLOYMENT_UBUNTU.md)

**SharpKala** is an institutional-grade financial analytics and algorithmic intelligence platform tailored for high-accuracy Bitcoin forecasting, multi-asset signals, planetary/astro-market cycles, real-time macroeconomic news sentiment, and automated historical fractal matching.

Designed with a high-contrast cybernetic aesthetic, mathematical precision, and full bilingual support (**English & Persian / RTL**), the platform provides institutional-quality insights for cryptocurrency traders, quantitative analysts, and financial researchers.

---

## 📑 Table of Contents
1. [Core Features & Architecture](#-core-features--architecture)
2. [Bitcoin Intelligence & Signal Engine Deep Dive](#-bitcoin-intelligence--signal-engine-deep-dive)
3. [Modules Overview](#-modules-overview)
4. [Project Structure](#-project-structure)
5. [Getting Started (Local Development)](#-getting-started-local-development)
6. [Available Scripts](#-available-scripts)
7. [Production Deployment on Ubuntu Server](#-production-deployment-on-ubuntu-server)
8. [Technologies & Dependencies](#-technologies--dependencies)
9. [Disclaimer](#-disclaimer)

---

## ⚡ Core Features & Architecture

- **Multi-Timeframe Analytical Precision:** True timeframe-isolated calculations for **1H, 4H, 1D, 1W, 1M, and 1Y**, recalculating technical indicators, resistance/support levels, and trading ranges specifically for the active horizon.
- **Historical Analogy & Bitcoin Fractal Matching Engine:** Automatically correlates live Bitcoin price action against the entire history of Bitcoin (2010–present) to locate and visually compare the single most structurally identical historical cycle (up to 99.1% mathematical similarity).
- **Multi-Model Predictive AI Suite:** 7 computational forecasting algorithms (LSTM, Transformer/Attention, ARIMA, Quantitative Stat-Arb, DeepSeek AI, Reinforcement Learning, Meta Prophet) evaluated under 3 forward scenarios (Bullish, Base, Bearish).
- **Confluence Matrix & Deep Reasoning:** Evaluates Harmonic Patterns, Elliott Wave degrees, Linear Regression channels, Liquidity Order Book pools, and On-Balance Volume (OBV).
- **Financial Astrology & Macro Cycles:** Correlates lunar phases, planetary ingresses, and retrograde cycles with macro liquidity inflection points.
- **Bi-Directional Localization (LTR / RTL):** Seamless on-the-fly toggling between English and Persian (فارسی) with proper font scaling and layout flipping.
- **Institutional Dark Theme:** Engineered for reduced eye strain during extended market monitoring, using subtle gradients, reactive SVG vector charts, and zero generic UI templates.

---

## 🧠 Bitcoin Intelligence & Signal Engine Deep Dive

Located in `/pages/CryptoSignals.tsx`, this is the platform's flagship analytics suite.

### 1. Multi-Timeframe Parameter Isolation
Unlike basic dashboards that only scale the chart view, SharpKala's analytical engine completely recomputes its mathematical parameters based on the selected timeframe:
- **1H (Intraday Scalping):** High-frequency order book sweeps, short-term moving average convergence, and immediate liquidity targets.
- **4H (Swing Horizon):** Intermediate support/resistance channels, Fibonacci retracements, and volatility breakouts.
- **1D (Macro Trend):** Institutional accumulation zones, 200-day EMA health, and Wyckoff structural phases.
- **1W (Cycle Progression):** Halving cycle tracking, logarithmic regression bands, and macro momentum.
- **1M & 1Y (Secular Horizons):** Multi-year logarithmic adoption curves and long-term liquidity super-cycles.

### 2. Historical Analogy & Fractal Comparison Engine
The system analyzes the geometry of the current price trajectory and compares it against critical historical inflection points:
- **1H Analog:** *May 2024 Wyckoff Spring* (97.8% similarity) — Intraday liquidity sweeps and rapid V-shape recovery.
- **4H Analog:** *September 2023 Post-Consolidation Breakout* (98.4% similarity) — Bollinger squeeze and aggressive volatility expansion.
- **1D Analog:** *October 2020 Launchpad* (99.1% similarity) — Pre-bull run logarithmic resistance flip that ignited the $20k to $64k rally.
- **1W Analog:** *December 2016 Accumulation* (96.5% similarity) — Post-halving supply absorption and weekly EMA ribbon alignment.
- **1M Analog:** *January 2015 Macro Bottom* (95.2% similarity) — MACD histogram compression and secular cycle reversal.
- **1Y Analog:** *2012 Early Adoption Era* (94.8% similarity) — Scarcity dynamics and exponential growth geometry.

**Dual SVG Vector Visualization:** Directly renders the real-time normalized price trajectory alongside the historical analog curve with high-precision SVG vector lines, glow paths, and interactive data points.

### 3. Predictive Modeling & Scenario Projections
- **7 Computational Forecasting Models:**
  1. `LSTM`: Recurrent neural network capturing temporal price dependencies.
  2. `Attention / Transformer`: Multi-head self-attention identifying macro structural confluence.
  3. `ARIMA`: Autoregressive Integrated Moving Average for baseline statistical extrapolation.
  4. `Quant`: Quantitative mean-reversion and volatility-adjusted statistical arbitrage.
  5. `DeepSeek AI`: Machine-learning pattern synthesis across multiple alternative data vectors.
  6. `RL Agent`: Deep Q-learning reinforcement agent evaluating reward-to-risk optimality.
  7. `Meta Prophet`: Additive model with non-linear trends and holiday/cyclical seasonality.
- **3 Dynamic Scenarios:**
  - `Bullish`: Institutional liquidity injection and breakout extension.
  - `Base`: Equilibrium fair-value trajectory.
  - `Bearish`: Liquidity harvest, mean-reversion, and support retest.
- **Institutional Statistical Verification:**
  - **MAPE:** Mean Absolute Percentage Error calculation.
  - **R² Score:** Goodness-of-fit coefficient of determination.
  - **Sharpe Ratio:** Risk-adjusted return assessment.
  - **Max Drawdown:** Downside volatility tolerance threshold.

---

## 🌐 Modules Overview

| Route | Module | Purpose |
| :--- | :--- | :--- |
| `/` | **Home & Services** | Agency overview, core offerings, full-stack development, and financial solutions. |
| `/crypto` | **Crypto & BTC Signals** | Institutional Bitcoin analytics, live TradingView charts, AI deep reasoning, fractal matching, and predictive forecasting. |
| `/stock` | **Stock Market Signals** | Global equity indices, blue-chip stocks, commodities, and technical trend analysis. |
| `/astrology` | **Financial Astrology** | Astrological trading cycles, planetary retrogrades, lunar phases, and historical correlation maps. |
| `/news` | **Market News & Sentiment** | Real-time financial headlines, crypto breaking news, macroeconomic releases, and AI sentiment scoring. |
| `/auth` | **User Authentication** | User sign-in, account security, and customized workspace preferences. |

---

## 📁 Project Structure

```text
├── App.tsx                     # Application router, theme & context provider wrappers
├── index.html                  # HTML entry point with metadata, icons, and fonts
├── index.tsx                   # React 19 DOM root mounting
├── vite.config.ts              # Vite bundling, dev server (port 3000), and env configuration
├── tsconfig.json               # TypeScript compiler options
├── package.json                # Project dependencies, build, dev, and preview scripts
├── constants.ts                # Application-wide constants and configurations
├── types.ts                    # Global TypeScript interfaces and enum declarations
│
├── contexts/                   # React Context Providers
│   ├── AuthContext.tsx         # User authentication & session state
│   ├── LanguageContext.tsx     # English / Persian (RTL) localization context
│   └── ThemeContext.tsx        # Dark / Light theme manager
│
├── pages/                      # Primary View Controllers
│   ├── Home.tsx                # Landing page & agency showcase
│   ├── CryptoSignals.tsx       # Flagship Bitcoin & crypto AI prediction engine
│   ├── StockSignals.tsx        # Stock market indicators & equity signals
│   ├── Astrology.tsx           # Astro-financial cycles & planetary research
│   ├── News.tsx                # Real-time financial news aggregator & sentiment
│   └── Auth.tsx                # Login & user authentication
│
├── components/                 # Reusable UI Components
│   ├── Header.tsx              # Top navigation bar, language switcher, theme toggle
│   ├── Footer.tsx              # Global footer, links, and system indicators
│   ├── Hero.tsx                # Animated hero presentation section
│   ├── Features.tsx            # Core platform capabilities
│   ├── Services.tsx            # Full-stack and financial development services
│   └── Contact.tsx             # Inquiry form & consultation scheduler
│
└── DEPLOYMENT_UBUNTU.md        # Comprehensive Ubuntu Linux production deployment guide
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js:** v18.0.0 or higher (Node.js 20+ LTS or 22+ LTS recommended)
- **Package Manager:** `npm` (v9+) or `bun` / `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   cd YOUR_REPOSITORY
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🛠️ Available Scripts

In the project root, you can execute:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server on `http://0.0.0.0:3000`. |
| `npm run build` | Compiles TypeScript and packages optimized production assets into the `/dist` directory. |
| `npm run preview` | Runs a local web server to preview the compiled production build from `/dist`. |

---

## 🖥️ Production Deployment on Ubuntu Server

For full step-by-step instructions on deploying this application to an **Ubuntu Linux (20.04, 22.04, or 24.04 LTS)** VPS or dedicated server with **Nginx, SSL/TLS (Let's Encrypt), UFW Firewall, and PM2 process management**, refer to:

👉 **[Complete Ubuntu Linux Deployment Guide (DEPLOYMENT_UBUNTU.md)](DEPLOYMENT_UBUNTU.md)**

### Quick Production Build Summary:
```bash
# 1. On your Ubuntu server:
cd /var/www/sharpkala

# 2. Install dependencies & compile:
npm ci
npm run build

# 3. Assets are compiled into /var/www/sharpkala/dist
# Nginx serves this folder with high-performance static caching and SPA fallback.
```

---

## 📦 Technologies & Dependencies

- **Core:** [React 19](https://react.dev/), [TypeScript 5.8](https://www.typescriptlang.org/), [Vite 6.2](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/) (HashRouter configuration for seamless hosting)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Motion](https://motion.dev/) (Framer Motion v12)

---

## ⚠️ Disclaimer

*This application is created for quantitative research, analytical education, and informational purposes only. The signals, predictions, and algorithmic forecasts generated by this platform do not constitute financial, investment, trading, or legal advice. Cryptocurrency and equities trading involve substantial risk of financial loss. Always conduct independent due diligence.*

---

## 📄 License
MIT License. Feel free to use, modify, and distribute for personal and commercial projects.
