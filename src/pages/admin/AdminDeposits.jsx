import { useState, useEffect } from 'react';
import { Banknote, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/deposits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDeposits(data);
      } else {
        toast.error('Failed to load deposits');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (depositId, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/deposits/${depositId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Deposit ${status}`);
        fetchDeposits(); // Refresh list
      } else {
        toast.error('Failed to update deposit status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating deposit');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Deposits Management</h1>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-100 text-gray-400 text-xs uppercase">
                <th className="px-6 py-4 text-left font-medium">User</th>
                <th className="px-6 py-4 text-left font-medium">Amount</th>
                <th className="px-6 py-4 text-left font-medium">Method</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Proof</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No deposits found
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit._id} className="hover:bg-dark-100/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{deposit.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-white font-medium">${deposit.amount?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-400">{deposit.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        deposit.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                        deposit.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-red-900/30 text-red-400'
                      }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`http://localhost:5000${deposit.proofUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-400 flex items-center gap-1 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {deposit.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(deposit._id, 'completed')}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(deposit._id, 'failed')}
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

export default AdminDeposits;