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
    <div style={{
      padding: '24px',
      overflowX: 'hidden',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: "'Syne', sans-serif",
      background: '#0d0600',
      minHeight: '100vh'
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px 32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', color: '#8a7060', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Settings</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Account Settings
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Manage your account preferences, security, and notifications.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  width: '100%',
                  textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(249,115,22,0.08)' : 'transparent',
                  color: activeTab === tab.id ? '#f97316' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(249,115,22,0.05)';
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                <tab.icon size={18} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Profile Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '999px',
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Lock size={20} style={{ color: '#f97316' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Change Password</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>Update your login password</p>
                    </div>
                  </div>
                  <button
                    onClick={handleChangePassword}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      background: '#f97316',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Update
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Shield size={20} style={{ color: '#f97316' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Two-Factor Authentication</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleEnable2FA}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      background: twoFactorEnabled ? '#ef4444' : '#f97316',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Bell size={20} style={{ color: '#f97316' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Push Notifications</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>Receive notifications on your device</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      background: notificationsEnabled ? '#f97316' : 'rgba(249,115,22,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {notificationsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Smartphone size={20} style={{ color: '#f97316' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Email Notifications</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '999px',
                      background: emailNotifications ? '#f97316' : 'rgba(249,115,22,0.2)',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {emailNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Currency</label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#8a7060' }}>Language</label>
                  <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '12px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(249,115,22,0.2)',
                      color: '#fff'
                    }}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '999px',
                    background: '#f97316',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>API Management</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <p style={{ color: '#fff', fontWeight: 500, marginBottom: '8px' }}>API Key</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value="********-****-****-****-************"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(249,115,22,0.2)',
                        color: '#8a7060',
                        fontSize: '12px'
                      }}
                    />
                    <button style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      background: '#f97316',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}>
                      Copy
                    </button>
                  </div>
                </div>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: '#f97316',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}>
                  Generate New Key
                </button>
                <button style={{
                  padding: '12px 24px',
                  borderRadius: '999px',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}>
                  Revoke All Keys
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Account Management</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={20} style={{ color: '#ef4444' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Delete Account</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>Permanently delete your account and all associated data</p>
                    </div>
                  </div>
                  <button style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer'
                  }}>
                    Delete Account
                  </button>
                </div>
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(249,115,22,0.03)',
                  border: '1px solid rgba(249,115,22,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <LogOut size={20} style={{ color: '#f97316' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 500 }}>Logout</p>
                      <p style={{ fontSize: '11px', color: '#8a7060' }}>Sign out of your account on this device</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      background: '#f97316',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
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