import { useState, useEffect } from 'react';
import { 
  Calendar, ArrowUp, ArrowDown, TrendingUp, 
  TrendingDown, Wallet, Settings, Clock, 
  Info, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Futures = () => {
  const [pair, setPair] = useState('BTC-USDT');
  const [leverage, setLeverage] = useState(10);
  const [position, setPosition] = useState('long');
  const [amount, setAmount] = useState('');
  const [margin, setMargin] = useState(100);
  const [balance, setBalance] = useState(10000);
  const [currentPrice, setCurrentPrice] = useState(65000);
  const [priceChange, setPriceChange] = useState(2.4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setCurrentPrice((prev) => Math.max(1000, prev + change));
      setPriceChange((prev) => prev + (Math.random() - 0.5) * 0.5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenPosition = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const marginRequired = parseFloat(amount) / leverage;
    if (marginRequired > balance) {
      toast.error(`Insufficient balance. Required margin: $${marginRequired.toFixed(2)}`);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/futures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pair,
          position,
          leverage,
          margin: marginRequired,
          size: parseFloat(amount),
          entryPrice: currentPrice,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${position === 'long' ? 'Long' : 'Short'} position opened`);
        setBalance(data.user?.balance ?? balance - marginRequired);
        setAmount('');
      } else {
        toast.error(data.message || 'Failed to open position');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleClosePosition = () => {
    toast.success('Position closed successfully!');
  };

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
        padding: '24px 32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', color: '#8a7060', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Futures Trading</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Futures Market
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Trade futures contracts with leverage. Manage your risk and maximize your potential.
          </p>
        </div>
      </div>

      {/* Trading Interface */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Chart & Price */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(249,115,22,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h3 style={{ color: '#fff', fontWeight: 500 }}>{pair}</h3>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                ${currentPrice.toLocaleString()}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: priceChange >= 0 ? '#22c55e' : '#ef4444'
              }}>
                {priceChange >= 0 ? <ArrowUp size={16} style={{ display: 'inline' }} /> : <ArrowDown size={16} style={{ display: 'inline' }} />}
                {' '}{Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              style={{
                background: 'rgba(249,115,22,0.05)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                borderRadius: '12px',
                padding: '6px 12px',
                fontSize: '13px'
              }}
            >
              <option value="BTC-USDT">BTC-USDT</option>
              <option value="ETH-USDT">ETH-USDT</option>
              <option value="SOL-USDT">SOL-USDT</option>
              <option value="BNB-USDT">BNB-USDT</option>
            </select>
          </div>
          <div style={{ padding: '16px', height: '384px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${pair.replace('-', '')}&symbol=${pair.replace('-', '')}&interval=1&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc/UTC&studies=[]`}
                style={{ height: '100%', width: '100%', border: 'none' }}
                title="TradingView Chart"
              />
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(249,115,22,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{ color: '#fff', fontWeight: 500 }}>Order</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPosition('long')}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  borderRadius: '999px',
                  background: position === 'long' ? '#f97316' : 'rgba(249,115,22,0.08)',
                  color: position === 'long' ? '#fff' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Long
              </button>
              <button
                onClick={() => setPosition('short')}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  borderRadius: '999px',
                  background: position === 'short' ? '#ef4444' : 'rgba(249,115,22,0.08)',
                  color: position === 'short' ? '#fff' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Short
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Leverage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#8a7060' }}>Leverage</span>
                <span style={{ color: '#fff' }}>{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                style={{ width: '100%', marginTop: '8px' }}
                className="accent-orange"
              />
              <style>{`.accent-orange { accent-color: #f97316; }`}</style>
            </div>

            {/* Amount */}
            <div>
              <label style={{ fontSize: '13px', color: '#8a7060' }}>Position Size (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '12px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(249,115,22,0.2)',
                  color: '#fff',
                  outline: 'none'
                }}
                placeholder="0.00"
              />
            </div>

            {/* Margin Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8a7060' }}>Required Margin</span>
                <span style={{ color: '#fff' }}>${((parseFloat(amount) || 0) / leverage).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8a7060' }}>Available Balance</span>
                <span style={{ color: '#fff' }}>${balance.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8a7060' }}>Liquidation Price</span>
                <span style={{ color: '#ef4444' }}>
                  ${(currentPrice * (1 - 1 / leverage * (position === 'long' ? 1 : -1))).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
              <button
                onClick={handleOpenPosition}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  background: position === 'long' ? '#f97316' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Open {position === 'long' ? 'Long' : 'Short'} Position
              </button>
              <button
                onClick={handleClosePosition}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  background: 'rgba(249,115,22,0.08)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.08)'}
              >
                Close Position
              </button>
            </div>

            <p style={{ fontSize: '10px', textAlign: 'center', color: '#6a4a30' }}>
              Trading futures involves significant risk. Please manage your risk carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: '16px' }}>Market Information</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Funding Rate</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>0.01%</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Open Interest</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>$1.2B</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>24h Volume</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>$5.6B</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Mark Price</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>${currentPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures;