import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, CheckCircle, DollarSign, Shield, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [myInvestments, setMyInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/investment-plans`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPlans(data);
        } else {
          toast.error('Failed to load investment plans');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Fetch user's active investments
  const fetchMyInvestments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/investments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMyInvestments(data);
      } else {
        toast.error('Failed to load your investments');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoadingInvestments(false);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const handleInvest = async (plan) => {
    const amount = parseFloat(investAmount);
    if (!amount || amount < plan.min || amount > plan.max) {
      toast.error(`Amount must be between $${plan.min} and $${plan.max}`);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ planId: plan._id, amount }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Invested $${amount} in ${plan.name} plan!`);
        setSelectedPlan(null);
        setInvestAmount('');
        // Refresh investments list
        fetchMyInvestments();
      } else {
        toast.error(data.message || 'Investment failed');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Syne', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c896]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Investment Plans</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Choose Your Plan</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Select an investment plan that suits your goals and start earning daily returns.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden hover:border-[#00c896]/50 transition-colors">
            <div className={`bg-gradient-to-r ${plan.color || 'from-[#00c896] to-[#4a9dff]'} p-4 text-center`}>
              <h3 className="text-xl font-bold text-[#e8e8f0]">{plan.name}</h3>
              <p className="text-[#e8e8f0]/80 text-sm">{plan.daily}% Daily</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-[#6b6b85]">Min / Max</p>
                  <p className="text-[#e8e8f0] font-medium">${plan.min} – ${plan.max.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b6b85]">Duration</p>
                  <p className="text-[#e8e8f0] font-medium">{plan.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b6b85]">Bonus</p>
                  <p className="text-[#e8e8f0] font-medium">+{plan.bonus}%</p>
                </div>
                <div>
                  <p className="text-xs text-[#6b6b85]">Total Return</p>
                  <p className="text-[#00c896] font-medium">{plan.totalReturn}%</p>
                </div>
              </div>

              <div className="border-t border-[#1a1a28] pt-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#6b6b85]">
                      <CheckCircle className="w-4 h-4 text-[#00c896]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => setSelectedPlan(plan)} className="w-full py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium transition-colors">
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* My Investments Section */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#1a1a28] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#00c896]" />
          <h2 className="text-lg font-bold text-[#e8e8f0]">My Investments</h2>
        </div>
        <div className="p-4">
          {loadingInvestments ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c896]"></div>
            </div>
          ) : myInvestments.length === 0 ? (
            <div className="text-center py-8 text-[#6b6b85]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1a1a28] flex items-center justify-center">
                <XCircle className="w-6 h-6 text-[#4a4a64]" />
              </div>
              <p className="text-sm">No active investments yet.</p>
              <p className="text-xs mt-1">Choose a plan above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[#6b6b85] uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Plan</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Daily Return</th>
                    <th className="px-4 py-3 text-left font-medium">Duration</th>
                    <th className="px-4 py-3 text-left font-medium">End Date</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a28]">
                  {myInvestments.map((inv) => (
                    <tr key={inv._id} className="text-sm text-[#9898b0] hover:bg-[#1a1a28]/30 transition-colors">
                      <td className="px-4 py-3">{inv.planId?.name || 'Unknown Plan'}</td>
                      <td className="px-4 py-3 font-mono text-[#e8e8f0]">${inv.amount?.toLocaleString()}</td>
                      <td className="px-4 py-3">{inv.dailyReturn}%</td>
                      <td className="px-4 py-3">{inv.duration} days</td>
                      <td className="px-4 py-3">{formatDate(inv.endDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inv.status === 'active'
                            ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]'
                            : inv.status === 'completed'
                            ? 'bg-[rgba(74,157,255,0.1)] text-[#4a9dff]'
                            : 'bg-[rgba(255,91,110,0.1)] text-[#ff5b6e]'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#e8e8f0] mb-2">Invest in {selectedPlan.name}</h3>
            <p className="text-[#6b6b85] text-sm mb-4">
              Min: ${selectedPlan.min} – Max: ${selectedPlan.max.toLocaleString()}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[#6b6b85]">Amount (USD)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  placeholder={`Enter amount ($${selectedPlan.min} - $${selectedPlan.max.toLocaleString()})`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleInvest(selectedPlan)}
                  className="flex-1 py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium"
                >
                  Confirm Investment
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-3 rounded-xl bg-[#0c0c16] hover:bg-[#1a1a28] text-[#e8e8f0] font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlans;