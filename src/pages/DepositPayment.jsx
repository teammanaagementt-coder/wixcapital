import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Copy, CheckCircle, Upload, AlertCircle, ArrowLeft, Calendar, Shield, Clock, History, CircleCheckBig } from 'lucide-react';
import toast from 'react-hot-toast';

const DepositPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { method, amount } = location.state || {};
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!method || !amount) {
      toast.error('Invalid payment request');
      navigate('/dashboard/deposit');
    }
  }, [method, amount, navigate]);

  const walletInfo = method?.depositDetails || { address: 'Contact support', network: 'N/A' };
  const methodName = method?.name || 'Unknown';
  const methodIcon = method?.icon || '/images/usdt.png';

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF');
      return;
    }
    setProofFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('payment_method', method._id);
      formData.append('proof', proofFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/deposits/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Deposit request submitted!');
        navigate('/dashboard/transactions');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#8a7060', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Confirm Payment</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard/deposit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(249,115,22,0.05)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#8a7060',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '13px'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#f97316'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8a7060'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'; }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Complete Payment
        </h1>
        <p style={{ color: '#8a7060', fontSize: '14px' }}>
          Send exactly <span style={{ fontWeight: 700, color: '#fff' }}>${amount}</span> using {methodName}
        </p>
      </div>

      {/* Payment Details Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          {/* Payment Method Header */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(249,115,22,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {methodIcon && <img src={methodIcon} style={{ width: '24px', height: '24px', objectFit: 'contain' }} alt="" />}
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8a7060' }}>Selected payment method</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{methodName}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px', textAlign: 'center', padding: '16px', borderRadius: '16px', background: 'rgba(249,115,22,0.03)', border: '1px solid rgba(249,115,22,0.08)' }}>
                <p style={{ color: '#8a7060' }}>
                  You are to make a payment of <span style={{ fontWeight: 800, color: '#fff' }}>${amount}</span> using {methodName}.
                </p>
              </div>
              <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(30,12,0,0.6)', border: '1px solid rgba(249,115,22,0.2)', display: 'inline-block' }}>
                  <img src={methodIcon} alt={methodName} style={{ height: '64px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{methodName} Address:</h3>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    readOnly
                    value={walletInfo.address}
                    style={{
                      width: '100%',
                      padding: '12px 48px 12px 16px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '13px'
                    }}
                  />
                  <button
                    onClick={() => copyToClipboard(walletInfo.address)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(249,115,22,0.1)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.1)'}
                  >
                    {copied ? <CheckCircle size={14} style={{ color: '#f97316' }} /> : <Copy size={14} style={{ color: '#f97316' }} />}
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: '#8a7060' }}>
                  <span style={{ fontWeight: 700 }}>Network:</span> {walletInfo.network}
                </p>
                {walletInfo.additionalInfo && (
                  <p style={{ fontSize: '11px', color: '#f97316', marginTop: '4px' }}>
                    {walletInfo.additionalInfo}
                  </p>
                )}
              </div>
            </div>

            {/* File Upload Section - IMPROVED VISIBILITY */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(249,115,22,0.08)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, color: '#8a7060' }}>Upload payment proof after sending</label>
                  
                  {/* Custom styled file input container */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <label
                      htmlFor="proof-upload"
                      style={{
                        background: 'rgba(249,115,22,0.1)',
                        border: '1px solid rgba(249,115,22,0.4)',
                        borderRadius: '999px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#f97316',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(249,115,22,0.2)';
                        e.currentTarget.style.borderColor = '#f97316';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(249,115,22,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)';
                      }}
                    >
                      <Upload size={14} />
                      Choose File
                    </label>
                    <input
                      id="proof-upload"
                      type="file"
                      name="proof"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,application/pdf"
                      style={{ display: 'none' }}
                      required
                    />
                    {proofFile ? (
                      <span style={{ fontSize: '12px', color: '#a89070', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '999px' }}>
                        {proofFile.name}
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#6a4a30' }}>No file chosen</span>
                    )}
                  </div>
                  <p style={{ fontSize: '10px', color: '#6a4a30', marginTop: '4px' }}>
                    Accepted formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
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
                      opacity: submitting ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#fb923c'; }}
                    onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#f97316'; }}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Submit Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards (same as before) */}
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
                <span>View Deposit History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DepositPayment;