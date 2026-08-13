# Personal Finance & Portfolio Frontend

Web frontend for personal finance and investment portfolio tracking. React SPA that consumes the [Personal Finance & Portfolio API](https://github.com/santy/finance-manager-backend): log in, view your portfolio analysis, add and delete stock/ETF transactions, and browse your transaction history.

## 🛠️ Technologies

* **React 19**
* **Vite 8** (dev server, HMR and production build)
* **React Router DOM 7** (routing)
* **ESLint** with React, React Hooks and React Refresh plugins

## ✨ Features

### Authentication
* Login form against `/api/auth/login`; stores the returned JWT in `localStorage`.
* All API calls include the token via the `Authorization: Bearer` header.

### Portfolio (`/dashboard`)
* Real-time portfolio analysis: weighted average price, current market value, profit/loss in euros and percentage per position.

### Transactions (`/add-transaction`, `/history`)
* Form to add stock/ETF buy and sell transactions (ticker, shares, price, commission, ...).
* History view listing your transactions with the option to delete them.

## 🚀 Getting Started

### Prerequisites
* **Node.js 20.19+** (or 22.12+)
* The **backend API running on `http://localhost:8080`** (see the backend README).

### Install & Run
```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173` and the backend allows CORS requests from that origin.

### Other scripts
```bash
npm run build   # production build to dist/
npm run preview # preview the production build locally
npm run lint    # run ESLint
```

### API base URL
The API base URL is defined in the service files under `src/services/` (`http://localhost:8080/api/...`). Change it there if you deploy the backend elsewhere.
