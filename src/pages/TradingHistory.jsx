import { useState, useEffect } from 'react';
import { Calendar, Wallet, TrendingUp, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const TradingHistory = () => {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState({
    totalReturns: 0,
    lastReturn: 0,
    totalTransactions: 0,
  });

  // Fetch trading history data
  useEffect(() => {
    const fetchTradingHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/trading-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setTrades(data.trades || []);
          setStats({
            totalReturns: data.totalReturns || 0,
            lastReturn: data.lastReturn || 0,
            totalTransactions: data.totalTransactions || 0,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load trading history');
      } finally {
        setLoading(false);
      }
    };

    fetchTradingHistory();
  }, []);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Helper to format currency
  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading trading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Page Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>ROI History</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Activity className="w-4 h-4" />
              <span>{stats.totalTransactions} trades</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Your ROI History</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Track all your returns on investment from trading and staking.
          </p>
        </div>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Returns Card */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">
                Total Returns
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {formatAmount(stats.totalReturns)}
              </p>
            </div>
          </div>
        </div>

        {/* Last Return Card */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">
                Last Return
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {formatAmount(stats.lastReturn)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.lastReturn > 0 ? 'Most recent ROI' : 'No returns yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Total Transactions Card */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">
                Total Transactions
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {stats.totalTransactions}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ROI payments received
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI History Table */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            <span>Return on Investment History</span>
          </h2>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-800">
              <thead>
                <tr className="bg-dark-100">
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Investment Plan
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-sm text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <Activity className="w-10 h-10 mb-3 text-gray-600" />
                        <p>No ROI history found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trades.map((trade, idx) => (
                    <tr key={idx} className="hover:bg-dark-100/50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-300">
                        {trade.plan || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        {formatAmount(trade.amount)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trade.type === 'profit' ? 'bg-green-900/30 text-green-400' :
                          trade.type === 'bonus' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`}>
                          {trade.type || 'ROI'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {formatDate(trade.date || trade.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingHistory;