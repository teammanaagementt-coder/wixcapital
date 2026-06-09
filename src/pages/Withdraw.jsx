import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, CircleCheckBig, ClockArrowDown, History, 
  Calendar, ArrowUp, Shield, CheckCircle, Clock, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

const Withdraw = () => {
  const navigate = useNavigate();
  const [withdrawalMethods, setWithdrawalMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payment-methods?type=withdrawal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setWithdrawalMethods(data);
      } catch (err) {
        toast.error('Could not load withdrawal methods');
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  const handleWithdraw = (method) => {
    navigate('/dashboard/withdraw-funds', { state: { method } });
  };

  if (loading) {
    return <div style={{ color: '#fff', padding: '24px' }}>Loading withdrawal methods...</div>;
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

      {/* Header */}
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
              <span>Withdraw Funds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6a4a30' }}>
              <Wallet size={14} />
              <span>Balance: $0.00</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Place Withdrawal
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Withdraw funds to your external wallet or bank account.
          </p>
        </div>
      </div>

      {/* Withdrawal Methods Table */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Select Withdrawal Method</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(249,115,22,0.03)', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: 500 }}>Method</th>
                <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalMethods.map((method) => (
                <tr key={method._id} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(249,115,22,0.08)',
                        borderRadius: '8px',
                        padding: '6px',
                        marginRight: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img src={method.icon} alt={method.name} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                      </div>
                      <p style={{ fontWeight: 500, color: '#fff' }}>{method.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleWithdraw(method)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: '999px',
                        background: '#f97316',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards (unchanged) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {/* Withdrawal Process */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center' }}>
            <CheckCircle size={20} style={{ color: '#f97316', marginRight: '8px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Withdrawal Process</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <ol style={{ position: 'relative', borderLeft: '1px solid rgba(249,115,22,0.2)', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {['Select Method', 'Enter Details', 'Confirmation', 'Processing'].map((step, idx) => (
                <li key={step} style={{ marginLeft: '24px', position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '-30px',
                    top: '0',
                    width: '24px',
                    height: '24px',
                    background: '#0a0400',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#f97316'
                  }}>
                    {idx + 1}
                  </span>
                  <h3 style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{step}</h3>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>
                    {idx === 0 && 'Choose your preferred withdrawal method.'}
                    {idx === 1 && 'Provide your withdrawal amount and destination details.'}
                    {idx === 2 && 'Review and confirm your withdrawal request.'}
                    {idx === 3 && "Your request will be processed according to the method's timeframe."}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Security Tips */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center' }}>
            <Shield size={20} style={{ color: '#f97316', marginRight: '8px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Security Tips</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Always verify withdrawal addresses before confirming.',
                'For crypto, confirm network type to avoid loss.',
                'Never share your account credentials.',
                'Be cautious of phishing attempts.',
              ].map((tip, i) => (
                <li key={i} style={{ display: 'flex' }}>
                  <div style={{ flexShrink: 0, width: '20px', height: '20px', background: 'rgba(249,115,22,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', marginTop: '2px' }}>
                    <CheckCircle size={12} style={{ color: '#f97316' }} />
                  </div>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>{tip}</p>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(249,115,22,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(30,12,0,0.6)', border: '1px solid rgba(249,115,22,0.1)' }}>
                <Info size={20} style={{ color: '#f97316', marginRight: '12px', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: '#f97316' }}>Need help? Contact support via the help center.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Summary */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Withdrawal Summary</h3>
            <div style={{ background: 'rgba(249,115,22,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#8a7060' }}>Total Withdrawals</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>$0.00</p>
                </div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircleCheckBig size={24} style={{ color: '#f97316' }} />
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(249,115,22,0.03)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#8a7060' }}>Pending Withdrawals</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>$0.00</p>
                </div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClockArrowDown size={24} style={{ color: '#f97316' }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <button
                onClick={() => navigate('/dashboard/transactions')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  background: 'rgba(249,115,22,0.05)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#8a7060',
                  fontSize: '13px',
                  transition: 'background 0.2s',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}
              >
                <History size={14} style={{ marginRight: '8px' }} />
                <span>View Withdrawal History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;