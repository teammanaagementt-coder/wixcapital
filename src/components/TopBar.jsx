import { Menu, Sun, Moon, Shield, Bell, User, ChevronDown, LogOut, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
  const { dark, toggleDark } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Ticker data & live updates (mirroring Home.jsx)
  const initialCoins = [
    { sym: 'BTC', price: 67420, chg: 2.34, color: '#f7931a' },
    { sym: 'ETH', price: 3842, chg: -1.12, color: '#627eea' },
    { sym: 'SOL', price: 178.4, chg: 5.67, color: '#9945ff' },
    { sym: 'BNB', price: 612.3, chg: 0.89, color: '#f3ba2f' },
    { sym: 'ADA', price: 0.614, chg: -2.45, color: '#4a9dff' },
    { sym: 'AVAX', price: 42.18, chg: 3.21, color: '#e84142' },
  ];

  const [coins, setCoins] = useState(initialCoins);

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins(prev =>
        prev.map(c => ({
          ...c,
          price: parseFloat(
            (c.price * (1 + (Math.random() - 0.499) * 0.001)).toFixed(
              c.price > 100 ? 2 : 4
            )
          ),
        }))
      );
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
        @keyframes tickerRoll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: tickerRoll 50s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Live Crypto Ticker */}
      <div style={{
        background: '#080300',
        borderBottom: '1px solid rgba(249,115,22,0.1)',
        overflow: 'hidden',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        zIndex: 50
      }}>
        <div className="animate-ticker" style={{ whiteSpace: 'nowrap' }}>
          {[...coins, ...coins, ...coins].map((c, i) => (
            <div
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 24px',
                borderRight: '1px solid rgba(249,115,22,0.08)'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'Space Mono', monospace", color: '#a89070' }}>
                {c.sym}
              </span>
              <span style={{ fontSize: '10px', fontFamily: "'Space Mono', monospace", color: '#fff' }}>
                ${c.price.toLocaleString()}
              </span>
              <span style={{
                fontSize: '10px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                color: c.chg >= 0 ? '#22c55e' : '#ef4444'
              }}>
                {c.chg >= 0 ? <ArrowUp size={12} style={{ display: 'inline' }} /> : <ArrowDown size={12} style={{ display: 'inline' }} />}
                {' '}{Math.abs(c.chg)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main TopBar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 6px',
        borderBottom: '1px solid rgba(249,115,22,0.08)',
        background: '#0d0600',
        fontFamily: "'Syne', sans-serif"
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onMenuClick}
            style={{
              display: 'block',
              padding: '6px',
              borderRadius: '10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Menu size={20} style={{ color: '#a89070' }} />
          </button>

          <Link to="/dashboard/overview" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', position: 'relative' }}>
              <svg viewBox="0 0 40 40" width="28" height="28">
                <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#f97316" strokeWidth="2.5"/>
                <polygon points="20,14 26,18 26,22 20,26 14,22 14,18" fill="#f97316"/>
              </svg>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800 }}>
              <span style={{ color: '#fff' }}>AWix</span><span style={{ color: '#f97316' }}>Capital</span>
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleDark}
            style={{
              padding: '6px',
              borderRadius: '10px',
              background: 'rgba(249,115,22,0.08)',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
          >
            {dark ? <Sun size={16} style={{ color: '#fff' }} /> : <Moon size={16} style={{ color: '#fff' }} />}
          </button>

          {/* KYC Button */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.2)',
            color: '#f97316',
            cursor: 'pointer'
          }}>
            <Shield size={14} />
            <span style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline' } }}>KYC</span>
          </button>

          {/* User dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px',
                borderRadius: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#f97316', borderRadius: '50%', opacity: 0.8 }} />
                <div style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  background: '#f97316',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#0d0600',
                  border: '2px solid #0d0600'
                }}>
                  Lo
                </div>
              </div>
              <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' }, fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                Lowincomehomes47@gmail.com
              </span>
              <ChevronDown size={16} style={{ color: '#8a7060', display: 'none', '@media (min-width: 768px)': { display: 'block' } }} />
            </button>

            {userMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                marginTop: '8px',
                width: '224px',
                background: '#0a0400',
                border: '1px solid rgba(249,115,22,0.15)',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                zIndex: 10000
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
                  <h6 style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Low Income</h6>
                  <p style={{ fontSize: '11px', color: '#8a7060', marginTop: '2px' }}>Lowincomehomes47@gmail.com</p>
                </div>
                <div style={{ padding: '8px 0' }}>
                  <Link to="/dashboard/settings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#8a7060',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a7060'; }}>
                    <User size={14} />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/dashboard/transactions" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: '#8a7060',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a7060'; }}>
                    <Bell size={14} />
                    <span>Transaction History</span>
                  </Link>
                </div>
                <div style={{ padding: '8px 0', borderTop: '1px solid rgba(249,115,22,0.08)' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      color: '#ff5b6e',
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default TopBar;