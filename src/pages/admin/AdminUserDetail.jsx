import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Wallet, Shield, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          toast.error('Failed to load user');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

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
      <div className="flex items-center gap-4">
        <a href="/admin/users" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </a>
        <h1 className="text-2xl font-bold text-white">User Details</h1>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <UserIcon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <p className="text-white font-medium">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-xs text-gray-400">Balance</p>
              <p className="text-white font-medium">${user.balance.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-gray-400">KYC Status</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.kycStatus === 'verified' ? 'bg-green-900/30 text-green-400' :
                user.kycStatus === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {user.kycStatus}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-gray-300">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Referral Code</p>
            <p className="text-gray-300">{user.referralCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;