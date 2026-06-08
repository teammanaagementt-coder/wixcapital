import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Download, History, User, Zap, X, ArrowDown, TrendingUp, Upload, Headphones } from 'lucide-react';

const MobileNav = () => {
  const [fabOpen, setFabOpen] = useState(false);

  const actions = [
    { to: '/dashboard/deposit', icon: ArrowDown, label: 'Fund', color: '#f97316' },
    { to: '/dashboard/portfolio', icon: TrendingUp, label: 'Invest', color: '#fb923c' },
    { to: '/dashboard/withdraw', icon: Upload, label: 'Withdraw', color: '#ef4444' },
    { to: '/dashboard/referrals', icon: User, label: 'Refer', color: '#f3ba2f' },
    { to: '/dashboard/settings', icon: User, label: 'Profile', color: '#a855f7' },
    { to: '/dashboard/support', icon: Headphones, label: 'Support', color: '#f97316' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9990,
      fontFamily: "'Syne', sans-serif"
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{
        background: '#0a0400',
        borderTop: '1px solid rgba(249,115,22,0.15)',
        paddingTop: '2px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '64px',
          position: 'relative',
          padding: '0 8px'
        }}>
          <Link to="/dashboard/overview" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            textDecoration: 'none'
          }}>
            <Home size={20} style={{ color: '#8a7060' }} />
            <span style={{ fontSize: '10px', marginTop: '4px', color: '#8a7060' }}>Home</span>
          </Link>
          <Link to="/dashboard/deposit" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            textDecoration: 'none'
          }}>
            <Download size={20} style={{ color: '#f97316' }} />
            <span style={{ fontSize: '10px', marginTop: '4px', color: '#f97316', fontWeight: 500 }}>Deposit</span>
          </Link>

          {/* FAB */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            position: 'relative',
            padding: '0 8px',
            marginTop: '-32px'
          }}>
            <button
              onClick={() => setFabOpen(!fabOpen)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f97316',
                boxShadow: '0 4px 12px rgba(249,115,22,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {fabOpen ? <X size={24} style={{ color: '#0d0600' }} /> : <Zap size={24} style={{ color: '#0d0600' }} />}
            </button>
            <span style={{ fontSize: '10px', color: '#8a7060', position: 'absolute', bottom: '-16px' }}>Actions</span>
          </div>

          <Link to="/dashboard/transactions" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            textDecoration: 'none'
          }}>
            <History size={20} style={{ color: '#8a7060' }} />
            <span style={{ fontSize: '10px', marginTop: '4px', color: '#8a7060' }}>History</span>
          </Link>
          <Link to="/dashboard/settings" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            textDecoration: 'none'
          }}>
            <User size={20} style={{ color: '#8a7060' }} />
            <span style={{ fontSize: '10px', marginTop: '4px', color: '#8a7060' }}>Profile</span>
          </Link>
        </div>
      </div>

      {/* FAB Menu */}
      {fabOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13,6,0,0.9)',
          backdropFilter: 'blur(12px)',
          zIndex: 9991,
          animation: 'fadeIn 0.3s ease'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <div style={{
            position: 'absolute',
            insetX: 0,
            bottom: '96px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '16px',
              maxWidth: '400px',
              margin: '0 auto',
              padding: '12px'
            }}>
              {actions.map((action, idx) => (
                <Link
                  key={action.to}
                  to={action.to}
                  style={{
                    width: 'calc(33% - 12px)',
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${action.color}20, ${action.color}05)`,
                    border: `1px solid ${action.color}30`,
                    transition: 'all 0.3s',
                    textDecoration: 'none',
                    animation: `fadeInUp 0.3s ${idx * 0.05}s both`
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}30, ${action.color}10)`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}20, ${action.color}05)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${action.color}, ${action.color}cc)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <action.icon size={24} style={{ color: '#0d0600' }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#fff' }}>{action.label}</span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => setFabOpen(false)}
              style={{
                marginTop: '32px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#0a0400',
                border: '1px solid rgba(249,115,22,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={24} style={{ color: '#fff' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;