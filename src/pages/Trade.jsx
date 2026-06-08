import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, ArrowUp, ArrowDown, Clock, Info, 
  TrendingUp, TrendingDown, DollarSign, Wallet, Search 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Trade = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const symbol = searchParams.get('symbol') || 'BTC-USDT';
  
  const [cryptoData, setCryptoData] = useState(null);
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [balance, setBalance] = useState(10000);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        const data = await res.json();
        setAllCoins(data);
      } catch (err) {
        console.error('Failed to fetch coin list');
      }
    };
    fetchAllCoins();
  }, []);

  useEffect(() => {
    const fetchCryptoData = async () => {
      setLoading(true);
      try {
        const base = symbol.split('-')[0].toLowerCase();
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${base}`
        );
        const data = await res.json();
        setCryptoData(data);
      } catch (err) {
        toast.error('Failed to load trading data');
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoData();
  }, [symbol]);

  const filteredCoins = allCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePairChange = (newSymbol) => {
    setSearchParams({ symbol: newSymbol });
    setAmount('');
    setPrice('');
  };

  const handleOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const token = localStorage.getItem('token');
    const orderPrice = parseFloat(price) || currentPrice;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol,
          type: orderType,
          amount: parseFloat(amount),
          price: orderPrice,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${orderType === 'buy' ? 'Bought' : 'Sold'} ${amount} ${symbol}`);
        if (data.user?.balance !== undefined) setBalance(data.user.balance);
        setAmount('');
        setPrice('');
      } else {
        toast.error(data.message || 'Trade failed');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

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

  const currentPrice = cryptoData?.market_data?.current_price?.usd || 0;
  const priceChange = cryptoData?.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', color: '#8a7060', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                <span>{cryptoData?.name || symbol} Trading</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff' }}>{symbol}</h1>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>
                ${currentPrice.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: isPositive ? '#22c55e' : '#ef4444' }}>
                {isPositive ? <ArrowUp size={16} style={{ display: 'inline' }} /> : <ArrowDown size={16} style={{ display: 'inline' }} />}
                {' '}{Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#8a7060' }}>
              <span style={{ marginRight: '16px' }}>24h High: ${cryptoData?.market_data?.high_24h?.usd?.toLocaleString() || '0'}</span>
              <span>24h Low: ${cryptoData?.market_data?.low_24h?.usd?.toLocaleString() || '0'}</span>
            </div>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '16px',
            background: 'rgba(249,115,22,0.05)',
            border: '1px solid rgba(249,115,22,0.15)',
            alignSelf: 'flex-start'
          }}>
            <Wallet size={20} style={{ color: '#f97316' }} />
            <div>
              <p style={{ fontSize: '11px', color: '#8a7060' }}>Balance</p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>${balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pair Selector */}
      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6a4a30' }} />
            <input
              type="text"
              placeholder="Search pair to switch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                outline: 'none'
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#f97316'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.2)'}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {filteredCoins.slice(0, 5).map((coin) => (
              <button
                key={coin.id}
                onClick={() => handlePairChange(`${coin.symbol.toUpperCase()}-USDT`)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  background: symbol === `${coin.symbol.toUpperCase()}-USDT` ? '#f97316' : 'rgba(249,115,22,0.08)',
                  color: symbol === `${coin.symbol.toUpperCase()}-USDT` ? '#fff' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {coin.symbol.toUpperCase()}/USDT
              </button>
            ))}
            {filteredCoins.length > 5 && (
              <span style={{ fontSize: '11px', color: '#6a4a30', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                +{filteredCoins.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Chart */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)' }}>
            <h3 style={{ color: '#fff', fontWeight: 500 }}>Price Chart</h3>
          </div>
          <div style={{ padding: '16px', height: '384px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${symbol.replace('-', '')}&symbol=${symbol.replace('-', '')}&interval=1&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc/UTC&studies=[]`}
                style={{ height: '100%', width: '100%', border: 'none' }}
                title="TradingView Chart"
              />
            </div>
          </div>
        </div>

        {/* Order Book */}
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(249,115,22,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#fff', fontWeight: 500 }}>Order</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setOrderType('buy')}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  borderRadius: '999px',
                  transition: 'all 0.2s',
                  background: orderType === 'buy' ? '#f97316' : 'rgba(249,115,22,0.08)',
                  color: orderType === 'buy' ? '#fff' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType('sell')}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  borderRadius: '999px',
                  transition: 'all 0.2s',
                  background: orderType === 'sell' ? '#ef4444' : 'rgba(249,115,22,0.08)',
                  color: orderType === 'sell' ? '#fff' : '#8a7060',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sell
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Price */}
            <div>
              <label style={{ fontSize: '13px', color: '#8a7060' }}>Price (USDT)</label>
              <input
                type="number"
                value={price || currentPrice}
                onChange={(e) => setPrice(e.target.value)}
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

            {/* Amount */}
            <div>
              <label style={{ fontSize: '13px', color: '#8a7060' }}>Amount ({symbol.split('-')[0]})</label>
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

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#8a7060' }}>Total Cost</span>
              <span style={{ color: '#fff' }}>${((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)).toFixed(2)}</span>
            </div>

            {/* Fee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#8a7060' }}>Fee (0.1%)</span>
              <span style={{ color: '#fff' }}>${(((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)) * 0.001).toFixed(2)}</span>
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '999px',
                fontWeight: 600,
                transition: 'all 0.3s',
                background: orderType === 'buy' ? '#f97316' : '#ef4444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} {symbol.split('-')[0]}
            </button>

            <p style={{ fontSize: '11px', textAlign: 'center', color: '#6a4a30' }}>By placing an order, you agree to our terms</p>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Market Cap</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>${cryptoData?.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Volume (24h)</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>${cryptoData?.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>Circulating Supply</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>{cryptoData?.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#8a7060' }}>All Time High</p>
            <p style={{ color: '#fff', fontWeight: 500 }}>${cryptoData?.market_data?.ath?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;