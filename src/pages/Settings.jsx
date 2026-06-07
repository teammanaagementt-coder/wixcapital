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

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    toast.success('Password change instructions sent to your email.');
  };

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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Manage your account preferences, security, and notifications.
          </p>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-4">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-400 hover:bg-dark-100 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-dark-50/90 border border-gray-800 rounded-xl p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-xs text-gray-400">Update your login password</p>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white text-sm"
                  >
                    Update
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400">
                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    className={`px-4 py-2 rounded-lg text-white text-sm ${
                      twoFactorEnabled
                        ? 'bg-danger hover:bg-danger-600'
                        : 'bg-primary hover:bg-primary-600'
                    }`}
                  >
                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Session Management</p>
                      <p className="text-xs text-gray-400">Manage your active sessions</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-dark-200 hover:bg-dark-300 text-white text-sm">
                    View Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-xs text-gray-400">Receive notifications on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`px-4 py-2 rounded-lg text-white text-sm ${
                      notificationsEnabled
                        ? 'bg-primary hover:bg-primary-600'
                        : 'bg-dark-200 hover:bg-dark-300'
                    }`}
                  >
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-xs text-gray-400">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`px-4 py-2 rounded-lg text-white text-sm ${
                      emailNotifications
                        ? 'bg-primary hover:bg-primary-600'
                        : 'bg-dark-200 hover:bg-dark-300'
                    }`}
                  >
                    {emailNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Currency</label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Language</label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* API Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">API Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <p className="text-white font-medium mb-2">API Key</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="********-****-****-****-************"
                      className="flex-1 p-2 rounded-lg bg-dark-200 border border-gray-800 text-gray-400 text-sm"
                    />
                    <button className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white text-sm">
                      Copy
                    </button>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium">
                  Generate New Key
                </button>
                <button className="px-6 py-3 rounded-xl bg-danger hover:bg-danger-600 text-white font-medium">
                  Revoke All Keys
                </button>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Account Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger" />
                    <div>
                      <p className="text-white font-medium">Delete Account</p>
                      <p className="text-xs text-gray-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>
                  <button className="mt-3 px-6 py-2 rounded-lg bg-danger hover:bg-danger-600 text-white text-sm">
                    Delete Account
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-dark-100 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-white font-medium">Logout</p>
                      <p className="text-xs text-gray-400">
                        Sign out of your account on this device
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-3 px-6 py-2 rounded-lg bg-primary hover:bg-primary-600 text-white text-sm"
                  >
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