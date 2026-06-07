import { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, XCircle, Link } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          toast.error('Failed to load users');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
        toast.error('Failed to verify user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error verifying user');
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
                <th className="px-6 py-4 text-left font-medium">KYC Status</th>
                <th className="px-6 py-4 text-left font-medium">Role</th>
                <th className="px-6 py-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-dark-100/50 transition-colors">
                  <td className="px-6 py-4 text-white">{user.name}</td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300">${user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.kycStatus === 'verified' ? 'bg-green-900/30 text-green-400' :
                      user.kycStatus === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {user.kycStatus}
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
  <Link
    to={`/admin/users/${user._id}`}
    className="px-3 py-1.5 text-xs font-medium rounded-md bg-dark-100 text-gray-300 hover:text-white hover:bg-dark-200 transition-colors"
  >
    View
  </Link>
</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleVerify(user._id)}
                      disabled={user.kycStatus === 'verified'}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        user.kycStatus === 'verified'
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-600'
                      }`}
                    >
                      {user.kycStatus === 'verified' ? 'Verified' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;