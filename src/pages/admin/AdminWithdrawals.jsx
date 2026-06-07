import { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawals(data);
      } else {
        toast.error('Failed to load withdrawals');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (withdrawalId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawals/${withdrawalId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Withdrawal ${status}`);
        fetchWithdrawals(); // Refresh list
      } else {
        toast.error('Failed to update withdrawal status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating withdrawal');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Withdrawals Management</h1>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-100 text-gray-400 text-xs uppercase">
                <th className="px-6 py-4 text-left font-medium">User</th>
                <th className="px-6 py-4 text-left font-medium">Amount</th>
                <th className="px-6 py-4 text-left font-medium">Method</th>
                <th className="px-6 py-4 text-left font-medium">Fee</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No withdrawals found
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id} className="hover:bg-dark-100/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{withdrawal.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-white font-medium">${withdrawal.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400">{withdrawal.method}</td>
                    <td className="px-6 py-4 text-gray-400">${withdrawal.fee?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        withdrawal.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        withdrawal.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {withdrawal.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(withdrawal._id, 'completed')}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(withdrawal._id, 'failed')}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-danger text-white hover:bg-danger-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;