import { useState } from 'react';
import { Shield, Save, Key, Bell, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Wix Capital',
    supportEmail: 'support@wixcapital.com',
    withdrawalFee: '10',
    minWithdrawal: '50',
    maxWithdrawal: '100000',
    maintenance: false,
    registrationEnabled: true,
  });

  const handleSave = async () => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Admin Settings</h1>

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
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Withdrawal Fee (%)</label>
              <input
                type="number"
                value={settings.withdrawalFee}
                onChange={(e) => setSettings({ ...settings, withdrawalFee: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Min Withdrawal ($)</label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400">Max Withdrawal ($)</label>
            <input
              type="number"
              value={settings.maxWithdrawal}
              onChange={(e) => setSettings({ ...settings, maxWithdrawal: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-400">Maintenance Mode</label>
            <button
              onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })}
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                settings.maintenance ? 'bg-danger' : 'bg-dark-100 hover:bg-dark-200'
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
                settings.registrationEnabled ? 'bg-green-500' : 'bg-dark-100 hover:bg-dark-200'
              }`}
            >
              {settings.registrationEnabled ? 'Open' : 'Closed'}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;