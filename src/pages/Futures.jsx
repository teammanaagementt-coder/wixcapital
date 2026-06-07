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

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 100;
      setCurrentPrice((prev) => Math.max(1000, prev + change));
      setPriceChange((prev) => prev + (Math.random() - 0.5) * 0.5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenPosition = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const requiredMargin = parseFloat(amount) / leverage;
    if (requiredMargin > balance) {
      toast.error(`Insufficient balance. Required margin: $${requiredMargin.toFixed(2)}`);
      return;
    }
    toast.success(
      `Opened ${position === 'long' ? 'Long' : 'Short'} position for ${amount} USDT with ${leverage}x leverage`
    );
    setBalance((prev) => prev - requiredMargin);
    setAmount('');
  };

  const handleClosePosition = () => {
    toast.success('Position closed successfully!');
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Futures Trading</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Futures Market</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Trade futures contracts with leverage. Manage your risk and maximize your potential.
          </p>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart & Price (Left) */}
        <div className="lg:col-span-2 bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-white font-medium">{pair}</h3>
              <div className="text-lg font-bold text-white">
                ${currentPrice.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-danger'}`}>
                {priceChange >= 0 ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="bg-dark-100 border border-gray-800 text-white rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="BTC-USDT">BTC-USDT</option>
                <option value="ETH-USDT">ETH-USDT</option>
                <option value="SOL-USDT">SOL-USDT</option>
                <option value="BNB-USDT">BNB-USDT</option>
              </select>
            </div>
          </div>
          <div className="p-4 h-96">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${pair.replace('-', '')}&symbol=${pair.replace('-', '')}&interval=1&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc/UTC&studies=[]`}
                style={{ height: '100%', width: '100%', border: 'none' }}
                title="TradingView Chart"
              />
            </div>
          </div>
        </div>

        {/* Order Form (Right) */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-medium">Order</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPosition('long')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  position === 'long'
                    ? 'bg-green-500 text-white'
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setPosition('short')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  position === 'short'
                    ? 'bg-danger text-white'
                    : 'bg-dark-100 text-gray-400 hover:text-white'
                }`}
              >
                Short
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Leverage */}
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Leverage</span>
                <span className="text-white">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full mt-2 accent-primary"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-gray-400">Position Size (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Margin Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Required Margin</span>
                <span className="text-white">
                  ${((parseFloat(amount) || 0) / leverage).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available Balance</span>
                <span className="text-white">${balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Liquidation Price</span>
                <span className="text-danger">
                  ${(currentPrice * (1 - 1 / leverage * (position === 'long' ? 1 : -1))).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOpenPosition}
                className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
                  position === 'long'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-danger hover:bg-danger-600'
                }`}
              >
                Open {position === 'long' ? 'Long' : 'Short'} Position
              </button>
              <button
                onClick={handleClosePosition}
                className="w-full py-3 rounded-xl bg-dark-100 hover:bg-dark-200 text-white font-medium"
              >
                Close Position
              </button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Trading futures involves significant risk. Please manage your risk carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Market Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-400">Funding Rate</p>
            <p className="text-white font-medium">0.01%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Open Interest</p>
            <p className="text-white font-medium">$1.2B</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">24h Volume</p>
            <p className="text-white font-medium">$5.6B</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Mark Price</p>
            <p className="text-white font-medium">${currentPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures;