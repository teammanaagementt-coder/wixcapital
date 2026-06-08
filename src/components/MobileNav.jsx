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
    <div className="fixed bottom-0 left-0 right-0 z-[9990] md:hidden" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="bg-[#0c0c16] border-t border-[#1a1a28] pt-0.5">
        <div className="flex items-center justify-around h-16 relative px-2">
          <Link to="/dashboard/overview" className="flex flex-col items-center justify-center h-full w-full">
            <Home className="h-5 w-5 text-[#6b6b85]" />
            <span className="text-xs mt-1 text-[#6b6b85]">Home</span>
          </Link>
          <Link to="/dashboard/deposit" className="flex flex-col items-center justify-center h-full w-full">
            <Download className="h-5 w-5 text-[#00c896]" />
            <span className="text-xs mt-1 text-[#00c896] font-medium">Deposit</span>
          </Link>

          {/* FAB */}
          <div className="flex flex-col items-center h-full relative px-2 -mt-8">
            <button
              onClick={() => setFabOpen(!fabOpen)}
              className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center bg-[#00c896] transform hover:scale-105 transition-all duration-300"
            >
              {fabOpen ? <X className="h-6 w-6 text-black" /> : <Zap className="h-6 w-6 text-black" />}
            </button>
            <span className="text-xs text-[#6b6b85] absolute -bottom-2">Actions</span>
          </div>

          <Link to="/dashboard/transactions" className="flex flex-col items-center justify-center h-full w-full">
            <History className="h-5 w-5 text-[#6b6b85]" />
            <span className="text-xs mt-1 text-[#6b6b85]">History</span>
          </Link>
          <Link to="/dashboard/settings" className="flex flex-col items-center justify-center h-full w-full">
            <User className="h-5 w-5 text-[#6b6b85]" />
            <span className="text-xs mt-1 text-[#6b6b85]">Profile</span>
          </Link>
        </div>
      </div>

      {/* FAB Menu */}
      {fabOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9991] animate-in fade-in duration-300">
          <div className="absolute inset-x-0 bottom-24 flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto p-3">
              {actions.map((action, idx) => {
                let colorClasses = '';
                switch (action.color) {
                  case 'tertiary':
                    colorClasses = 'from-[#627eea]/20 to-[#627eea]/5 border-[#627eea]/20 hover:from-[#627eea]/30';
                    break;
                  case 'secondary':
                    colorClasses = 'from-[#f7931a]/20 to-[#f7931a]/5 border-[#f7931a]/20 hover:from-[#f7931a]/30';
                    break;
                  case 'danger':
                    colorClasses = 'from-[#ff5b6e]/20 to-[#ff5b6e]/5 border-[#ff5b6e]/20 hover:from-[#ff5b6e]/30';
                    break;
                  case 'accent':
                    colorClasses = 'from-[#f3ba2f]/20 to-[#f3ba2f]/5 border-[#f3ba2f]/20 hover:from-[#f3ba2f]/30';
                    break;
                  case 'purple':
                    colorClasses = 'from-[#9945ff]/20 to-[#9945ff]/5 border-[#9945ff]/20 hover:from-[#9945ff]/30';
                    break;
                  case 'primary':
                  default:
                    colorClasses = 'from-[#00c896]/20 to-[#00c896]/5 border-[#00c896]/20 hover:from-[#00c896]/30';
                }
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={`w-[calc(33%-12px)] aspect-square flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b ${colorClasses} transition-all duration-300 shadow-lg`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[${action.color === 'tertiary' ? '#627eea' : action.color === 'secondary' ? '#f7931a' : action.color === 'danger' ? '#ff5b6e' : action.color === 'accent' ? '#f3ba2f' : action.color === 'purple' ? '#9945ff' : '#00c896'}] to-[#${action.color === 'tertiary' ? '627eea' : action.color === 'secondary' ? 'f7931a' : action.color === 'danger' ? 'ff5b6e' : action.color === 'accent' ? 'f3ba2f' : action.color === 'purple' ? '9945ff' : '00c896'}]/70 flex items-center justify-center mb-2`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-white">{action.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => setFabOpen(false)}
              className="mt-8 w-12 h-12 rounded-full bg-[#1a1a28] border border-[#1a1a28] flex items-center justify-center"
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