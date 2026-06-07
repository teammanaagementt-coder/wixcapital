import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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
      {/* Overlay (only on mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-[10010] w-72 bg-dark-50 border-r border-gray-800 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <img src="/logo.png" alt="Logo" className="h-8 dark:brightness-0 dark:invert" />
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-400 hover:bg-dark-100 hover:text-white'
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