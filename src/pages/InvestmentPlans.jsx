import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, CheckCircle, DollarSign, Shield, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [myInvestments, setMyInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/investment-plans`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPlans(data);
        } else {
          toast.error('Failed to load investment plans');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const fetchMyInvestments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/investments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMyInvestments(data);
      } else {
        toast.error('Failed to load your investments');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoadingInvestments(false);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const handleInvest = async (plan) => {
    const amount = parseFloat(investAmount);
    if (!amount || amount < plan.min || amount > plan.max) {
      toast.error(`Amount must be between $${plan.min} and $${plan.max}`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId: plan._id, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Invested $${amount} in ${plan.name} plan!`);
        setSelectedPlan(null);
        setInvestAmount('');
        fetchMyInvestments();
      } else {
        toast.error(data.message || 'Investment failed');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
              <span>Investment Plans</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Choose Your Plan
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Select an investment plan that suits your goals and start earning daily returns.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {plans.map((plan) => (
          <div key={plan._id} style={{
            background: '#0a0400',
            border: '1px solid rgba(249,115,22,0.12)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.12)'}>
            <div style={{
              background: `linear-gradient(135deg, ${plan.color || '#f97316'}, ${plan.color || '#f97316'}cc)`,
              padding: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{plan.name}</h3>
              <p style={{ color: '#fff', opacity: 0.9, fontSize: '13px' }}>{plan.daily}% Daily</p>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                textAlign: 'center'
              }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>Min / Max</p>
                  <p style={{ color: '#fff', fontWeight: 500 }}>${plan.min} – ${plan.max.toLocaleString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>Duration</p>
                  <p style={{ color: '#fff', fontWeight: 500 }}>{plan.duration} days</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>Bonus</p>
                  <p style={{ color: '#f97316', fontWeight: 700 }}>+{plan.bonus}%</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>Total Return</p>
                  <p style={{ color: '#f97316', fontWeight: 700 }}>{plan.totalReturn}%</p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(249,115,22,0.08)', paddingTop: '16px' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#8a7060' }}>
                      <CheckCircle size={14} style={{ color: '#f97316' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedPlan(plan)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '999px',
                  background: '#f97316',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
                onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* My Investments Section */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} style={{ color: '#f97316' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>My Investments</h2>
        </div>
        <div style={{ padding: '16px' }}>
          {loadingInvestments ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div style={{ width: '32px', height: '32px', border: '2px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : myInvestments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#8a7060' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <XCircle size={24} style={{ color: '#6a4a30' }} />
              </div>
              <p style={{ fontSize: '13px' }}>No active investments yet.</p>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>Choose a plan above to get started.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ fontSize: '11px', color: '#8a7060', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Plan</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Daily Return</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Duration</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>End Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myInvestments.map((inv) => (
                    <tr key={inv._id} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#fff' }}>{inv.planId?.name || 'Unknown Plan'}</td>
                      <td style={{ padding: '12px 16px', fontFamily: "'Space Mono', monospace", color: '#fff' }}>${inv.amount?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', color: '#8a7060' }}>{inv.dailyReturn}%</td>
                      <td style={{ padding: '12px 16px', color: '#8a7060' }}>{inv.duration} days</td>
                      <td style={{ padding: '12px 16px', color: '#8a7060' }}>{formatDate(inv.endDate)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 600,
                          background: inv.status === 'active' ? 'rgba(249,115,22,0.15)' : inv.status === 'completed' ? 'rgba(74,157,255,0.15)' : 'rgba(239,68,68,0.15)',
                          color: inv.status === 'active' ? '#f97316' : inv.status === 'completed' ? '#4a9dff' : '#ef4444'
                        }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13,6,0,0.9)',
          backdropFilter: 'blur(12px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#0a0400',
            border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '448px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Invest in {selectedPlan.name}</h3>
            <p style={{ color: '#8a7060', fontSize: '13px', marginBottom: '16px' }}>
              Min: ${selectedPlan.min} – Max: ${selectedPlan.max.toLocaleString()}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#8a7060' }}>Amount (USD)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '12px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    color: '#fff',
                    outline: 'none'
                  }}
                  placeholder={`Enter amount ($${selectedPlan.min} - $${selectedPlan.max.toLocaleString()})`}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => handleInvest(selectedPlan)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '999px',
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                >
                  Confirm Investment
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '999px',
                    background: 'rgba(249,115,22,0.08)',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlans;