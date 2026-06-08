import { useState } from 'react';
import { 
  Calendar, User, Shield, Key, Bell, 
  Globe, Eye, Lock, CreditCard, 
  Smartphone, LogOut, AlertTriangle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Low Income',
    email: 'lowincomehomes47@gmail.com',
    phone: '+1 234 567 8900',
    address: '123 Crypto Street, Blockchain City',
    currency: 'USD',
    language: 'English',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error('Network error');
  }
};

  const handleChangePassword = () => toast.success('Password change instructions sent to your email.');
  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(`2FA ${twoFactorEnabled ? 'disabled' : 'enabled'}`);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'api', label: 'API', icon: Key },
    { id: 'account', label: 'Account', icon: AlertTriangle },
  ];

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Account Settings</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">Manage your account preferences, security, and notifications.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-4">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[rgba(0,200,150,0.08)] text-[#00c896]'
                    : 'text-[#6b6b85] hover:bg-[#1a1a28] hover:text-[#e8e8f0]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#6b6b85]">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#6b6b85]">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#6b6b85]">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#6b6b85]">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  />
                </div>
                <button onClick={handleSaveProfile} className="px-6 py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-[#00c896]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Change Password</p>
                      <p className="text-xs text-[#6b6b85]">Update your login password</p>
                    </div>
                  </div>
                  <button onClick={handleChangePassword} className="px-4 py-2 rounded-lg bg-[#00c896] hover:bg-[#00dea8] text-black text-sm">Update</button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#00c896]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-[#6b6b85]">{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      twoFactorEnabled ? 'bg-[#ff5b6e] text-white' : 'bg-[#00c896] text-black'
                    }`}
                  >
                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#00c896]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Push Notifications</p>
                      <p className="text-xs text-[#6b6b85]">Receive notifications on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      notificationsEnabled ? 'bg-[#00c896] text-black' : 'bg-[#1a1a28] text-[#e8e8f0]'
                    }`}
                  >
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#00c896]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Email Notifications</p>
                      <p className="text-xs text-[#6b6b85]">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      emailNotifications ? 'bg-[#00c896] text-black' : 'bg-[#1a1a28] text-[#e8e8f0]'
                    }`}
                  >
                    {emailNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#6b6b85]">Currency</label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-[#6b6b85]">Language</label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <button onClick={handleSaveProfile} className="px-6 py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">API Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <p className="text-[#e8e8f0] font-medium mb-2">API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="********-****-****-****-************"
                      className="flex-1 p-2 rounded-lg bg-[#1a1a28] border border-[#1a1a28] text-[#6b6b85] text-sm"
                    />
                    <button className="px-4 py-2 rounded-lg bg-[#00c896] hover:bg-[#00dea8] text-black text-sm font-medium">
                      Copy
                    </button>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium">
                  Generate New Key
                </button>
                <button className="px-6 py-3 rounded-xl bg-[#ff5b6e] hover:bg-[#ff7b8b] text-white font-medium">
                  Revoke All Keys
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#e8e8f0]">Account Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#ff5b6e]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Delete Account</p>
                      <p className="text-xs text-[#6b6b85]">Permanently delete your account and all associated data</p>
                    </div>
                  </div>
                  <button className="mt-3 px-6 py-2 rounded-lg bg-[#ff5b6e] hover:bg-[#ff7b8b] text-white text-sm font-medium">
                    Delete Account
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-[#00c896]" />
                    <div>
                      <p className="text-[#e8e8f0] font-medium">Logout</p>
                      <p className="text-xs text-[#6b6b85]">Sign out of your account on this device</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="mt-3 px-6 py-2 rounded-lg bg-[#00c896] hover:bg-[#00dea8] text-black text-sm font-medium">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;