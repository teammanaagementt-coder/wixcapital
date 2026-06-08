import { Menu, Sun, Moon, Shield, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const TopBar = ({ onMenuClick }) => {
  const { dark, toggleDark } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  return (
    <header
      className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-[#1a1a28] bg-[#0c0c16] shadow-md sticky top-0 z-[9999]"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* Styles – includes glow animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');

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

      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-[#1a1a28] transition-colors"
        >
          <Menu className="h-5 w-5 text-[#9898b0]" />
        </button>

        {/* Glowing Logo (visible on all screens) */}
        <Link
          to="/dashboard/overview"
          className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight no-underline"
        >
          <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
          <span className="text-[#e8e8f0]">Wix</span>
          <span className="bg-gradient-to-r from-[#00c896] to-[#00a8ff] bg-clip-text text-transparent glow-text">
            Capital
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className="p-1.5 rounded-lg bg-[#1a1a28] hover:bg-[#2a2a3e] transition-colors"
        >
          {dark ? <Sun className="h-4 w-4 text-[#e8e8f0]" /> : <Moon className="h-4 w-4 text-[#e8e8f0]" />}
        </button>

        {/* KYC Button */}
        <div className="relative">
          <button className="flex items-center px-2 py-1 rounded-lg text-xs border border-[#1a1a28] bg-[#1a1a28] hover:bg-[#2a2a3e] text-[#9898b0]">
            <Shield className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline-block">KYC</span>
          </button>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#1a1a28] transition-colors"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00c896] to-[#4a9dff] rounded-full opacity-80" />
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 bg-[#00c896] rounded-full flex items-center justify-center text-sm font-medium border-2 border-[#1a1a28]">
                Lo
              </div>
            </div>
            <span className="hidden md:block text-sm font-medium text-[#e8e8f0]">
              Lowincomehomes47@gmail.com
            </span>
            <ChevronDown className="h-4 w-4 text-[#6b6b85] hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0c0c16] border border-[#1a1a28] rounded-lg shadow-lg z-[10000]">
              <div className="px-4 py-3 border-b border-[#1a1a28]">
                <h6 className="text-sm font-medium text-[#e8e8f0]">Low Income</h6>
                <p className="text-xs text-[#9898b0] mt-0.5">Lowincomehomes47@gmail.com</p>
              </div>
              <div className="py-2">
                <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-[#9898b0] hover:bg-[#1a1a28] hover:text-[#e8e8f0] transition-colors">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link to="/dashboard/transactions" className="flex items-center gap-2 px-4 py-2 text-sm text-[#9898b0] hover:bg-[#1a1a28] hover:text-[#e8e8f0] transition-colors">
                  <Bell className="h-4 w-4" />
                  <span>Transaction History</span>
                </Link>
              </div>
              <div className="py-2 border-t border-[#1a1a28]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#ff5b6e] w-full text-left hover:bg-[#1a1a28] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;