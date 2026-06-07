import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Download, History, User, Zap, X, ArrowDown, TrendingUp, Upload, Headphones } from 'lucide-react';

const MobileNav = () => {
  const [fabOpen, setFabOpen] = useState(false);

  const actions = [
    { to: '/dashboard/deposit', icon: ArrowDown, label: 'Fund', color: 'tertiary' },
    { to: '/dashboard/portfolio', icon: TrendingUp, label: 'Invest', color: 'secondary' },
    { to: '/dashboard/withdraw', icon: Upload, label: 'Withdraw', color: 'danger' },
    { to: '/dashboard/referrals', icon: User, label: 'Refer', color: 'accent' },
    { to: '/dashboard/settings', icon: User, label: 'Profile', color: 'purple' },
    { to: '/dashboard/support', icon: Headphones, label: 'Support', color: 'primary' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden">
      <div className="bg-dark-50 border-t border-gray-800 pt-0.5">
        <div className="flex items-center justify-around h-16 relative px-2">
          <Link to="/dashboard/overview" className="flex flex-col items-center justify-center h-full w-full">
            <Home className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1 text-gray-400">Home</span>
          </Link>
          <Link to="/dashboard/deposit" className="flex flex-col items-center justify-center h-full w-full">
            <Download className="h-5 w-5 text-primary" />
            <span className="text-xs mt-1 text-primary font-medium">Deposit</span>
          </Link>

          {/* FAB */}
          <div className="flex flex-col items-center h-full relative px-2 -mt-8">
            <button
              onClick={() => setFabOpen(!fabOpen)}
              className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center bg-primary transform hover:scale-105 transition-all duration-300"
            >
              {fabOpen ? <X className="h-6 w-6 text-white" /> : <Zap className="h-6 w-6 text-white" />}
            </button>
            <span className="text-xs text-gray-400 absolute -bottom-2">Actions</span>
          </div>

          <Link to="/dashboard/transactions" className="flex flex-col items-center justify-center h-full w-full">
            <History className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1 text-gray-400">History</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center justify-center h-full w-full">
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1 text-gray-400">Profile</span>
          </Link>
        </div>
      </div>

      {/* FAB Menu */}
      {fabOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9991] animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-24 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto p-3">
              {actions.map((action, idx) => {
                // Define static color classes for each action to avoid dynamic string issues
                let colorClasses = '';
                switch (action.color) {
                  case 'tertiary':
                    colorClasses = 'from-tertiary/20 to-tertiary/5 border-tertiary/20 hover:from-tertiary/30';
                    break;
                  case 'secondary':
                    colorClasses = 'from-secondary/20 to-secondary/5 border-secondary/20 hover:from-secondary/30';
                    break;
                  case 'danger':
                    colorClasses = 'from-danger/20 to-danger/5 border-danger/20 hover:from-danger/30';
                    break;
                  case 'accent':
                    colorClasses = 'from-accent/20 to-accent/5 border-accent/20 hover:from-accent/30';
                    break;
                  case 'purple':
                    colorClasses = 'from-purple/20 to-purple/5 border-purple/20 hover:from-purple/30';
                    break;
                  case 'primary':
                  default:
                    colorClasses = 'from-primary/20 to-primary/5 border-primary/20 hover:from-primary/30';
                }
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={`w-[calc(33%-12px)] aspect-square flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b ${colorClasses} transition-all duration-300 shadow-lg`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${action.color} to-${action.color}/70 flex items-center justify-center mb-2`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">{action.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => setFabOpen(false)}
              className="mt-8 w-12 h-12 rounded-full bg-dark-100 border border-gray-800 flex items-center justify-center"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;