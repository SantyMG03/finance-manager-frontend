import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Register from './pages/Register';
import Diary from './pages/Diary';
import Categories from './pages/Categories';
import BankAccounts from './pages/BankAccounts';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/accounts" element={<BankAccounts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-transaction" element={<AddTransaction />} /> 
        <Route path="/history" element={<TransactionHistory />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
