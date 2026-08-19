# Personal Finance & Portfolio Frontend

Minimal web client for the [Personal Finance & Portfolio API](https://github.com/SantyMG03/finance-manager-backend). This project is intentionally **not a full product UI** — it exists only to verify that the backend works end-to-end, covering every feature: authentication, portfolio analysis, transactions, diary, bank accounts and categories.

## 🛠️ Technologies

* **React 19**
* **Vite 8** (dev server, HMR and production build)
* **React Router DOM 7** (routing)
* **react-hot-toast** (notifications)
* **Recharts** (portfolio charts)
* **ESLint** with React, React Hooks and React Refresh plugins

## ✨ Features

### Authentication (`/`, `/register`)
* Login form against `/api/auth/login`; stores the returned JWT in `localStorage`.
* Registration form against `/api/auth/register`.
* All API calls include the token via the `Authorization: Bearer` header.

### Portfolio (`/dashboard`)
* Real-time portfolio analysis: weighted average price, current market value, profit/loss in euros and percentage per position.

### Transactions (`/add-transaction`, `/history`)
* Form to add stock/ETF buy and sell transactions (ticker, shares, price, commission, ...).
* History view listing your transactions with the option to delete them.

### Diary (`/diary`)
* CRUD of daily expense/income entries linked to a bank account and a category.

### Bank Accounts (`/accounts`)
* CRUD of bank accounts with initial balance.

### Categories (`/categories`)
* CRUD of expense categories (e.g., food, transport, leisure).

## 🚀 Getting Started

### Prerequisites
* **Node.js 20.19+** (or 22.12+)
* The **backend API running on `http://localhost:8080`** (see the [backend README](https://github.com/SantyMG03/finance-manager-backend)).

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