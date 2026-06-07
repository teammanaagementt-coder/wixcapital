import { useState, useEffect } from 'react';
import { Layers, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminInvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    min: '',
    max: '',
    daily: '',
    duration: '',
    bonus: '0',
    totalReturn: '',
    color: 'from-blue-500 to-blue-600',
    features: [],
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/investment-plans`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPlans(data);
      } else {
        toast.error('Failed to load plans');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error loading plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPlan
        ? `${import.meta.env.VITE_API_URL}/admin/investment-plans/${editingPlan._id}`
        : `${import.meta.env.VITE_API_URL}/admin/investment-plans`;
      
      const method = editingPlan ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          min: parseFloat(formData.min),
          max: parseFloat(formData.max),
          daily: parseFloat(formData.daily),
          duration: parseInt(formData.duration),
          bonus: parseFloat(formData.bonus),
          totalReturn: parseFloat(formData.totalReturn),
        })
      });

      if (res.ok) {
        toast.success(editingPlan ? 'Plan updated' : 'Plan created');
        setShowModal(false);
        setEditingPlan(null);
        resetForm();
        fetchPlans();
      } else {
        toast.error('Failed to save plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving plan');
    }
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/investment-plans/${planId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Plan deleted');
        fetchPlans();
      } else {
        toast.error('Failed to delete plan');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting plan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      min: '',
      max: '',
      daily: '',
      duration: '',
      bonus: '0',
      totalReturn: '',
      color: 'from-blue-500 to-blue-600',
      features: [],
    });
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      min: plan.min.toString(),
      max: plan.max.toString(),
      daily: plan.daily.toString(),
      duration: plan.duration.toString(),
      bonus: plan.bonus.toString(),
      totalReturn: plan.totalReturn.toString(),
      color: plan.color,
      features: plan.features || [],
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Investment Plans</h1>
        <button
          onClick={() => { resetForm(); setEditingPlan(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan._id} className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
            <div className={`bg-gradient-to-r ${plan.color} p-4 text-center`}>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-white/80 text-sm">{plan.daily}% Daily</p>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Min</span>
                <span className="text-white">${plan.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max</span>
                <span className="text-white">${plan.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{plan.duration} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Bonus</span>
                <span className="text-white">+{plan.bonus}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Return</span>
                <span className="text-green-400">{plan.totalReturn}%</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 flex gap-2">
              <button
                onClick={() => openEdit(plan)}
                className="flex-1 py-2 rounded-lg bg-dark-100 text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(plan._id)}
                className="flex-1 py-2 rounded-lg bg-danger/20 text-danger hover:bg-danger/30 transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-dark-50 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Plan Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Min Amount</label>
                  <input
                    type="number"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Max Amount</label>
                  <input
                    type="number"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Daily Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.daily}
                    onChange={(e) => setFormData({ ...formData, daily: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Bonus (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Total Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.totalReturn}
                    onChange={(e) => setFormData({ ...formData, totalReturn: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Color Gradient</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
                >
                  <option value="from-blue-500 to-blue-600">Blue</option>
                  <option value="from-gray-400 to-gray-500">Silver</option>
                  <option value="from-yellow-500 to-yellow-600">Gold</option>
                  <option value="from-blue-300 to-blue-400">Diamond</option>
                  <option value="from-purple-600 to-purple-700">VIP</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium"
                >
                  {editingPlan ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingPlan(null); resetForm(); }}
                  className="px-4 py-3 rounded-xl bg-dark-100 hover:bg-dark-200 text-white font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestmentPlans;