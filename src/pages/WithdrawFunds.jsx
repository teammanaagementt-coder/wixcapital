import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, Clock, Info, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const getDetailsConfig = (methodName) => {
  const method = methodName?.toLowerCase() || '';
  if (method.includes('zelle')) {
    return {
      label: 'Zelle Details',
      placeholder: 'Enter your Zelle email or phone number',
      example: 'Example: your@email.com or (123) 456-7890',
    };
  }
  if (method.includes('bank transfer')) {
    return {
      label: 'Bank Transfer Details',
      placeholder: 'Bank Name, Account Number, Account Name, Swift Code',
      example: 'Example: Chase, 123456789, John Doe, CHASUS33',
    };
  }
  if (method.includes('usdt') || method.includes('erc20') || method.includes('trc20')) {
    return {
      label: 'Wallet Address (USDT)',
      placeholder: 'Enter your USDT wallet address',
      example: 'Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0b...',
    };
  }
  if (method.includes('ethereum')) {
    return {
      label: 'Ethereum Wallet Address',
      placeholder: 'Enter your Ethereum address (0x...)',
      example: 'Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0b...',
    };
  }
  if (method.includes('bitcoin')) {
    return {
      label: 'Bitcoin Wallet Address',
      placeholder: 'Enter your Bitcoin address',
      example: 'Example: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    };
  }
  return {
    label: 'Withdrawal Details',
    placeholder: 'Enter your payment details',
    example: 'Provide the necessary information to receive your funds',
  };
};

const WithdrawFunds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { method: selectedMethod } = location.state || {};
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [wcCode, setWcCode] = useState('');
  const [fee, setFee] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const feePercentage = 10;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setBalance(data.user.balance);
        }
      } catch (err) {
        toast.error('Could not load balance');
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const calculatedFee = (amt * feePercentage) / 100;
    setFee(calculatedFee);
    setTotalCost(amt + calculatedFee);
  }, [amount]);

  const isExceedingBalance = totalCost > balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (isExceedingBalance) {
      toast.error('Insufficient balance to cover amount + fee');
      return;
    }
    if (!details.trim()) {
      toast.error('Please provide your withdrawal details');
      return;
    }
    if (!wcCode.trim()) {
      toast.error('WC code is required');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod.name,
          details: details,
          wcCode: wcCode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Withdrawal request submitted successfully!');
        navigate('/dashboard/withdraw');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const method = selectedMethod || { name: 'USDT (ERC20)', icon: '/images/usdt.png' };
  const { label, placeholder, example } = getDetailsConfig(method.name);

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
              <span>Withdrawal Details</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6a4a30' }}>
              <Wallet size={14} />
              <span>Balance: {loadingBalance ? '...' : `$${balance.toFixed(2)}`}</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Withdrawal Details
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', fontSize: '14px' }}>
            Complete your withdrawal request
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {/* Method Header */}
          <div style={{ borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
            <div style={{ padding: '16px 24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                background: 'rgba(249,115,22,0.05)',
                borderRadius: '999px',
                border: '1px solid rgba(249,115,22,0.2)'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#0a0400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px'
                }}>
                  {method.icon ? (
                    <img src={method.icon} alt={method.name} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                  ) : (
                    <ArrowUpRight size={14} style={{ color: '#f97316' }} />
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{method.name}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Amount */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="amount" style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060' }}>Amount to withdraw</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <span style={{ color: '#6a4a30' }}>$</span>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      fontSize: '18px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    placeholder="0.00"
                    required
                    onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
                  />
                </div>
                {amount && (
                  <div style={{ fontSize: '11px', color: '#8a7060', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fee ({feePercentage}%):</span>
                      <span>${fee.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500 }}>
                      <span>Total cost:</span>
                      <span style={{ color: isExceedingBalance ? '#ff5b6e' : '#f97316' }}>${totalCost.toFixed(2)}</span>
                    </div>
                    {isExceedingBalance && <p style={{ color: '#ff5b6e', fontSize: '10px', marginTop: '4px' }}>Amount + fee exceeds your available balance</p>}
                  </div>
                )}
              </div>

              {/* Dynamic Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060' }}>{label}</label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '14px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    color: '#fff',
                    transition: 'all 0.2s',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder={placeholder}
                  required
                  onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
                />
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(30,12,0,0.6)', border: '1px solid rgba(249,115,22,0.1)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Info size={20} style={{ color: '#f97316', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>
                        Please enter your necessary details required to receive your payment:
                      </p>
                      <p style={{ fontSize: '11px', fontWeight: 500, color: '#fff', marginTop: '4px' }}>{example}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WC Code */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060' }}>WC Code</label>
                <input
                  type="text"
                  value={wcCode}
                  onChange={(e) => setWcCode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    color: '#fff',
                    fontFamily: "'Space Mono', monospace",
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  placeholder="Enter your withdrawal confirmation code"
                  required
                  onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
                />
                <p style={{ fontSize: '10px', color: '#6a4a30', marginTop: '4px' }}>
                  Please input your withdrawal confirmation code or contact support to purchase a code.
                </p>
              </div>

              {/* Processing time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(30,12,0,0.6)',
                border: '1px solid rgba(249,115,22,0.1)',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#0a0400',
                  border: '1px solid rgba(249,115,22,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Clock size={20} style={{ color: '#f97316' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Estimated processing time</h3>
                  <p style={{ fontSize: '11px', color: '#8a7060' }}>Your withdrawal will be processed within 15–30 minutes.</p>
                </div>
              </div>

              {/* Submit */}
              <div style={{ paddingTop: '8px' }}>
                <button
                  type="submit"
                  disabled={submitting || isExceedingBalance || !amount}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '999px',
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    opacity: (submitting || isExceedingBalance || !amount) ? 0.5 : 1,
                    pointerEvents: (submitting || isExceedingBalance || !amount) ? 'none' : 'auto'
                  }}
                  onMouseEnter={e => { if (!(submitting || isExceedingBalance || !amount)) e.currentTarget.style.background = '#fb923c'; }}
                  onMouseLeave={e => { if (!(submitting || isExceedingBalance || !amount)) e.currentTarget.style.background = '#f97316'; }}
                >
                  <ArrowUpRight size={16} />
                  <span>{submitting ? 'Submitting...' : 'Complete Withdrawal Request'}</span>
                </button>
                <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: '#6a4a30' }}>
                  By proceeding, you confirm that the provided information is correct
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;