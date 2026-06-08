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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
        <Inbox size={24} style={{ color: '#6a4a30' }} />
      </div>
      <p style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060', marginBottom: '4px' }}>No {type} found</p>
      <p style={{ fontSize: '11px', color: '#6a4a30' }}>Your {type} history will appear here</p>
    </div>
  );

  const DepositTable = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Payment Mode</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {deposits.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center' }}><EmptyState type="deposits" /></td></tr>
          ) : (
            deposits.map((deposit) => (
              <tr key={deposit._id} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{formatAmount(deposit.amount)}</td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{deposit.paymentMethod || 'N/A'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: deposit.status === 'completed' ? 'rgba(249,115,22,0.15)' : deposit.status === 'pending' ? 'rgba(243,186,47,0.15)' : 'rgba(239,68,68,0.15)',
                    color: deposit.status === 'completed' ? '#f97316' : deposit.status === 'pending' ? '#f3ba2f' : '#ef4444'
                  }}>
                    {deposit.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{formatDate(deposit.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const WithdrawalTable = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Method</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center' }}><EmptyState type="withdrawals" /></td></tr>
          ) : (
            withdrawals.map((withdrawal) => (
              <tr key={withdrawal._id} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{formatAmount(withdrawal.amount)}</td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{withdrawal.method}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: withdrawal.status === 'completed' ? 'rgba(249,115,22,0.15)' : withdrawal.status === 'pending' ? 'rgba(243,186,47,0.15)' : 'rgba(239,68,68,0.15)',
                    color: withdrawal.status === 'completed' ? '#f97316' : withdrawal.status === 'pending' ? '#f3ba2f' : '#ef4444'
                  }}>
                    {withdrawal.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{formatDate(withdrawal.createdAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const OtherTable = () => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Description</th>
            <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {others.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center' }}><EmptyState type="transactions" /></td></tr>
          ) : (
            others.map((tx, idx) => (
              <tr key={idx} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{formatAmount(tx.amount)}</td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{tx.type || 'N/A'}</td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{tx.description || tx.plan || 'N/A'}</td>
                <td style={{ padding: '12px 16px', color: '#8a7060' }}>{formatDate(tx.date || tx.createdAt)}</td>
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
        <div style={{ display: 'block', '@media (min-width: 640px)': { display: 'none' } }}>
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <EmptyState type={typeLabel} />
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }} className="sm:hidden">
        {data.map((item, idx) => (
          <div key={idx} style={{ background: 'rgba(249,115,22,0.03)', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '10px', color: '#8a7060' }}>Amount</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{formatAmount(item.amount)}</p>
              </div>
              <span style={{
                padding: '4px 8px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 600,
                background: item.status === 'completed' ? 'rgba(249,115,22,0.15)' : item.status === 'pending' ? 'rgba(243,186,47,0.15)' : 'rgba(239,68,68,0.15)',
                color: item.status === 'completed' ? '#f97316' : item.status === 'pending' ? '#f3ba2f' : '#ef4444'
              }}>
                {item.status || 'completed'}
              </span>
            </div>
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '10px', color: '#8a7060' }}>{activeTab === 'deposit' ? 'Payment Mode' : activeTab === 'withdrawal' ? 'Method' : 'Type'}</p>
              <p style={{ fontSize: '13px', color: '#a89070' }}>{activeTab === 'deposit' ? (item.paymentMethod || 'N/A') : activeTab === 'withdrawal' ? (item.method || 'N/A') : (item.type || 'N/A')}</p>
            </div>
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '10px', color: '#8a7060' }}>Date</p>
              <p style={{ fontSize: '12px', color: '#a89070' }}>{formatDate(item.createdAt || item.date)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0d0600',
        fontFamily: "'Syne', sans-serif"
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(249,115,22,0.2)',
          borderTopColor: '#f97316',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      overflowX: 'hidden',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: "'Syne', sans-serif",
      background: '#0d0600',
      minHeight: '100vh'
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px 32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', color: '#8a7060', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Transaction Records</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6a4a30' }}>
              <Wallet size={14} />
              <span>Balance: ${currentBalance.toFixed(2)}</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Transaction Records
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            View all your financial activities in one place.
          </p>
        </div>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '0 16px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '12px 0' }} role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderBottom: `2px solid ${isActive ? '#f97316' : 'transparent'}`,
                    color: isActive ? '#f97316' : '#8a7060',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px'
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '0' }}>
          <div style={{ display: activeTab === 'deposit' ? 'block' : 'none' }}>
            <MobileCard />
            <div style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} className="hidden sm:block">
              <DepositTable />
            </div>
          </div>
          <div style={{ display: activeTab === 'withdrawal' ? 'block' : 'none' }}>
            <MobileCard />
            <div style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} className="hidden sm:block">
              <WithdrawalTable />
            </div>
          </div>
          <div style={{ display: activeTab === 'other' ? 'block' : 'none' }}>
            <MobileCard />
            <div style={{ display: 'none', '@media (min-width: 640px)': { display: 'block' } }} className="hidden sm:block">
              <OtherTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;