import { useState, useEffect } from 'react';
import { Calendar, Users, Gift, Copy, CheckCircle, UserPlus, TrendingUp, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Referrals = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setReferralData({
            referralCode: data.user.referralCode,
            totalReferrals: data.user.totalReferrals,
            referralEarnings: data.user.referralEarnings,
            // If the backend provides referral list, use it; otherwise fake empty array
            referrals: data.referrals || [],
          });
        } else {
          toast.error('Could not load referral data');
        }
      } catch (err) {
        toast.error('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${referralData?.referralCode || ''}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'N/A');

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Referral Program</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Invite Friends & Earn</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Share your referral link and earn 5% commission on every friend’s investment.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#00c896]" />
            </div>
            <div>
              <p className="text-xs text-[#6b6b85] uppercase font-medium">Total Referrals</p>
              <p className="text-2xl font-bold text-[#e8e8f0]">
                {loading ? '...' : referralData?.totalReferrals || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#00c896]" />
            </div>
            <div>
              <p className="text-xs text-[#6b6b85] uppercase font-medium">Referral Earnings</p>
              <p className="text-2xl font-bold text-[#e8e8f0]">
                ${loading ? '...' : (referralData?.referralEarnings || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
              <Gift className="w-6 h-6 text-[#00c896]" />
            </div>
            <div>
              <p className="text-xs text-[#6b6b85] uppercase font-medium">Commission Rate</p>
              <p className="text-2xl font-bold text-[#e8e8f0]">5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e8e8f0] mb-4">Your Referral Link</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full py-3 pl-4 pr-12 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] text-sm"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(0,200,150,0.1)] text-[#00c896] hover:bg-[rgba(0,200,150,0.2)] transition-all"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-shrink-0 relative">
            <input
              type="text"
              readOnly
              value={referralData?.referralCode || ''}
              className="w-full py-3 pl-4 pr-12 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] text-sm"
            />
            <button
              onClick={() => copyToClipboard(referralData?.referralCode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(0,200,150,0.1)] text-[#00c896] hover:bg-[rgba(0,200,150,0.2)] transition-all"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#6b6b85]">Share this link or code with friends.</p>
      </div>

      {/* Referral Table */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1a1a28] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#00c896]" />
          <h2 className="text-base font-semibold text-[#e8e8f0]">Referred Users</h2>
        </div>
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c896]"></div>
            </div>
          ) : (referralData?.referrals || []).length === 0 ? (
            <div className="text-center py-8 text-[#6b6b85]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1a1a28] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4a4a64]" />
              </div>
              <p className="text-sm">No referrals yet.</p>
              <p className="text-xs mt-1">Share your link to start earning.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[#6b6b85] uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">User</th>
                    <th className="px-4 py-3 text-left font-medium">Joined</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a28]">
                  {referralData.referrals.map((ref, idx) => (
                    <tr key={idx} className="text-sm text-[#9898b0] hover:bg-[#1a1a28]/30 transition-colors">
                      <td className="px-4 py-3">{ref.name || 'Unknown'}</td>
                      <td className="px-4 py-3">{formatDate(ref.createdAt)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-[rgba(0,200,150,0.1)] text-[#00c896]">
                          {ref.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#e8e8f0]">
                        ${(ref.earnings || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Referrals;