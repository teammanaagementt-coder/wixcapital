import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Banknote, ArrowUpRight, 
  Layers, Settings, LogOut, Shield, TrendingUp, Activity   // ← added TrendingUp
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/admin/login');
  };

  const menuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/deposits', icon: Banknote, label: 'Deposits' },
    { to: '/admin/withdrawals', icon: ArrowUpRight, label: 'Withdrawals' },
    { to: '/admin/investment-plans', icon: Layers, label: 'Investment Plans' },
    { to: '/admin/investments', icon: TrendingUp, label: 'Investments' },   // ← NEW
    { to: '/admin/trades', icon: TrendingUp, label: 'Trades' },
    { to: '/admin/futures', icon: Activity, label: 'Futures' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-50 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Wix Admin</h1>
          <p className="text-xs text-gray-400">Control Panel</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-dark-100 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-dark-100 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;