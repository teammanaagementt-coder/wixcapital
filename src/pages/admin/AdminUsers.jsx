import { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, XCircle, Edit, Trash2, Ban, DollarSign, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showBanModal, setShowBanModal] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(null);
  const [balanceAction, setBalanceAction] = useState({ userId: null, type: 'credit', amount: '' });
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error(data.message || 'Failed to load users');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Verify KYC
  const handleVerify = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/verify`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User verified successfully');
        setUsers(users.map(u => 
          u._id === userId ? { ...u, kycStatus: 'verified', isVerified: true } : u
        ));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Error verifying user');
    }
  };

  // Toggle ban / active status
  const handleToggleBan = async (userId, currentStatus) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        toast.success(`User ${!currentStatus ? 'activated' : 'suspended'} successfully`);
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Error updating user status');
    } finally {
      setProcessing(false);
      setShowBanModal(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User deleted permanently');
        setUsers(users.filter(u => u._id !== userId));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Error deleting user');
    } finally {
      setProcessing(false);
      setShowDeleteModal(null);
    }
  };

  // Credit / Debit balance
  const handleBalanceChange = async (e) => {
    e.preventDefault();
    if (!balanceAction.amount || parseFloat(balanceAction.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${balanceAction.userId}/balance`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: balanceAction.type, // 'credit' or 'debit'
          amount: parseFloat(balanceAction.amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully ${balanceAction.type === 'credit' ? 'added' : 'deducted'} $${balanceAction.amount}`);
        // Update user balance in the list
        setUsers(users.map(u => 
          u._id === balanceAction.userId ? { ...u, balance: data.newBalance } : u
        ));
        setShowBalanceModal(null);
        setBalanceAction({ userId: null, type: 'credit', amount: '' });
      } else {
        toast.error(data.message || 'Balance update failed');
      }
    } catch (err) {
      toast.error('Error updating balance');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button onClick={fetchUsers} className="p-2 hover:bg-dark-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <Users className="w-4 h-4" />
          <span>{users.length} users</span>
        </div>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-100 text-gray-400 text-xs uppercase">
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-left font-medium">Email</th>
                <th className="px-6 py-4 text-left font-medium">Balance</th>
                <th className="px-6 py-4 text-left font-medium">KYC</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-left font-medium">Role</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-dark-100/50 transition-colors">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300">${user.balance?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.kycStatus === 'verified' ? 'bg-green-900/30 text-green-400' :
                      user.kycStatus === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {user.kycStatus || 'unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.isActive !== false ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
  <div className="flex gap-2 flex-wrap">
    <Link
      to={`/admin/users/${user._id}`}
      className="px-2 py-1 rounded-md bg-dark-100 text-gray-300 hover:text-white hover:bg-dark-200 text-xs flex items-center gap-1"
      title="View / Edit"
    >
      <Eye className="w-3 h-3" /> Edit
    </Link>
    <button
      onClick={() => setShowBalanceModal({ userId: user._id, currentBalance: user.balance })}
      className="px-2 py-1 rounded-md bg-dark-100 text-green-400 hover:bg-dark-200 text-xs flex items-center gap-1"
      title="Adjust Balance"
    >
      <DollarSign className="w-3 h-3" /> Balance
    </button>
    <button
      onClick={() => handleVerify(user._id)}
      disabled={user.kycStatus === 'verified'}
      className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 ${
        user.kycStatus === 'verified'
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-dark-100 text-blue-400 hover:bg-dark-200'
      }`}
      title="Verify KYC"
    >
      <CheckCircle className="w-3 h-3" /> Verify
    </button>
    <button
      onClick={() => setShowBanModal({ userId: user._id, isActive: user.isActive })}
      className="px-2 py-1 rounded-md bg-dark-100 text-yellow-400 hover:bg-dark-200 text-xs flex items-center gap-1"
      title={user.isActive !== false ? 'Suspend' : 'Activate'}
    >
      <Ban className="w-3 h-3" /> {user.isActive !== false ? 'Suspend' : 'Activate'}
    </button>
    <button
      onClick={() => setShowDeleteModal(user._id)}
      className="px-2 py-1 rounded-md bg-dark-100 text-red-400 hover:bg-dark-200 text-xs flex items-center gap-1"
      title="Delete Permanently"
    >
      <Trash2 className="w-3 h-3" /> Delete
    </button>
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-400 mb-6">Are you sure? This action is permanent and cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
              <button onClick={() => handleDeleteUser(showDeleteModal)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700" disabled={processing}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Ban/Suspend Confirmation Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">{showBanModal.isActive !== false ? 'Suspend User' : 'Activate User'}</h3>
            <p className="text-gray-400 mb-6">
              {showBanModal.isActive !== false 
                ? 'This user will be unable to log in or perform any actions. They can be reactivated later.' 
                : 'This user will regain full access to the platform.'}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowBanModal(null)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
              <button 
                onClick={() => handleToggleBan(showBanModal.userId, showBanModal.isActive !== false)} 
                className={`px-4 py-2 rounded-lg ${showBanModal.isActive !== false ? 'bg-yellow-600' : 'bg-green-600'} text-white hover:opacity-90`}
                disabled={processing}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">Adjust Balance</h3>
            <p className="text-gray-400 mb-4">Current balance: <span className="text-white font-mono">${showBalanceModal.currentBalance?.toFixed(2) || '0.00'}</span></p>
            <form onSubmit={handleBalanceChange}>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Action</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" value="credit" checked={balanceAction.type === 'credit'} onChange={() => setBalanceAction({ ...balanceAction, type: 'credit' })} /> Credit
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="type" value="debit" checked={balanceAction.type === 'debit'} onChange={() => setBalanceAction({ ...balanceAction, type: 'debit' })} /> Debit
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={balanceAction.amount}
                  onChange={(e) => setBalanceAction({ ...balanceAction, amount: e.target.value })}
                  className="w-full bg-dark-200 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowBalanceModal(null); setBalanceAction({ userId: null, type: 'credit', amount: '' }); }} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600" disabled={processing}>Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;