import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, TrendingUp, TrendingDown, ExternalLink, 
  Search, Star, ArrowUpRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Markets = () => {
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
        );
        const data = await res.json();
        setCryptoData(data);
      } catch (err) {
        toast.error('Failed to load crypto data');
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoData();
  }, []);

  const filteredData = cryptoData.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTrade = (coin) => {
    navigate(`/dashboard/trade?symbol=${coin.symbol.toUpperCase()}-USDT`);
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
              <span>Live Markets</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6a4a30' }}>Real-time crypto prices</div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Market Overview
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Explore top cryptocurrencies and start trading.
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '16px'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6a4a30' }} />
          <input
            type="text"
            placeholder="Search cryptocurrency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
          />
        </div>
      </div>

      {/* Crypto Table */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(249,115,22,0.03)', color: '#8a7060', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>#</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 500 }}>Price</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 500 }}>24h Change</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 500 }}>Market Cap</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 500 }}>Volume (24h)</th>
                <th style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 500 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px 24px', textAlign: 'center', color: '#8a7060' }}>Loading markets...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '32px 24px', textAlign: 'center', color: '#8a7060' }}>No cryptocurrencies found</td>
                </tr>
              ) : (
                filteredData.map((coin, index) => {
                  const priceChange = coin.price_change_percentage_24h ?? 0;
                  const isPositive = priceChange >= 0;
                  return (
                    <tr key={coin.id} style={{ borderTop: '1px solid rgba(249,115,22,0.05)' }}>
                      <td style={{ padding: '16px 24px', color: '#8a7060', fontSize: '13px' }}>{index + 1}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={coin.image} alt={coin.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                          <div>
                            <p style={{ fontWeight: 500, color: '#fff' }}>{coin.name}</p>
                            <p style={{ fontSize: '11px', color: '#8a7060', textTransform: 'uppercase' }}>{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#fff', fontWeight: 500 }}>
                        ${coin.current_price?.toLocaleString() ?? '0.00'}
                      </td>
                      <td style={{
                        padding: '16px 24px',
                        textAlign: 'right',
                        fontWeight: 500,
                        color: isPositive ? '#22c55e' : '#ef4444'
                      }}>
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#8a7060', fontSize: '13px' }}>
                        ${coin.market_cap?.toLocaleString() ?? '0'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', color: '#8a7060', fontSize: '13px' }}>
                        ${coin.total_volume?.toLocaleString() ?? '0'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleTrade(coin)}
                          style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '999px',
                            background: '#f97316',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Markets;