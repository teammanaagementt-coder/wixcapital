import { useState, useEffect } from 'react';
import { Download, Upload, Repeat, Inbox, Wallet, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [others, setOthers] = useState([]);

  const tabs = [
    { id: 'deposit', label: 'Deposits', icon: Download },
    { id: 'withdrawal', label: 'Withdrawals', icon: Upload },
    { id: 'other', label: 'Others', icon: Repeat },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      try {
        const balanceRes = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const balanceData = await balanceRes.json();
        if (balanceRes.ok) setCurrentBalance(balanceData.user.balance);

        const depositsRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/deposits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const depositsData = await depositsRes.json();
        if (depositsRes.ok) setDeposits(depositsData);

        const withdrawalsRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/withdrawals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const withdrawalsData = await withdrawalsRes.json();
        if (withdrawalsRes.ok) setWithdrawals(withdrawalsData);

        const othersRes = await fetch(`${import.meta.env.VITE_API_URL}/transactions/others`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const othersData = await othersRes.json();
        if (othersRes.ok) setOthers(othersData);
      } catch (err) {
        toast.error('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
  const formatAmount = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const EmptyState = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
      <div className="h-12 w-12 rounded-full bg-[#1a1a28] flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-[#4a4a64]" />
      </div>
      <p className="text-sm font-medium text-[#9898b0] mb-1">No {type} found</p>
      <p className="text-xs text-[#4a4a64]">Your {type} history will appear here</p>
    </div>
  );

  const DepositTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-[#1a1a28]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Payment Mode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a28]">
          {deposits.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="deposits" />
              </td>
            </tr>
          ) : (
            deposits.map((deposit) => (
              <tr key={deposit._id}>
                <td className="px-6 py-4 text-sm font-medium text-[#e8e8f0] whitespace-nowrap">{formatAmount(deposit.amount)}</td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{deposit.paymentMethod || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    deposit.status === 'completed' ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]' :
                    deposit.status === 'pending' ? 'bg-[rgba(243,186,47,0.1)] text-[#f3ba2f]' :
                    'bg-[rgba(255,91,110,0.1)] text-[#ff5b6e]'
                  }`}>
                    {deposit.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{formatDate(deposit.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const WithdrawalTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-[#1a1a28]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a28]">
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="withdrawals" />
              </td>
            </tr>
          ) : (
            withdrawals.map((withdrawal) => (
              <tr key={withdrawal._id}>
                <td className="px-6 py-4 text-sm font-medium text-[#e8e8f0] whitespace-nowrap">{formatAmount(withdrawal.amount)}</td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{withdrawal.method}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    withdrawal.status === 'completed' ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]' :
                    withdrawal.status === 'pending' ? 'bg-[rgba(243,186,47,0.1)] text-[#f3ba2f]' :
                    'bg-[rgba(255,91,110,0.1)] text-[#ff5b6e]'
                  }`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{formatDate(withdrawal.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const OtherTable = () => (
    <div className="overflow-x-auto sm:mx-0">
      <table className="min-w-full divide-y divide-[#1a1a28]">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#6b6b85] uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a28]">
          {others.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center">
                <EmptyState type="transactions" />
              </td>
            </tr>
          ) : (
            others.map((tx, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm font-medium text-[#e8e8f0] whitespace-nowrap">{formatAmount(tx.amount)}</td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{tx.type || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-[#9898b0]">{tx.description || tx.plan || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-[#9898b0] whitespace-nowrap">{formatDate(tx.date || tx.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const MobileCard = () => {
    let data = [];
    let typeLabel = '';
    if (activeTab === 'deposit') { data = deposits; typeLabel = 'deposits'; }
    else if (activeTab === 'withdrawal') { data = withdrawals; typeLabel = 'withdrawals'; }
    else { data = others; typeLabel = 'transactions'; }

    if (data.length === 0) {
      return (
        <div className="sm:hidden">
          <ul className="divide-y divide-[#1a1a28]">
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
          <div key={idx} className="bg-[#0c0c16] rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-[#6b6b85]">Amount</p>
                <p className="text-lg font-semibold text-[#e8e8f0]">{formatAmount(item.amount)}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'completed' ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]' :
                item.status === 'pending' ? 'bg-[rgba(243,186,47,0.1)] text-[#f3ba2f]' :
                'bg-[#1a1a28] text-[#9898b0]'
              }`}>
                {item.status || 'completed'}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-xs text-[#6b6b85]">{activeTab === 'deposit' ? 'Payment Mode' : activeTab === 'withdrawal' ? 'Method' : 'Type'}</p>
              <p className="text-sm text-[#9898b0]">
                {activeTab === 'deposit' ? (item.paymentMethod || 'N/A') : activeTab === 'withdrawal' ? (item.method || 'N/A') : (item.type || 'N/A')}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-xs text-[#6b6b85]">Date</p>
              <p className="text-sm text-[#9898b0]">{formatDate(item.createdAt || item.date)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Syne', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c896] mx-auto"></div>
          <p className="mt-4 text-[#6b6b85]">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Transaction Records</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#4a4a64]">
              <Wallet className="w-4 h-4" />
              <span>Balance: ${currentBalance.toFixed(2)}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Transaction Records</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">View all your financial activities in one place.</p>
        </div>
      </div>

      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="px-2 sm:px-6 border-b border-[#1a1a28]">
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
                      ? 'border-[#00c896] text-[#00c896]'
                      : 'border-transparent text-[#6b6b85] hover:text-[#9898b0]'
                  }`}
                  role="tab"
                >
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full mb-1 sm:mb-2 transition-colors ${
                    isActive ? 'bg-[rgba(0,200,150,0.1)]' : 'bg-[#0c0c16]'
                  }`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#00c896]' : 'text-[#6b6b85]'}`} />
                  </div>
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-0 sm:p-6">
          <div className={activeTab === 'deposit' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden"><DepositTable /></div>
          </div>
          <div className={activeTab === 'withdrawal' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden"><WithdrawalTable /></div>
          </div>
          <div className={activeTab === 'other' ? 'block' : 'hidden'}>
            <MobileCard />
            <div className="hidden sm:block overflow-hidden"><OtherTable /></div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default TransactionHistory;