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
    <header className="flex h-16 items-center justify-between px-4 sm:px-6 border-b border-gray-800 bg-dark-50 shadow-md sticky top-0 z-[9999]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg hover:bg-dark-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-300" />
        </button>
        <div className="md:hidden">
          <img src="/logo.png" alt="Logo" className="h-8 dark:brightness-0 dark:invert" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className="p-1.5 rounded-lg bg-dark-100 hover:bg-dark-200 transition-colors"
        >
          {dark ? <Sun className="h-4 w-4 text-gray-300" /> : <Moon className="h-4 w-4 text-gray-300" />}
        </button>

        {/* KYC Button */}
        <div className="relative">
          <button className="flex items-center px-2 py-1 rounded-lg text-xs border border-gray-800 bg-dark-100 hover:bg-dark-200 text-gray-300">
            <Shield className="h-3.5 w-3.5 mr-1" />
            <span className="hidden sm:inline-block">KYC</span>
          </button>
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-dark-100 transition-colors"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-80" />
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 bg-primary rounded-full flex items-center justify-center text-sm font-medium border-2 border-gray-800">
                Lo
              </div>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-300">
              Lowincomehomes47@gmail.com
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-dark-50 border border-gray-800 rounded-lg shadow-lg z-[10000]">
              <div className="px-4 py-3 border-b border-gray-800">
                <h6 className="text-sm font-medium text-white">Low Income</h6>
                <p className="text-xs text-gray-400 mt-0.5">Lowincomehomes47@gmail.com</p>
              </div>
              <div className="py-2">
                <Link to="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-100">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link to="/dashboard/transactions" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-dark-100">
                  <Bell className="h-4 w-4" />
                  <span>Transaction History</span>
                </Link>
              </div>
              <div className="py-2 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-danger w-full text-left hover:bg-dark-100"
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