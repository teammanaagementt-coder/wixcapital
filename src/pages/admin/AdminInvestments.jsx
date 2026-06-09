import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/investments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setInvestments(data);
      else toast.error(data.message);
    } catch (err) {
      toast.error('Error loading investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          All User Investments
        </h1>
        <button onClick={fetchInvestments} className="p-2 hover:bg-dark-100 rounded-lg">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-100 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Daily ROI</th>
                <th className="px-4 py-3 text-center">Duration</th>
                <th className="px-4 py-3 text-right">Total Return</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Start Date</th>
                <th className="px-4 py-3 text-center">End Date</th>
                <th className="px-4 py-3 text-center">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {investments.map((inv) => (
                <tr key={inv._id} className="hover:bg-dark-100/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/users/${inv.user?._id}`} className="text-primary hover:underline">
                      {inv.user?.name || 'Unknown'}
                    </Link>
                    <div className="text-xs text-gray-500">{inv.user?.email}</div>
                   </td>
                  <td className="px-4 py-3 font-medium text-white">{inv.planId?.name || 'Deleted Plan'}</td>
                  <td className="px-4 py-3 text-right text-green-400">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{inv.dailyReturn}%</td>
                  <td className="px-4 py-3 text-center">{inv.duration} days</td>
                  <td className="px-4 py-3 text-right text-yellow-400">${inv.totalReturn?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      inv.status === 'active' ? 'bg-green-900/30 text-green-400' :
                      inv.status === 'completed' ? 'bg-blue-900/30 text-blue-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {new Date(inv.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {new Date(inv.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      to={`/admin/users/${inv.user?._id}`}
                      className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                    >
                      <Eye className="w-3 h-3" /> View User
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {investments.length === 0 && (
          <div className="text-center py-12 text-gray-500">No investments found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminInvestments;