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

  // Fetch all coins for pair selector
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

  // Fetch specific crypto data
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
        type: orderType,           // 'buy' or 'sell'
        amount: parseFloat(amount),
        price: orderPrice,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success(`${orderType === 'buy' ? 'Bought' : 'Sold'} ${amount} ${symbol}`);
      // Update local balance from the backend response
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
      <div className="flex items-center justify-center min-h-screen" style={{ fontFamily: "'Syne', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c896] mx-auto"></div>
          <p className="mt-4 text-[#6b6b85]">Loading trading data...</p>
        </div>
      </div>
    );
  }

  const currentPrice = cryptoData?.market_data?.current_price?.usd || 0;
  const priceChange = cryptoData?.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{cryptoData?.name || symbol} Trading</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold text-[#e8e8f0]">{symbol}</h1>
                <div className="text-2xl font-bold text-[#e8e8f0]">
                  ${currentPrice.toLocaleString()}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-[#00c896]' : 'text-[#ff5b6e]'}`}>
                  {isPositive ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
              <div className="mt-2 text-sm text-[#6b6b85]">
                <span className="mr-4">24h High: ${cryptoData?.market_data?.high_24h?.usd?.toLocaleString() || '0'}</span>
                <span>24h Low: ${cryptoData?.market_data?.low_24h?.usd?.toLocaleString() || '0'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0c0c16] border border-[#1a1a28]">
              <Wallet className="w-5 h-5 text-[#00c896]" />
              <div>
                <p className="text-xs text-[#6b6b85]">Balance</p>
                <p className="text-lg font-semibold text-[#e8e8f0]">${balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pair Selector */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a4a64]" />
            <input
              type="text"
              placeholder="Search pair to switch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] focus:ring-2 focus:ring-[#00c896] focus:border-transparent text-[#e8e8f0] placeholder-[#4a4a64]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-full md:max-w-md">
            {filteredCoins.slice(0, 5).map((coin) => (
              <button
                key={coin.id}
                onClick={() => handlePairChange(`${coin.symbol.toUpperCase()}-USDT`)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  symbol === `${coin.symbol.toUpperCase()}-USDT`
                    ? 'bg-[#00c896] text-black'
                    : 'bg-[#0c0c16] text-[#6b6b85] hover:text-[#e8e8f0] hover:bg-[#1a1a28]'
                }`}
              >
                {coin.symbol.toUpperCase()}/USDT
              </button>
            ))}
            {filteredCoins.length > 5 && (
              <span className="text-xs text-[#4a4a64] flex items-center px-2">
                +{filteredCoins.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart (Left) */}
        <div className="lg:col-span-2 bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28]">
            <h3 className="text-[#e8e8f0] font-medium">Price Chart</h3>
          </div>
          <div className="p-4 h-96">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${symbol.replace('-', '')}&symbol=${symbol.replace('-', '')}&interval=1&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc/UTC&studies=[]`}
                style={{ height: '100%', width: '100%', border: 'none' }}
                title="TradingView Chart"
              />
            </div>
          </div>
        </div>

        {/* Order Book / Buy Sell (Right) */}
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center justify-between">
            <h3 className="text-[#e8e8f0] font-medium">Order</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('buy')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  orderType === 'buy'
                    ? 'bg-[#00c896] text-black'
                    : 'bg-[#0c0c16] text-[#6b6b85] hover:text-[#e8e8f0]'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  orderType === 'sell'
                    ? 'bg-[#ff5b6e] text-white'
                    : 'bg-[#0c0c16] text-[#6b6b85] hover:text-[#e8e8f0]'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Price */}
            <div>
              <label className="text-sm text-[#6b6b85]">Price (USDT)</label>
              <input
                type="number"
                value={price || currentPrice}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-[#6b6b85]">Amount ({symbol.split('-')[0]})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm">
              <span className="text-[#6b6b85]">Total Cost</span>
              <span className="text-[#e8e8f0]">
                ${((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)).toFixed(2)}
              </span>
            </div>

            {/* Fee */}
            <div className="flex justify-between text-sm">
              <span className="text-[#6b6b85]">Fee (0.1%)</span>
              <span className="text-[#e8e8f0]">
                ${(((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)) * 0.001).toFixed(2)}
              </span>
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                orderType === 'buy'
                  ? 'bg-[#00c896] text-black hover:bg-[#00dea8]'
                  : 'bg-[#ff5b6e] text-white hover:bg-[#ff7b8b]'
              }`}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} {symbol.split('-')[0]}
            </button>

            <p className="text-xs text-center text-[#4a4a64]">
              By placing an order, you agree to our terms
            </p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-[#e8e8f0] font-medium mb-4">Market Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[#6b6b85]">Market Cap</p>
            <p className="text-[#e8e8f0] font-medium">${cryptoData?.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">Volume (24h)</p>
            <p className="text-[#e8e8f0] font-medium">${cryptoData?.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">Circulating Supply</p>
            <p className="text-[#e8e8f0] font-medium">{cryptoData?.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">All Time High</p>
            <p className="text-[#e8e8f0] font-medium">${cryptoData?.market_data?.ath?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;