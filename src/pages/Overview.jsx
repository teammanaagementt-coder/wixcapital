import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, DollarSign, TrendingUp, Users, 
  Calendar, Clock, PieChart, Activity, 
  ArrowUpRight, ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Overview = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real user data – runs every 10 seconds
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
        } else {
          toast.error('Failed to load dashboard data');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately on mount
    fetchDashboard();

    // Then poll every 10 seconds
    const pollInterval = setInterval(fetchDashboard, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const stats = [
    {
      label: 'AVAILABLE BALANCE',
      value: userData ? `$${userData.balance.toFixed(2)}` : '$0',
      sub: userData && userData.balance > 0 ? 'Available funds' : 'Add funds to start',
      subColor: userData && userData.balance > 0 ? 'text-green-500' : 'text-red-500',
      icon: Wallet,
      iconBg: 'bg-gray-800',
    },
    {
      label: 'TOTAL INVESTED',
      value: userData ? `$${userData.totalDeposited?.toFixed(2) || '0.00'}` : '$0',
      sub: '—',
      subColor: 'text-gray-500',
      icon: DollarSign,
      iconBg: 'bg-gray-800',
    },
    {
      label: 'ACTIVE INVESTMENTS',
      value: '0',
      sub: '0 confirmed',
      subColor: 'text-green-500',
      icon: TrendingUp,
      iconBg: 'bg-gray-800',
    },
    {
      label: 'REFERRAL EARNINGS',
      value: userData ? `$${userData.referralEarnings?.toFixed(2) || '0.00'}` : '$0',
      sub: `${userData?.totalReferrals || 0} referrals`,
      subColor: 'text-green-500',
      icon: Users,
      iconBg: 'bg-gray-800',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Top Header Section */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userData?.name || 'User'}!
          </h1>
          <p className="text-gray-300 mb-6 max-w-lg">
            Start building your investment portfolio with exciting IPO opportunities.
          </p>
          <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <span>Explore Revenue Engines</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-dark-50/90 border border-gray-800 rounded-lg p-5 relative">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className="w-4 h-4 text-gray-300" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              <span className={stat.subColor}>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Value */}
        <div className="lg:col-span-2 bg-dark-50/90 border border-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-white">Portfolio Value</h3>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +0% this period
            </span>
          </div>
          <div className="h-48 w-full relative">
            <svg viewBox="0 0 500 150" className="w-full h-full text-gray-700 stroke-current">
              <path
                d="M0,100 L50,80 L100,90 L150,50 L200,60 L250,30 L300,70 L350,40 L400,80 L450,60 L500,90"
                fill="none"
                strokeWidth="2"
                className="text-white opacity-50"
              />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-500">
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
            <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500">
              <span>$0k</span>
              <span>$0k</span>
              <span>$0k</span>
              <span>$0k</span>
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-6 flex flex-col">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-400" />
            Sector Allocation
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border-4 border-gray-800 flex items-center justify-center mb-3">
              <PieChart className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No investments yet</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-400" />
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium mb-1">No activity yet</p>
            <p className="text-gray-500 text-sm">Start by exploring the marketplace</p>
          </div>
        </div>

        {/* Orbital Alpha Promo */}
        <div className="relative overflow-hidden rounded-lg p-6 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border border-gray-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-20 right-20 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute bottom-10 left-1/4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="relative z-10">
            <div className="flex justify-end mb-4">
              <div className="text-5xl font-bold italic text-white/10">X</div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Orbital Alpha</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed max-w-md">
              Revolutionary satellite constellation management platform providing real-time orbital tracking and collision avoidance systems for the growing space economy.
            </p>
            <button className="bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
              <span>View Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;