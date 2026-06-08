import { useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, Wallet, ArrowDown, ArrowUp, Repeat, TrendingUp, 
  Folder, Shield, Gift, History, Activity, TrendingDown, Users, Lock, Bell, HelpCircle, Settings 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);

  // Click outside handler (only on mobile when open)
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-[10010] w-72 bg-[#0c0c16] border-r border-[#1a1a28] overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo – text version matching Home */}
      
<div className="p-6 border-b border-[#1a1a28]">
  <Link to="/" className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight no-underline">
    <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
    <span className="text-[#e8e8f0]">Wix</span>
    <span className="bg-gradient-to-r from-[#00c896] to-[#00a8ff] bg-clip-text text-transparent glow-text">
      Capital
    </span>
  </Link>
  <style>{`
    .glow-dot {
      box-shadow: 0 0 8px #00c896;
      animation: glowPulse 2s ease-in-out infinite;
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 8px #00c896; }
      50% { opacity: 0.5; box-shadow: 0 0 20px #00c896; }
    }
    .glow-text {
      text-shadow: 0 0 12px rgba(0,200,150,0.6), 0 0 24px rgba(0,168,255,0.4);
    }
  `}</style>
</div>
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[rgba(0,200,150,0.08)] text-[#00c896]'
                      : 'text-[#6b6b85] hover:bg-[#1a1a28] hover:text-[#e8e8f0]'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
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