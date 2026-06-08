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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Live Markets</span>
            </div>
            <div className="text-xs text-[#4a4a64]">
              <span>Real-time crypto prices</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Market Overview</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Explore top cryptocurrencies and start trading.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a4a64]" />
          <input
            type="text"
            placeholder="Search cryptocurrency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] focus:ring-2 focus:ring-[#00c896] focus:border-transparent text-[#e8e8f0] placeholder-[#4a4a64] transition-all"
          />
        </div>
      </div>

      {/* Crypto Table */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0c0c16] text-[#6b6b85] text-xs uppercase">
                <th className="px-6 py-4 text-left font-medium">#</th>
                <th className="px-6 py-4 text-left font-medium">Name</th>
                <th className="px-6 py-4 text-right font-medium">Price</th>
                <th className="px-6 py-4 text-right font-medium">24h Change</th>
                <th className="px-6 py-4 text-right font-medium">Market Cap</th>
                <th className="px-6 py-4 text-right font-medium">Volume (24h)</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a28]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6b6b85]">
                    Loading markets...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-[#6b6b85]">
                    No cryptocurrencies found
                  </td>
                </tr>
              ) : (
                filteredData.map((coin, index) => {
                  const priceChange = coin.price_change_percentage_24h ?? 0;
                  const isPositive = priceChange >= 0;
                  
                  return (
                    <tr
                      key={coin.id}
                      className="hover:bg-[#1a1a28]/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-[#6b6b85] text-sm">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-medium text-[#e8e8f0]">{coin.name}</p>
                            <p className="text-xs text-[#6b6b85] uppercase">{coin.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-[#e8e8f0] font-medium">
                        ${coin.current_price?.toLocaleString() ?? '0.00'}
                      </td>
                      <td className={`px-6 py-4 text-right font-medium ${isPositive ? 'text-[#00c896]' : 'text-[#ff5b6e]'}`}>
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-[#9898b0] text-sm">
                        ${coin.market_cap?.toLocaleString() ?? '0'}
                      </td>
                      <td className="px-6 py-4 text-right text-[#9898b0] text-sm">
                        ${coin.total_volume?.toLocaleString() ?? '0'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleTrade(coin)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#00c896] text-black hover:bg-[#00dea8] transition-colors"
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