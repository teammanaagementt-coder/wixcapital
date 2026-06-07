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

  const handleOrder = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const currentPrice = cryptoData?.market_data?.current_price?.usd || 0;
    const cost = parseFloat(amount) * currentPrice;
    
    if (orderType === 'buy') {
      if (cost > balance) {
        toast.error('Insufficient balance for this purchase');
        return;
      }
      toast.success(`Bought ${amount} ${symbol} for $${cost.toFixed(2)}`);
    } else {
      toast.success(`Sold ${amount} ${symbol} for $${cost.toFixed(2)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading trading data...</p>
        </div>
      </div>
    );
  }

  const currentPrice = cryptoData?.market_data?.current_price?.usd || 0;
  const priceChange = cryptoData?.market_data?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{cryptoData?.name || symbol} Trading</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold text-white">{symbol}</h1>
                <div className="text-2xl font-bold text-white">
                  ${currentPrice.toLocaleString()}
                </div>
                <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-danger'}`}>
                  {isPositive ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                  {Math.abs(priceChange).toFixed(2)}%
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <span className="mr-4">24h High: ${cryptoData?.market_data?.high_24h?.usd?.toLocaleString() || '0'}</span>
                <span>24h Low: ${cryptoData?.market_data?.low_24h?.usd?.toLocaleString() || '0'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-dark-100 border border-gray-800">
              <Wallet className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-gray-400">Balance</p>
                <p className="text-lg font-semibold text-white">${balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pair Selector */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search pair to switch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-100 border border-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto max-w-full md:max-w-md">
            {filteredCoins.slice(0, 5).map((coin) => (
              <button
                key={coin.id}
                onClick={() => handlePairChange(`${coin.symbol.toUpperCase()}-USDT`)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  symbol === `${coin.symbol.toUpperCase()}-USDT`
                    ? 'bg-primary text-white'
                    : 'bg-dark-100 text-gray-400 hover:text-white hover:bg-dark-200'
                }`}
              >
                {coin.symbol.toUpperCase()}/USDT
              </button>
            ))}
            {filteredCoins.length > 5 && (
              <span className="text-xs text-gray-500 flex items-center px-2">
                +{filteredCoins.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart (Left) */}
        <div className="lg:col-span-2 bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-medium">Price Chart</h3>
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
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-medium">Order</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('buy')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  orderType === 'buy'
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setOrderType('sell')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  orderType === 'sell'
                    ? 'bg-danger text-white'
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Price */}
            <div>
              <label className="text-sm text-gray-400">Price (USDT)</label>
              <input
                type="number"
                value={price || currentPrice}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-gray-400">Amount ({symbol.split('-')[0]})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Total */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Cost</span>
              <span className="text-white">
                ${((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)).toFixed(2)}
              </span>
            </div>

            {/* Fee */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee (0.1%)</span>
              <span className="text-white">
                ${(((parseFloat(amount) || 0) * (parseFloat(price) || currentPrice)) * 0.001).toFixed(2)}
              </span>
            </div>

            {/* Order Button */}
            <button
              onClick={handleOrder}
              className={`w-full py-4 rounded-xl font-medium text-white transition-all duration-300 ${
                orderType === 'buy'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-danger hover:bg-danger-600'
              }`}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} {symbol.split('-')[0]}
            </button>

            <p className="text-xs text-center text-gray-500">
              By placing an order, you agree to our terms
            </p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Market Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-400">Market Cap</p>
            <p className="text-white font-medium">${cryptoData?.market_data?.market_cap?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Volume (24h)</p>
            <p className="text-white font-medium">${cryptoData?.market_data?.total_volume?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Circulating Supply</p>
            <p className="text-white font-medium">{cryptoData?.market_data?.circulating_supply?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">All Time High</p>
            <p className="text-white font-medium">${cryptoData?.market_data?.ath?.usd?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;