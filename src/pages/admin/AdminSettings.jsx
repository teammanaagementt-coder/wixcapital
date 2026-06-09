import { useState, useEffect } from 'react';
import { Shield, Save, Plus, Edit, Trash2, X, CheckCircle, Wallet, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  // Global settings state
  const [settings, setSettings] = useState({
    siteName: '',
    supportEmail: '',
    withdrawalFee: '',
    minWithdrawal: '',
    maxWithdrawal: '',
    maintenance: false,
    registrationEnabled: true,
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [methodForm, setMethodForm] = useState({
    name: '',
    type: 'both',
    icon: '',
    isActive: true,
    depositDetails: { address: '', network: '', additionalInfo: '' },
    withdrawalFields: []
  });

  // Load global settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading settings');
      }
    };
    fetchSettings();
  }, []);

  // Load payment methods
  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentMethods(data);
      }
    } catch (err) {
      toast.error('Error loading payment methods');
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Save global settings
  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving settings');
    }
  };

  // Save payment method (create or update)
  const handleSaveMethod = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = editingMethod 
        ? `${import.meta.env.VITE_API_URL}/admin/payment-methods/${editingMethod._id}`
        : `${import.meta.env.VITE_API_URL}/admin/payment-methods`;
      const method = editingMethod ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(methodForm)
      });
      if (res.ok) {
        toast.success(editingMethod ? 'Method updated' : 'Method created');
        fetchPaymentMethods();
        setShowMethodModal(false);
        resetMethodForm();
      } else {
        toast.error('Failed to save payment method');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving payment method');
    }
  };

  const handleDeleteMethod = async (id) => {
    if (!confirm('Delete this payment method? This will affect deposits/withdrawals.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Method deleted');
        fetchPaymentMethods();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error deleting method');
    }
  };

  const resetMethodForm = () => {
    setEditingMethod(null);
    setMethodForm({
      name: '',
      type: 'both',
      icon: '',
      isActive: true,
      depositDetails: { address: '', network: '', additionalInfo: '' },
      withdrawalFields: []
    });
  };

  const editMethod = (method) => {
    setEditingMethod(method);
    setMethodForm(method);
    setShowMethodModal(true);
  };

  const addWithdrawalField = () => {
    setMethodForm({
      ...methodForm,
      withdrawalFields: [...methodForm.withdrawalFields, { label: '', name: '', type: 'text', placeholder: '', required: true }]
    });
  };

  const updateWithdrawalField = (idx, key, value) => {
    const newFields = [...methodForm.withdrawalFields];
    newFields[idx][key] = value;
    setMethodForm({ ...methodForm, withdrawalFields: newFields });
  };

  const removeWithdrawalField = (idx) => {
    setMethodForm({
      ...methodForm,
      withdrawalFields: methodForm.withdrawalFields.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Settings</h1>

      {/* ===== GLOBAL SETTINGS CARD ===== */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          General Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Withdrawal Fee (%)</label>
              <input
                type="number"
                value={settings.withdrawalFee}
                onChange={(e) => setSettings({ ...settings, withdrawalFee: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Min Withdrawal ($)</label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Max Withdrawal ($)</label>
            <input
              type="number"
              value={settings.maxWithdrawal}
              onChange={(e) => setSettings({ ...settings, maxWithdrawal: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Maintenance Mode</label>
            <button
              onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                settings.maintenance ? 'bg-red-600' : 'bg-dark-100 hover:bg-dark-200'
              }`}
            >
              {settings.maintenance ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Registration</label>
            <button
              onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                settings.registrationEnabled ? 'bg-green-600' : 'bg-dark-100 hover:bg-dark-200'
              }`}
            >
              {settings.registrationEnabled ? 'Open' : 'Closed'}
            </button>
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* ===== PAYMENT METHODS CARD ===== */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Methods (Deposit / Withdrawal)
          </h2>
          <button
            onClick={() => { resetMethodForm(); setShowMethodModal(true); }}
            className="px-3 py-1.5 bg-primary rounded-lg text-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add Method
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No payment methods yet. Click "Add Method" to create one.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr className="text-left text-gray-400">
                  <th className="pb-2">Method</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((method) => (
                  <tr key={method._id} className="border-b border-gray-800">
                    <td className="py-3 flex items-center gap-2">
                      {method.icon && <img src={method.icon} className="w-6 h-6 rounded" alt="" />}
                      {method.name}
                    </td>
                    <td className="py-3 capitalize">{method.type}</td>
                    <td className="py-3">{method.isActive ? '✅ Active' : '❌ Inactive'}</td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => editMethod(method)} className="text-blue-400 hover:text-blue-300">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteMethod(method._id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Payment Method */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{editingMethod ? 'Edit' : 'Add'} Payment Method</h3>
              <button onClick={() => setShowMethodModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Method Name (e.g., USDT ERC20)"
                value={methodForm.name}
                onChange={(e) => setMethodForm({ ...methodForm, name: e.target.value })}
                className="w-full p-3 rounded bg-dark-200 border border-gray-700 text-white"
              />
              <select
                value={methodForm.type}
                onChange={(e) => setMethodForm({ ...methodForm, type: e.target.value })}
                className="w-full p-3 rounded bg-dark-200 border border-gray-700 text-white"
              >
                <option value="deposit">Deposit only</option>
                <option value="withdrawal">Withdrawal only</option>
                <option value="both">Both</option>
              </select>
              <input
                type="text"
                placeholder="Icon URL (optional)"
                value={methodForm.icon}
                onChange={(e) => setMethodForm({ ...methodForm, icon: e.target.value })}
                className="w-full p-3 rounded bg-dark-200 border border-gray-700 text-white"
              />
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={methodForm.isActive}
                  onChange={(e) => setMethodForm({ ...methodForm, isActive: e.target.checked })}
                />
                Active
              </label>

              {/* Deposit Details (shown for deposit or both) */}
              {(methodForm.type === 'deposit' || methodForm.type === 'both') && (
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Deposit Details</h4>
                  <input
                    type="text"
                    placeholder="Wallet Address"
                    value={methodForm.depositDetails.address}
                    onChange={(e) => setMethodForm({ ...methodForm, depositDetails: { ...methodForm.depositDetails, address: e.target.value } })}
                    className="w-full p-2 mb-2 rounded bg-dark-200 border border-gray-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Network (ERC20, TRC20, etc.)"
                    value={methodForm.depositDetails.network}
                    onChange={(e) => setMethodForm({ ...methodForm, depositDetails: { ...methodForm.depositDetails, network: e.target.value } })}
                    className="w-full p-2 mb-2 rounded bg-dark-200 border border-gray-700 text-white"
                  />
                  <textarea
                    placeholder="Additional info (optional)"
                    value={methodForm.depositDetails.additionalInfo}
                    onChange={(e) => setMethodForm({ ...methodForm, depositDetails: { ...methodForm.depositDetails, additionalInfo: e.target.value } })}
                    className="w-full p-2 rounded bg-dark-200 border border-gray-700 text-white"
                    rows="2"
                  />
                </div>
              )}

              {/* Withdrawal Fields (shown for withdrawal or both) */}
              {(methodForm.type === 'withdrawal' || methodForm.type === 'both') && (
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Withdrawal Fields</h4>
                    <button onClick={addWithdrawalField} className="text-primary text-sm">+ Add field</button>
                  </div>
                  {methodForm.withdrawalFields.map((field, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => updateWithdrawalField(idx, 'label', e.target.value)}
                        className="p-2 rounded bg-dark-200 border border-gray-700 text-white col-span-1"
                      />
                      <input
                        type="text"
                        placeholder="Name"
                        value={field.name}
                        onChange={(e) => updateWithdrawalField(idx, 'name', e.target.value)}
                        className="p-2 rounded bg-dark-200 border border-gray-700 text-white col-span-1"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateWithdrawalField(idx, 'type', e.target.value)}
                        className="p-2 rounded bg-dark-200 border border-gray-700 text-white col-span-1"
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Textarea</option>
                        <option value="email">Email</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Placeholder"
                        value={field.placeholder}
                        onChange={(e) => updateWithdrawalField(idx, 'placeholder', e.target.value)}
                        className="p-2 rounded bg-dark-200 border border-gray-700 text-white col-span-1"
                      />
                      <button onClick={() => removeWithdrawalField(idx)} className="text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {methodForm.withdrawalFields.length === 0 && (
                    <p className="text-gray-500 text-sm">No fields. Add fields to collect information from users during withdrawal.</p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowMethodModal(false)} className="px-4 py-2 rounded bg-gray-700 text-white">
                  Cancel
                </button>
                <button onClick={handleSaveMethod} className="px-4 py-2 rounded bg-primary text-white">
                  Save Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;