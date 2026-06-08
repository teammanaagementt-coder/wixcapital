import { useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, Wallet, ArrowDown, ArrowUp, Repeat, TrendingUp, 
  Folder, Shield, Gift, History, Activity, TrendingDown, Users, Lock, Bell, HelpCircle, Settings 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const navItems = [
    { to: '/dashboard/overview', icon: Home, label: 'Overview' },
    { to: '/dashboard/deposit', icon: ArrowDown, label: 'Deposit' },
    { to: '/dashboard/withdraw', icon: ArrowUp, label: 'Withdraw' },
    { to: '/dashboard/markets', icon: TrendingUp, label: 'Markets' },
    { to: '/dashboard/trade', icon: Folder, label: 'Trade' },
    { to: '/dashboard/investment-plans', icon: Gift, label: 'Investment Plans' },
    { to: '/dashboard/futures', icon: TrendingDown, label: 'Futures' },
    { to: '/dashboard/transactions', icon: History, label: 'Transactions' },
    { to: '/dashboard/trading-history', icon: Activity, label: 'Trading History' },
    { to: '/dashboard/referrals', icon: Users, label: 'Referrals' },
    { to: '/dashboard/support', icon: HelpCircle, label: 'Support' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
      {/* Overlay (only on mobile) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(13,6,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000
          }}
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 10010,
          width: '288px',
          background: '#0a0400',
          borderRight: '1px solid rgba(249,115,22,0.12)',
          overflowY: 'auto',
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          fontFamily: "'Syne', sans-serif"
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  marginBottom: '4px',
                  background: isActive ? 'rgba(249,115,22,0.08)' : 'transparent',
                  color: isActive ? '#f97316' : '#8a7060'
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.style.background.includes('rgba(249,115,22,0.08)')) {
                    e.currentTarget.style.background = 'rgba(249,115,22,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.classList?.contains('active')) {
                    const isActive = e.currentTarget.style.background === 'rgba(249,115,22,0.08)';
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#8a7060';
                    }
                  }
                }}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;