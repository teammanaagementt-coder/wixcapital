import { useState, useEffect } from 'react';
import { Users, Banknote, ArrowUpRight, Layers, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(prev => ({ ...prev, totalUsers: data.length }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
        </div>

        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Deposits</span>
            <Banknote className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white">${stats.totalDeposits.toFixed(2)}</div>
        </div>

        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Withdrawals</span>
            <ArrowUpRight className="w-4 h-4 text-danger" />
          </div>
          <div className="text-2xl font-bold text-white">${stats.totalWithdrawals.toFixed(2)}</div>
        </div>

        <div className="bg-dark-50/90 border border-gray-800 rounded-lg p-5">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Investments</span>
            <Layers className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalInvestments}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;