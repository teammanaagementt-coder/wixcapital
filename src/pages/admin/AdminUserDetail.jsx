import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle, Shield, User as UserIcon, Mail, Key, Edit2, Save, X, Trash2, Ban, DollarSign, RefreshCw, Eye, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [balanceAction, setBalanceAction] = useState({ type: 'credit', amount: '' });
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditForm({ name: data.name, email: data.email, role: data.role });
      } else {
        toast.error(data.message || 'Failed to load user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Update user profile
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('User updated successfully');
        setUser(data.user);
        setEditing(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Error updating user');
    } finally {
      setProcessing(false);
    }
  };

  // Adjust balance (credit/debit)
  const handleBalanceChange = async (e) => {
    e.preventDefault();
    if (!balanceAction.amount || parseFloat(balanceAction.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/balance`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: balanceAction.type,
          amount: parseFloat(balanceAction.amount)
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully ${balanceAction.type === 'credit' ? 'added' : 'deducted'} $${balanceAction.amount}`);
        setUser({ ...user, balance: data.newBalance });
        setShowBalanceModal(false);
        setBalanceAction({ type: 'credit', amount: '' });
      } else {
        toast.error(data.message || 'Balance update failed');
      }
    } catch (err) {
      toast.error('Error updating balance');
    } finally {
      setProcessing(false);
    }
  };

  // Toggle ban status
  const handleToggleBan = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive })
      });
      if (res.ok) {
        toast.success(`User ${!user.isActive ? 'activated' : 'suspended'} successfully`);
        setUser({ ...user, isActive: !user.isActive });
      } else {
        const data = await res.json();
        toast.error(data.message || 'Action failed');
      }
    } catch (err) {
      toast.error('Error updating status');
    } finally {
      setProcessing(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('User deleted permanently');
        navigate('/admin/users');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Deletion failed');
      }
    } catch (err) {
      toast.error('Error deleting user');
    } finally {
      setProcessing(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/resend-verification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Verification email sent');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to send email');
      }
    } catch (err) {
      toast.error('Error sending email');
    } finally {
      setProcessing(false);
    }
  };

  // NEW: Reset password (send reset link)
  const handleResetPassword = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password reset email sent');
      } else {
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      toast.error('Error sending reset email');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    return <div className="text-white text-center">User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/users')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">User Details</h1>
        </div>
        <button onClick={fetchUser} className="p-2 hover:bg-dark-100 rounded-lg transition-colors" title="Refresh">
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="lg:col-span-2 bg-dark-50/90 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-md bg-dark-100 text-gray-300 hover:text-white text-sm flex items-center gap-1">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(false); setEditForm({ name: user.name, email: user.email, role: user.role }); }} className="px-3 py-1.5 rounded-md bg-dark-100 text-gray-300 hover:text-white text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button form="editForm" type="submit" className="px-3 py-1.5 rounded-md bg-primary text-white text-sm flex items-center gap-1">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <form id="editForm" onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-dark-200 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-dark-200 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full bg-dark-200 border border-gray-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="text-white font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-400">Referral Code</p>
                  <p className="text-white font-mono text-sm">{user.referralCode}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats & Actions Card */}
        <div className="space-y-6">
          <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-500" />
                <h3 className="text-white font-semibold">Balance</h3>
              </div>
              <button onClick={() => setShowBalanceModal(true)} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Adjust
              </button>
            </div>
            <p className="text-3xl font-bold text-white">${user.balance?.toFixed(2) || '0.00'}</p>
          </div>

          <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <h3 className="text-white font-semibold">KYC Status</h3>
              </div>
              {user.kycStatus !== 'verified' && (
                <button onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/verify`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) {
                      toast.success('User verified');
                      setUser({ ...user, kycStatus: 'verified', isVerified: true });
                    } else toast.error('Verification failed');
                  } catch { toast.error('Error'); }
                }} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verify Now
                </button>
              )}
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.kycStatus === 'verified' ? 'bg-green-900/30 text-green-400' :
              user.kycStatus === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
              'bg-gray-800 text-gray-400'
            }`}>
              {user.kycStatus || 'unverified'}
            </span>
          </div>

          <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-yellow-500" />
                <h3 className="text-white font-semibold">Account Status</h3>
              </div>
              <button onClick={handleToggleBan} className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded flex items-center gap-1">
                <Ban className="w-3 h-3" /> {user.isActive !== false ? 'Suspend' : 'Activate'}
              </button>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.isActive !== false ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            }`}>
              {user.isActive !== false ? 'Active' : 'Suspended'}
            </span>
          </div>

          <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 space-y-3">
            <button 
              onClick={handleResendVerification} 
              className="w-full py-2 rounded-lg bg-dark-100 text-gray-300 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Resend Verification Email
            </button>
            <button 
              onClick={handleResetPassword} 
              className="w-full py-2 rounded-lg bg-dark-100 text-yellow-400 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" /> Reset Password
            </button>
            {/* <button 
              onClick={() => navigate(`/admin/users/${userId}/transactions`)} 
              className="w-full py-2 rounded-lg bg-dark-100 text-blue-400 hover:text-white text-sm flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> View All Transactions
            </button> */}
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="w-full py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-800/40 text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete User Permanently
            </button>
          </div>
        </div>
      </div>

      {/* Balance Adjustment Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">Adjust Balance</h3>
            <p className="text-gray-400 mb-4">Current balance: <span className="text-white font-mono">${user.balance?.toFixed(2) || '0.00'}</span></p>
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
                  className="w-full bg-dark-200 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowBalanceModal(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600" disabled={processing}>Apply</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 border border-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-2">Delete User</h3>
            <p className="text-gray-400 mb-6">This action is permanent. All user data will be lost.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Cancel</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700" disabled={processing}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;