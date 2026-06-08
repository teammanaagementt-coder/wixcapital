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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Futures Trading</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Futures Market</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Trade futures contracts with leverage. Manage your risk and maximize your potential.
          </p>
        </div>
      </div>

      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart & Price (Left) */}
        <div className="lg:col-span-2 bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-[#e8e8f0] font-medium">{pair}</h3>
              <div className="text-lg font-bold text-[#e8e8f0]">
                ${currentPrice.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${priceChange >= 0 ? 'text-[#00c896]' : 'text-[#ff5b6e]'}`}>
                {priceChange >= 0 ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] rounded-lg px-3 py-1.5 text-sm"
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
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center justify-between">
            <h3 className="text-[#e8e8f0] font-medium">Order</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPosition('long')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  position === 'long'
                    ? 'bg-[#00c896] text-black'
                    : 'bg-[#0c0c16] text-[#6b6b85] hover:text-[#e8e8f0]'
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setPosition('short')}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                  position === 'short'
                    ? 'bg-[#ff5b6e] text-white'
                    : 'bg-[#0c0c16] text-[#6b6b85] hover:text-[#e8e8f0]'
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
                <span className="text-[#6b6b85]">Leverage</span>
                <span className="text-[#e8e8f0]">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full mt-2 accent-[#00c896]"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm text-[#6b6b85]">Position Size (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Margin Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b6b85]">Required Margin</span>
                <span className="text-[#e8e8f0]">
                  ${((parseFloat(amount) || 0) / leverage).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b85]">Available Balance</span>
                <span className="text-[#e8e8f0]">${balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b85]">Liquidation Price</span>
                <span className="text-[#ff5b6e]">
                  ${(currentPrice * (1 - 1 / leverage * (position === 'long' ? 1 : -1))).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOpenPosition}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  position === 'long'
                    ? 'bg-[#00c896] text-black hover:bg-[#00dea8]'
                    : 'bg-[#ff5b6e] text-white hover:bg-[#ff7b8b]'
                }`}
              >
                Open {position === 'long' ? 'Long' : 'Short'} Position
              </button>
              <button
                onClick={handleClosePosition}
                className="w-full py-3 rounded-xl bg-[#0c0c16] hover:bg-[#1a1a28] text-[#e8e8f0] font-medium"
              >
                Close Position
              </button>
            </div>

            <p className="text-xs text-center text-[#4a4a64]">
              Trading futures involves significant risk. Please manage your risk carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Market Info */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
        <h3 className="text-[#e8e8f0] font-medium mb-4">Market Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-[#6b6b85]">Funding Rate</p>
            <p className="text-[#e8e8f0] font-medium">0.01%</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">Open Interest</p>
            <p className="text-[#e8e8f0] font-medium">$1.2B</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">24h Volume</p>
            <p className="text-[#e8e8f0] font-medium">$5.6B</p>
          </div>
          <div>
            <p className="text-xs text-[#6b6b85]">Mark Price</p>
            <p className="text-[#e8e8f0] font-medium">${currentPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futures;