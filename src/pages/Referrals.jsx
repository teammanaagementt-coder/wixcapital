import { useState, useEffect } from 'react';
import { Calendar, Users, Gift, Copy, CheckCircle, UserPlus, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Referrals = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setReferralData({
            referralCode: data.user.referralCode,
            totalReferrals: data.user.totalReferrals,
            referralEarnings: data.user.referralEarnings,
            referrals: data.referrals || [],
          });
        } else {
          toast.error('Could not load referral data');
        }
      } catch (err) {
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${referralData?.referralCode || ''}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

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
              <span>Referral Program</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Invite Friends & Earn
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Share your referral link and earn 5% commission on every friend’s investment.
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
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UserPlus size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Total Referrals</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>{loading ? '...' : referralData?.totalReferrals || 0}</p>
            </div>
          </div>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Referral Earnings</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>${loading ? '...' : (referralData?.referralEarnings || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(249,115,22,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Gift size={24} style={{ color: '#f97316' }} />
            </div>
            <div>
              <p style={{ fontSize: '10px', color: '#8a7060', textTransform: 'uppercase' }}>Commission Rate</p>
              <p style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>5%</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Your Referral Link</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              readOnly
              value={referralLink}
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                fontSize: '13px'
              }}
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
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
                cursor: 'pointer'
              }}
            >
              {copied ? <CheckCircle size={14} style={{ color: '#f97316' }} /> : <Copy size={14} style={{ color: '#f97316' }} />}
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              readOnly
              value={referralData?.referralCode || ''}
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                fontSize: '13px'
              }}
            />
            <button
              onClick={() => copyToClipboard(referralData?.referralCode || '')}
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
                cursor: 'pointer'
              }}
            >
              {copied ? <CheckCircle size={14} style={{ color: '#f97316' }} /> : <Copy size={14} style={{ color: '#f97316' }} />}
            </button>
          </div>
        </div>
        <p style={{ marginTop: '12px', fontSize: '11px', color: '#8a7060' }}>Share this link or code with friends.</p>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} style={{ color: '#f97316' }} />
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Referred Users</h2>
        </div>
        <div style={{ padding: '16px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div style={{ width: '32px', height: '32px', border: '2px solid rgba(249,115,22,0.2)', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (referralData?.referrals || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#8a7060' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '50%', background: 'rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} style={{ color: '#6a4a30' }} />
              </div>
              <p style={{ fontSize: '13px' }}>No referrals yet.</p>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>Share your link to start earning.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>User</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Joined</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referrals.map((ref, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                      <td style={{ padding: '12px 16px', color: '#a89070' }}>{ref.name || 'Unknown'}</td>
                      <td style={{ padding: '12px 16px', color: '#a89070' }}>{formatDate(ref.createdAt)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                          {ref.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#fff', fontFamily: "'Space Mono', monospace" }}>${(ref.earnings || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referrals;