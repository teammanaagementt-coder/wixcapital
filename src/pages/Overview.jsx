import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, DollarSign, TrendingUp, Users, 
  Calendar, Clock, PieChart, Activity, 
  ArrowUpRight, ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Overview = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserData(data.user);
        } else {
          toast.error('Failed to load dashboard data');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    const pollInterval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(pollInterval);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const stats = [
    {
      label: 'AVAILABLE BALANCE',
      value: userData ? `$${userData.balance.toFixed(2)}` : '$0',
      sub: userData && userData.balance > 0 ? 'Available funds' : 'Add funds to start',
      subColor: userData && userData.balance > 0 ? '#f97316' : '#ff5b6e',
      icon: Wallet,
    },
    {
      label: 'TOTAL INVESTED',
      value: userData ? `$${userData.totalDeposited?.toFixed(2) || '0.00'}` : '$0',
      sub: '—',
      subColor: '#6a4a30',
      icon: DollarSign,
    },
    {
      label: 'ACTIVE INVESTMENTS',
      value: '0',
      sub: '0 confirmed',
      subColor: '#f97316',
      icon: TrendingUp,
    },
    {
      label: 'REFERRAL EARNINGS',
      value: userData ? `$${userData.referralEarnings?.toFixed(2) || '0.00'}` : '$0',
      sub: `${userData?.totalReferrals || 0} referrals`,
      subColor: '#f97316',
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0d0600',
        fontFamily: "'Syne', sans-serif"
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(249,115,22,0.2)',
          borderTopColor: '#f97316',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

      {/* Header */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
            color: '#8a7060',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              <span>{formattedTime}</span>
            </div>
          </div>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '8px'
          }}>
            Welcome back, {userData?.name || 'User'}!
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '24px', maxWidth: '500px', fontSize: '14px' }}>
            Start building your investment portfolio with exciting IPO opportunities.
          </p>
          <button style={{
            background: '#f97316',
            color: '#fff',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.25s',
            fontSize: '14px'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
            <span>Explore Revenue Engines</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: '#0a0400',
            border: '1px solid rgba(249,115,22,0.09)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#8a7060', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <div style={{ padding: '8px', background: 'rgba(249,115,22,0.08)', borderRadius: '10px' }}>
                <stat.icon size={16} color="#f97316" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: stat.subColor }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Portfolio Value */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 700, color: '#fff' }}>Portfolio Value</h3>
            <span style={{ fontSize: '11px', color: '#f97316', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={12} /> +0% this period
            </span>
          </div>
          <div style={{ height: '180px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 500 150" style={{ width: '100%', height: '100%' }}>
              <path
                d="M0,100 L50,80 L100,90 L150,50 L200,60 L250,30 L300,70 L350,40 L400,80 L450,60 L500,90"
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#6a4a30'
            }}>
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontSize: '10px',
              color: '#6a4a30'
            }}>
              <span>$0k</span><span>$0k</span><span>$0k</span><span>$0k</span>
            </div>
          </div>
        </div>

        {/* Sector Allocation */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="#f97316" />
            Sector Allocation
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '2px solid rgba(249,115,22,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <PieChart size={32} color="#6a4a30" />
            </div>
            <p style={{ color: '#8a7060', fontSize: '13px' }}>No investments yet</p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Promo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Activity */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#f97316" />
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '1px solid rgba(249,115,22,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Activity size={24} color="#6a4a30" />
            </div>
            <p style={{ color: '#8a7060', fontWeight: 500, marginBottom: '4px' }}>No activity yet</p>
            <p style={{ color: '#6a4a30', fontSize: '12px' }}>Start by exploring the marketplace</p>
          </div>
        </div>

        {/* Orbital Alpha Promo */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '24px',
          background: 'linear-gradient(135deg, #1a0e00, #0d0600)',
          border: '1px solid rgba(249,115,22,0.2)'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '4px', height: '4px', background: '#f97316', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '20%', right: '20%', width: '2px', height: '2px', background: '#f97316', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: '3px', height: '3px', background: '#f97316', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, opacity: 0.1, color: '#fff' }}>X</div>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Orbital Alpha</h3>
            <p style={{ color: '#8a7060', fontSize: '13px', marginBottom: '24px', maxWidth: '400px', lineHeight: 1.6 }}>
              Revolutionary satellite constellation management platform providing real-time orbital tracking and collision avoidance systems for the growing space economy.
            </p>
            <button style={{
              background: '#f97316',
              color: '#fff',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
            onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
              <span>View Details</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;