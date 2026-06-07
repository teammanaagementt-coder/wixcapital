import { useState, useEffect } from 'react';
import { Download, Upload, Repeat, Inbox, Wallet, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  
  // Data states
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [others, setOthers] = useState([]);

  const tabs = [
    { id: 'deposit', label: 'Deposits', icon: Download },
    { id: 'withdrawal', label: 'Withdrawals', icon: Upload },
    { id: 'other', label: 'Others', icon: Repeat },
  ];

  // Fetch all data
  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      try {
        // Fetch balance (from dashboard endpoint)
        const balanceRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const balanceData = await balanceRes.json();
        if (balanceRes.ok) {
          setCurrentBalance(balanceData.user.balance);
        }

        // Fetch deposits
        const depositsRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/deposits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const depositsData = await depositsRes.json();
        if (depositsRes.ok) setDeposits(depositsData);

        // Fetch withdrawals
        const withdrawalsRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const withdrawalsData = await withdrawalsRes.json();
        if (withdrawalsRes.ok) setWithdrawals(withdrawalsData);

        // Fetch others (bonus, referrals, etc.)
        const othersRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/others`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const othersData = await othersRes.json();
        if (othersRes.ok) setOthers(othersData);

      } catch (err) {
        console.error(err);
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Helper to format currency
  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Empty state component
  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
      <div className="h-12 w-12 rounded-full bg-dark-100 flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-gray-500" />
      </div>
      <p className="text-sm font-medium text-gray-300 mb-1">
        No {type} found
      </p>
      <p className="text-xs text-gray-500">
        Your {type} history will appear here
      </p>
    </div>
  );

  // Deposit Table (with real data)
  const DepositTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {deposits.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="deposits" />
              </td>
            </tr>
          ) : (
            deposits.map((deposit) => (
              <tr key={deposit._id}>
                <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                  {formatAmount(deposit.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {deposit.paymentMethod || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    deposit.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    deposit.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {deposit.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {formatDate(deposit.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Withdrawal Table
  const WithdrawalTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="withdrawals" />
              </td>
            </tr>
          ) : (
            withdrawals.map((withdrawal) => (
              <tr key={withdrawal._id}>
                <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                  {formatAmount(withdrawal.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {withdrawal.method}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    withdrawal.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    withdrawal.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {formatDate(withdrawal.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Others Table (bonus, referrals, etc.)
  const OtherTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {others.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="transactions" />
              </td>
            </tr>
          ) : (
            others.map((tx, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                  {formatAmount(tx.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {tx.type || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {tx.description || tx.plan || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                  {formatDate(tx.date || tx.createdAt)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // Mobile card view (same for all tabs)
  const MobileCard = () => {
    let data = [];
    let typeLabel = '';
    if (activeTab === 'deposit') {
      data = deposits;
      typeLabel = 'deposits';
    } else if (activeTab === 'withdrawal') {
      data = withdrawals;
      typeLabel = 'withdrawals';
    } else {
      data = others;
      typeLabel = 'transactions';
    }

    if (data.length === 0) {
      return (
        <div className="sm:hidden">
          <ul className="divide-y divide-gray-800">
            <li className="p-6 text-center">
              <EmptyState type={typeLabel} />
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div className="sm:hidden space-y-4 p-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-dark-100 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-lg font-semibold text-white">
                  {formatAmount(item.amount)}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                item.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {item.status || 'completed'}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {activeTab === 'deposit' ? 'Payment Mode' : activeTab === 'withdrawal' ? 'Method' : 'Type'}
              </p>
              <p className="text-sm text-gray-300">
                {activeTab === 'deposit' ? (item.paymentMethod || 'N/A') :
                 activeTab === 'withdrawal' ? (item.method || 'N/A') :
                 (item.type || 'N/A')}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm text-gray-300">
                {formatDate(item.createdAt || item.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Page Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Transaction Records</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Wallet className="w-4 h-4" />
              <span>Balance: ${currentBalance.toFixed(2)}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Records</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            View all your financial activities in one place.
          </p>
        </div>
      </div>

      {/* Transaction Records Card */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="px-2 sm:px-6 border-b border-gray-800">
          <div className="flex overflow-x-auto py-3 sm:py-4 no-scrollbar" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`mr-3 pb-3 px-1 inline-flex flex-col items-center text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                  role="tab"
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full mb-1 sm:mb-2 transition-colors ${
                      isActive
                        ? 'bg-primary/10'
                        : 'bg-dark-100'
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        isActive
                          ? 'text-primary'
                          : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-0 sm:p-6">
          <div className={activeTab === 'deposit' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden">
              <DepositTable />
            </div>
          </div>
          <div className={activeTab === 'withdrawal' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden">
              <WithdrawalTable />
            </div>
          </div>
          <div className={activeTab === 'other' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden">
              <OtherTable />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory;