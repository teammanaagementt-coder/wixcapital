import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminPrivateRoute from './components/AdminPrivateRoute';

// Landing Page (Public)
import Home from './pages/home/Home';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminInvestmentPlans from './pages/admin/AdminInvestmentPlans';
import AdminSettings from './pages/admin/AdminSettings';

// Core pages
import Overview from './pages/Overview';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import DepositPayment from './pages/DepositPayment'; 
import WithdrawFunds from './pages/WithdrawFunds'; 
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import InvestmentPlans from './pages/InvestmentPlans';
import Futures from './pages/Futures';
import Transactions from './pages/Transactions';
import TradingHistory from './pages/TradingHistory';
import Settings from './pages/Settings';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── Public Routes ──────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ─── User Protected Routes ──────────────────────────────── */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<PrivateRoute><Overview /></PrivateRoute>} />
            <Route path="deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
            <Route path="withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
            <Route path="deposit-payment" element={<PrivateRoute><DepositPayment /></PrivateRoute>} />
            <Route path="withdraw-funds" element={<PrivateRoute><WithdrawFunds /></PrivateRoute>} />
            <Route path="markets" element={<PrivateRoute><Markets /></PrivateRoute>} />
            <Route path="trade" element={<PrivateRoute><Trade /></PrivateRoute>} />
            <Route path="investment-plans" element={<PrivateRoute><InvestmentPlans /></PrivateRoute>} />
            <Route path="futures" element={<PrivateRoute><Futures /></PrivateRoute>} />
            <Route path="transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="trading-history" element={<PrivateRoute><TradingHistory /></PrivateRoute>} />
            <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
          </Route>

          {/* ─── Admin Routes ────────────────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
            <Route path="users" element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
            <Route path="deposits" element={<AdminPrivateRoute><AdminDeposits /></AdminPrivateRoute>} />
            <Route path="withdrawals" element={<AdminPrivateRoute><AdminWithdrawals /></AdminPrivateRoute>} />
            <Route path="investment-plans" element={<AdminPrivateRoute><AdminInvestmentPlans /></AdminPrivateRoute>} />
            <Route path="settings" element={<AdminPrivateRoute><AdminSettings /></AdminPrivateRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;