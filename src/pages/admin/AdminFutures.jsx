import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, RefreshCw, Play, Pause, XCircle, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFutures = () => {
  const [futures, setFutures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFutures = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/futures`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setFutures(data);
      else toast.error(data.message);
    } catch (err) {
      toast.error('Error loading futures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFutures();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/futures/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success(`Position ${newStatus}`);
        setFutures(futures.map(f => f._id === id ? { ...f, status: newStatus } : f));
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error updating position');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this futures position? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/futures/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Position deleted');
        setFutures(futures.filter(f => f._id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error deleting position');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-900/30 text-green-400',
      closed: 'bg-gray-800 text-gray-400',
      paused: 'bg-yellow-900/30 text-yellow-400'
    };
    return styles[status] || 'bg-gray-800 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          User Futures Positions
        </h1>
        <button onClick={fetchFutures} className="p-2 hover:bg-dark-100 rounded-lg">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-100 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Pair</th>
                <th className="px-4 py-3 text-center">Position</th>
                <th className="px-4 py-3 text-right">Leverage</th>
                <th className="px-4 py-3 text-right">Margin</th>
                <th className="px-4 py-3 text-right">Size</th>
                <th className="px-4 py-3 text-right">Entry Price</th>
                <th className="px-4 py-3 text-right">Liq. Price</th>
                <th className="px-4 py-3 text-right">PNL</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {futures.map((future) => (
                <tr key={future._id} className="hover:bg-dark-100/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/users/${future.user?._id}`} className="text-primary hover:underline">
                      {future.user?.name || 'Unknown'}
                    </Link>
                    <div className="text-xs text-gray-500">{future.user?.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{future.pair}</td>
                  <td className={`px-4 py-3 text-center font-bold ${future.position === 'long' ? 'text-green-400' : 'text-red-400'}`}>
                    {future.position.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-right">{future.leverage}x</td>
                  <td className="px-4 py-3 text-right">${future.margin?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${future.size?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${future.entryPrice?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${future.liquidationPrice?.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right ${future.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${future.pnl?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(future.status)}`}>
                      {future.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1">
                      {future.status === 'open' && (
                        <>
                          <button
                            onClick={() => updateStatus(future._id, 'paused')}
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(future._id, 'closed')}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="End/Close"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {future.status === 'paused' && (
                        <button
                          onClick={() => updateStatus(future._id, 'open')}
                          className="text-green-400 hover:text-green-300 p-1"
                          title="Resume"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(future._id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {futures.length === 0 && (
          <div className="text-center py-12 text-gray-500">No futures positions found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminFutures;