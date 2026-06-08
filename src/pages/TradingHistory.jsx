import { useState, useEffect } from 'react';
import { Calendar, Wallet, TrendingUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const TradingHistory = () => {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState({ totalReturns: 0, lastReturn: 0, totalTransactions: 0 });

  useEffect(() => {
    const fetchTradingHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) { toast.error('Please login again'); return; }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/trading-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setTrades(data.trades || []);
          setStats({
            totalReturns: data.totalReturns || 0,
            lastReturn: data.lastReturn || 0,
            totalTransactions: data.totalTransactions || 0,
          });
        }
      } catch (err) {
        toast.error('Failed to load trading history');
      } finally {
        setLoading(false);
      }
    };
    fetchTradingHistory();
  }, []);

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
  const formatAmount = (amount) => `$${parseFloat(amount).toFixed(2)}`;

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
              <span>ROI History</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6a4a30' }}>
              <Activity size={14} />
              <span>{stats.totalTransactions} trades</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Your ROI History
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Track all your returns on investment from trading and staking.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <TrendingUp size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Total Returns</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{formatAmount(stats.totalReturns)}</p>
            </div>
          </div>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <TrendingUp size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Last Return</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{formatAmount(stats.lastReturn)}</p>
              <p style={{ fontSize: '10px', color: '#6a4a30', marginTop: '4px' }}>{stats.lastReturn > 0 ? 'Most recent ROI' : 'No returns yet'}</p>
            </div>
          </div>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <Activity size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Total Transactions</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{stats.totalTransactions}</p>
              <p style={{ fontSize: '10px', color: '#6a4a30', marginTop: '4px' }}>ROI payments received</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <TrendingUp size={20} style={{ color: '#f97316', marginRight: '8px' }} />
            Return on Investment History
          </h2>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(249,115,22,0.03)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>Investment Plan</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>Amount</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '48px', textAlign: 'center', color: '#8a7060' }}>
                      <Activity size={40} style={{ color: '#6a4a30', margin: '0 auto 12px' }} />
                      <p>No ROI history found</p>
                    </td>
                  </tr>
                ) : (
                  trades.map((trade, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#a89070' }}>{trade.plan || 'N/A'}</td>
                      <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{formatAmount(trade.amount)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 600,
                          background: trade.type === 'profit' ? 'rgba(249,115,22,0.15)' : trade.type === 'bonus' ? 'rgba(243,186,47,0.15)' : 'rgba(74,157,255,0.15)',
                          color: trade.type === 'profit' ? '#f97316' : trade.type === 'bonus' ? '#f3ba2f' : '#4a9dff'
                        }}>
                          {trade.type || 'ROI'}
                        </span>
                       </td>
                      <td style={{ padding: '12px 16px', color: '#8a7060' }}>{formatDate(trade.date || trade.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingHistory;