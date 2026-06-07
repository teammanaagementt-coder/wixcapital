import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Clock, CheckCircle, DollarSign, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch real plans
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
      } else {
        toast.error(data.message || 'Investment failed');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Investment Plans</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Select an investment plan that suits your goals and start earning daily returns.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
            {/* Use plan.name, plan.daily, etc. */}
            <div className={`bg-gradient-to-r ${plan.color || 'from-primary to-secondary'} p-4 text-center`}>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-white/80 text-sm">{plan.daily}% Daily</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400">Min / Max</p>
                  <p className="text-white font-medium">${plan.min} – ${plan.max.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-white font-medium">{plan.duration} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Bonus</p>
                  <p className="text-white font-medium">+{plan.bonus}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Return</p>
                  <p className="text-green-500 font-medium">{plan.totalReturn}%</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={() => setSelectedPlan(plan)} className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium transition-colors">
              Invest Now
            </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-dark-50 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Invest in {selectedPlan.name}</h3>
            <p className="text-gray-400 text-sm mb-4">
              Min: ${selectedPlan.min} – Max: ${selectedPlan.max.toLocaleString()}
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Amount (USD)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={`Enter amount ($${selectedPlan.min} - $${selectedPlan.max.toLocaleString()})`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleInvest(selectedPlan)}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium"
                >
                  Confirm Investment
                </button>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-3 rounded-xl bg-dark-100 hover:bg-dark-200 text-white font-medium"
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