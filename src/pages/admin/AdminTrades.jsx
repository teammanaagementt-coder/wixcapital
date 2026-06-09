import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, RefreshCw, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/trades`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTrades(data);
      else toast.error(data.message);
    } catch (err) {
      toast.error('Error loading trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this trade? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/trades/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Trade deleted');
        setTrades(trades.filter(t => t._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error deleting trade');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          User Trades
        </h1>
        <button onClick={fetchTrades} className="p-2 hover:bg-dark-100 rounded-lg">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-100 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Symbol</th>
                <th className="px-4 py-3 text-center">Type</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Fee</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {trades.map((trade) => (
                <tr key={trade._id} className="hover:bg-dark-100/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/users/${trade.user?._id}`} className="text-primary hover:underline">
                      {trade.user?.name || 'Unknown'}
                    </Link>
                    <div className="text-xs text-gray-500">{trade.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{trade.symbol}</td>
                  <td className={`px-4 py-3 text-center font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.type.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-right">{trade.amount}</td>
                  <td className="px-4 py-3 text-right">${trade.price?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${trade.total?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${trade.fee?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-900/30 text-green-400">
                      {trade.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {new Date(trade.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(trade._id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Delete Trade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {trades.length === 0 && (
          <div className="text-center py-12 text-gray-500">No trades found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminTrades;