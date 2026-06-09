import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Wallet, Shield, Clock, CheckCircle, CircleCheckBig, History, 
  Calendar, ArrowUpRight, DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Deposit = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [selectedMethodObj, setSelectedMethodObj] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(true);

  const navigate = useNavigate();

  // Fetch balance (unchanged)
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserBalance(data.user.balance);
        } else {
          toast.error('Could not load balance');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  // Fetch payment methods from API (replaces hardcoded array)
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/payment-methods?type=deposit`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setPaymentMethods(data);
      } catch (err) {
        toast.error('Could not load payment methods');
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchMethods();
  }, []);

  const selectMethod = (method) => {
    setSelectedMethodId(method._id);
    setSelectedMethodObj(method);
    toast.success(`You have chosen to pay with ${method.name}`);
  };

  const resetMethod = () => {
    setSelectedMethodId(null);
    setSelectedMethodObj(null);
  };

  const onSubmit = async (data) => {
    if (!selectedMethodObj) {
      toast.error('Please choose a payment method');
      return;
    }
    navigate('/dashboard/deposit-payment', {
      state: {
        method: selectedMethodObj,   // full object, not just ID
        amount: data.amount,
      }
    });
  };

  if (loadingMethods) {
    return <div style={{ color: '#fff', padding: '24px' }}>Loading payment methods...</div>;
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

      {/* Header – unchanged */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px 32px'
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
            color: '#8a7060',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Deposit Funds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6a4a30' }}>
              <Wallet size={14} />
              <span>Balance: {loadingBalance ? '...' : `$${userBalance.toFixed(2)}`}</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Fund Your Account
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Add funds to start investing or trading. Choose your preferred method below.
          </p>
        </div>
      </div>

      {/* Deposit Form */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <DollarSign size={20} style={{ color: '#f97316', marginRight: '8px' }} />
            Deposit Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Amount – unchanged */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="amount" style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060' }}>Amount to deposit</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <span style={{ color: '#6a4a30' }}>$</span>
              </div>
              <input
                id="amount"
                type="number"
                step="any"
                min="50"
                {...register('amount', { required: 'Amount is required', min: 50 })}
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
                onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
              />
            </div>
            {errors.amount && <p style={{ color: '#ff5b6e', fontSize: '12px', marginTop: '4px' }}>{errors.amount.message}</p>}
          </div>

          {/* Payment Methods Table – now using dynamic methods */}
          <div style={{
            background: '#0a0400',
            border: '1px solid rgba(249,115,22,0.09)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Select Deposit Method</h2>
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
                  {paymentMethods.map(method => (
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
                          type="button"
                          onClick={() => selectMethod(method)}
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
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected method preview – unchanged */}
          {selectedMethodObj && (
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(30,12,0,0.6)',
              border: '1px solid rgba(249,115,22,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#0a0400',
                  borderRadius: '10px',
                  padding: '8px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedMethodObj.icon && <img src={selectedMethodObj.icon} alt="" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />}
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#8a7060' }}>Selected Method</p>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff' }}>{selectedMethodObj.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetMethod}
                style={{ fontSize: '12px', color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Change
              </button>
            </div>
          )}

          {/* Submit button */}
          <div style={{ paddingTop: '8px' }}>
            <button
              type="submit"
              disabled={!selectedMethodObj}
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
                opacity: !selectedMethodObj ? 0.5 : 1,
                pointerEvents: !selectedMethodObj ? 'none' : 'auto'
              }}
              onMouseEnter={e => { if (!selectedMethodObj) return; e.currentTarget.style.background = '#fb923c'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { if (!selectedMethodObj) return; e.currentTarget.style.background = '#f97316'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <span>Proceed to Payment</span>
              <ArrowUpRight size={16} />
            </button>
            <p style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: '#6a4a30' }}>
              By proceeding, you agree to our terms of service
            </p>
          </div>
        </form>
      </div>

      {/* ========== INFO CARDS – FULLY PRESERVED ========== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px'
      }}>
        {/* Deposit Process */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center' }}>
            <CheckCircle size={20} style={{ color: '#f97316', marginRight: '8px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Deposit Process</h3>
          </div>
          <div style={{ padding: '20px' }}>
            <ol style={{ position: 'relative', borderLeft: '1px solid rgba(249,115,22,0.2)', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {['Select Method', 'Enter Amount', 'Complete Payment', 'Confirmation'].map((step, idx) => (
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
                    {idx === 0 && 'Choose your preferred deposit method.'}
                    {idx === 1 && 'Specify the amount you wish to deposit.'}
                    {idx === 2 && 'Follow instructions to complete your deposit.'}
                    {idx === 3 && 'Your deposit will be confirmed and credited.'}
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
                'Always verify payment details before confirming.',
                'Use secure and private internet connections.',
                'Double-check network type for crypto deposits.',
                'Never share your payment credentials.',
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
                <Clock size={20} style={{ color: '#f97316', marginRight: '12px', flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: '#f97316' }}>Need help? Contact support via the help center.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Stats */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Deposit Summary</h3>
            <div style={{ background: 'rgba(249,115,22,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#8a7060' }}>Total Deposited</p>
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
                  <p style={{ fontSize: '12px', color: '#8a7060' }}>Pending Deposits</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>$0.00</p>
                </div>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <History size={24} style={{ color: '#f97316' }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <Link to="/dashboard/transactions" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                background: 'rgba(249,115,22,0.05)',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#8a7060',
                fontSize: '13px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}>
                <History size={14} style={{ marginRight: '8px' }} />
                <span>View Deposit History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;