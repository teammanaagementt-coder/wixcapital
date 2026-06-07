import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Shield,
  Zap,
  LineChart,
  Coins,
  Users,
  CheckCircle,
  Star,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Bitcoin,
  ExternalLink,
  Wallet,
  Activity,
  Award,
  MessageCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import videoBg from '../../assets/13460-248644879_medium.mp4';

// ─── Sparkline (unchanged, SVG is fine) ────────────────────────────────
function Spark({ data, color }) {
  const min = Math.min(...data),
    max = Math.max(...data),
    range = max - min || 1;
  const w = 80,
    h = 30;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Ticker data ───────────────────────────────────────────────────────
const COINS = [
  {
    sym: "BTC",
    name: "Bitcoin",
    price: 67420,
    chg: 2.34,
    cap: "$1.33T",
    color: "#F7931A",
    bg: "rgba(247,147,26,.12)",
    hist: [61000, 63400, 62100, 65800, 64200, 67100, 67420],
  },
  {
    sym: "ETH",
    name: "Ethereum",
    price: 3842,
    chg: -1.12,
    cap: "$461B",
    color: "#627EEA",
    bg: "rgba(98,126,234,.12)",
    hist: [3600, 3750, 3680, 3900, 3820, 3870, 3842],
  },
  {
    sym: "SOL",
    name: "Solana",
    price: 178.4,
    chg: 5.67,
    cap: "$84B",
    color: "#9164CC",
    bg: "rgba(145,100,204,.12)",
    hist: [145, 158, 152, 168, 171, 176, 178],
  },
  {
    sym: "BNB",
    name: "BNB",
    price: 612.3,
    chg: 0.89,
    cap: "$92B",
    color: "#F0B90B",
    bg: "rgba(240,185,11,.12)",
    hist: [580, 595, 588, 602, 608, 609, 612],
  },
  {
    sym: "ADA",
    name: "Cardano",
    price: 0.614,
    chg: -2.45,
    cap: "$21B",
    color: "#006AD9",
    bg: "rgba(0,106,217,.12)",
    hist: [0.68, 0.65, 0.63, 0.66, 0.64, 0.62, 0.614],
  },
  {
    sym: "AVAX",
    name: "Avalanche",
    price: 42.18,
    chg: 3.21,
    cap: "$17B",
    color: "#FF6B6B",
    bg: "rgba(255,107,107,.12)",
    hist: [36, 38, 37, 40, 41, 42, 42.18],
  },
];

// ─── Ticker bar ────────────────────────────────────────────────────────
function TickerBar({ prices }) {
  const items = [...prices, ...prices];
  return (
    <div className="bg-[#16161D] border-b border-[#2B2B38] h-[38px] overflow-hidden flex items-center">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {items.map((c, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 px-7 font-mono text-[11px] border-r border-[#2B2B38]"
          >
            <span className="text-[#006AD9] font-bold tracking-[.05em]">
              {c.sym}
            </span>
            <span className="text-white">${c.price.toLocaleString()}</span>
            <span
              className={`font-bold ${
                c.chg >= 0 ? "text-[#4A9D7F]" : "text-[#FF6B6B]"
              }`}
            >
              {c.chg >= 0 ? "▲" : "▼"} {Math.abs(c.chg)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Nav (sticky top, mobile sidebar toggle) ───────────────────────────
function Nav({ dark, toggleDark, isMobile, onMenuClick }) {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-8 h-[60px] border-b border-gray-200 dark:border-[#2B2B38] bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight text-gray-900 dark:text-white">
        <div className="w-[9px] h-[9px] rounded-full bg-[#006AD9] shadow-[0_0_12px_#006AD9]" />
        Wix Capital
      </div>

      {!isMobile ? (
        <>
          <div className="flex gap-7 text-xs font-medium text-slate-600 dark:text-[#9898b0]">
            {["Markets", "Trade", "Invest", "About"].map((l) => (
              <a key={l} href="#" className="hover:text-[#006AD9] transition">
                {l}
              </a>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={toggleDark}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-[#2B2B38] bg-transparent text-slate-600 dark:text-[#9898b0] cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-1.5 rounded-lg border border-gray-300 dark:border-[#2B2B38] bg-transparent text-slate-600 dark:text-[#9898b0] cursor-pointer text-xs font-semibold"
            >
              Log in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4.5 py-1.5 rounded-lg border-none bg-[#006AD9] text-white cursor-pointer text-xs font-bold"
            >
              Get Started
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={onMenuClick}
          className="bg-transparent border border-gray-300 dark:border-[#2B2B38] rounded-lg p-1.5 cursor-pointer text-gray-900 dark:text-white"
        >
          <Menu size={20} />
        </button>
      )}
    </nav>
  );
}

// ─── Mobile Sidebar ────────────────────────────────────────────────────
function MobileSidebar({ dark, isOpen, onClose, toggleDark }) {
    const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
      />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed top-0 left-0 bottom-0 w-[70%] max-w-[280px] bg-white dark:bg-[#20202A] z-[210] p-7 flex flex-col gap-6 shadow-[4px_0_20px_rgba(0,0,0,0.3)] border-r border-gray-200 dark:border-[#2B2B38]"
      >
        <div className="flex justify-between items-center">
          <div className="text-lg font-extrabold text-gray-900 dark:text-white">
            Menu
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-slate-600 dark:text-[#9898b0]"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {["Markets", "Trade", "Invest", "About"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm font-medium no-underline text-gray-900 dark:text-white py-1.5 border-b border-gray-200 dark:border-[#2B2B38]"
            >
              {l}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2.5 mt-4">
           <button
          onClick={() => navigate('/login')}
          className="p-2 rounded-lg border border-gray-300 dark:border-[#2B2B38] bg-transparent text-slate-600 dark:text-[#9898b0] cursor-pointer font-semibold text-xs"
        >
          Log in
        </button>
        <button
          onClick={() => navigate('/register')}
          className="p-2.5 rounded-lg border-none bg-[#006AD9] text-white cursor-pointer font-bold text-xs"
        >
          Get Started
        </button>
        </div>
      </motion.aside>
    </>
  );
}

// ─── ScrollReveal wrapper (Framer Motion whileInView) ──────────────────
function RevealSection({ children, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────
function Hero({ dark }) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      {/* Video Background Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none"
        >
          <source src="/13460-248644879_medium.mp4" type="video/mp4" />
        </video>
        
        {/* Responsive Overlay: Maintains perfect text contrast regardless of video brightness */}
        <div 
          className={`absolute inset-0 transition-colors duration-300 backdrop-blur-[2px] ${
            dark ? 'bg-slate-950/35' : 'bg-white/80'
          }`} 
        />
      </div>

      {/* Interactive Content Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center justify-center text-center">
        
        {/* Status Badge */}
        <RevealSection>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/15 text-[11px] font-bold text-[#006AD9] dark:text-blue-400 tracking-wider uppercase mb-8 backdrop-blur-md">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-[#006AD9] dark:bg-blue-400 shadow-sm"
            />
            Live Markets · 10,000+ Investors
          </div>
        </RevealSection>

        {/* Hero Heading */}
        <RevealSection delay={0.1}>
          <h1 className="text-[clamp(38px,6vw,72px)] font-extrabold leading-[1.1] tracking-tight max-w-[840px] mb-6 text-slate-900 dark:text-white">
            Trade Crypto.<br />
            <span className="bg-gradient-to-r from-[#006AD9] to-blue-500 bg-clip-text text-transparent">
              Earn Daily.
            </span>
            <br />
            <span className="text-slate-500 dark:text-slate-400">
              Build Wealth.
            </span>
          </h1>
        </RevealSection>

        {/* Subtitle / Paragraph */}
        <RevealSection delay={0.2}>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-[540px] leading-relaxed mb-10 px-2">
            Wix Capital gives you institutional-grade tools, daily passive returns, and
            bank-level security in one sleek, unified platform.
          </p>
        </RevealSection>

        {/* Action Buttons */}
        <RevealSection delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto justify-center px-4">
            <motion.button
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/register')}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-[#006AD9] hover:bg-[#0056b3] text-white shadow-lg shadow-blue-600/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Investing <ArrowRight size={16} className="stroke-[2.5]" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="px-8 py-3.5 rounded-xl text-sm font-bold bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-all duration-200 backdrop-blur-sm cursor-pointer"
            >
              Explore Demo
            </motion.button>
          </div>
        </RevealSection>

        {/* Stats Grid Dashboard */}
        <RevealSection delay={0.4}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-slate-200/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/40 rounded-2xl overflow-hidden w-full max-w-3xl shadow-xl shadow-slate-200/10 dark:shadow-none backdrop-blur-xl">
            {[
              { val: "$2.4B", lbl: "24h Volume" },
              { val: "10K+", lbl: "Active Traders" },
              { val: "2.5%", lbl: "Max Daily Return" },
              { val: "99.9%", lbl: "Uptime SLA" },
            ].map((s, i) => (
              <div
                key={i}
                className="py-6 px-4 text-center bg-white/70 dark:bg-slate-950/40 transition-colors duration-300"
              >
                <div className="text-2xl font-extrabold text-[#006AD9] dark:text-blue-400 font-mono tracking-tight">
                  {s.val}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 font-bold tracking-wider uppercase">
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
        
      </div>
    </section>
  );
}

// ─── Chart Section (with real-time data) ────────────────────────────────
function ChartSection({ dark, prices }) {
  const [activeCoin, setActiveCoin] = useState(0);
  const [range, setRange] = useState("1H");
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  function genData(base, count, vol) {
    const d = [];
    let v = base;
    for (let i = 0; i < count; i++) {
      v += (Math.random() - 0.47) * vol;
      d.push(parseFloat(v.toFixed(4)));
    }
    return d;
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const c = prices[activeCoin];
    const pts = genData(c.price * 0.97, 60, c.price * 0.005);
    const labels = pts.map((_, i) => i);

    if (chartRef.current) chartRef.current.destroy();
    if (!window.Chart) return;

    const grad = ctx.createLinearGradient(0, 0, 0, 140);
    grad.addColorStop(0, c.color + "28");
    grad.addColorStop(1, "transparent");

    chartRef.current = new window.Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: pts,
            borderColor: c.color,
            borderWidth: 1.5,
            fill: true,
            backgroundColor: grad,
            pointRadius: 0,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (d) => `$${Number(d.raw).toLocaleString()}` },
            backgroundColor: dark ? "#20202A" : "#FFFFFF",
            borderColor: dark ? "#2B2B38" : "#E2E8F0",
            borderWidth: 1,
            titleColor: dark ? "#9898b0" : "#64748b",
            bodyColor: dark ? "#FFFFFF" : "#09090B",
            padding: 8,
          },
        },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  }, [activeCoin, range, dark, prices]);

  const c = prices[activeCoin];
  const border = dark ? "#2B2B38" : "#E2E8F0";

  return (
    <RevealSection>
      <div className="py-15 px-8 bg-[#E6F1FD] dark:bg-[#0E0E12] border-t border-t-gray-200 dark:border-t-[#2B2B38] border-b border-b-gray-200 dark:border-b-[#2B2B38]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
            <div>
              <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1">
                Live Chart
              </div>
              <div className="text-[22px] font-extrabold tracking-[-.02em] text-gray-900 dark:text-white">
                Price Action
              </div>
            </div>
            <div className="flex gap-0.5 bg-gray-200 dark:bg-[#20202A] rounded-lg p-0.5 border border-gray-200 dark:border-[#2B2B38]">
              {["1H", "4H", "1D", "1W"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold cursor-pointer border-none ${
                    range === r
                      ? "text-[#006AD9] bg-white dark:bg-[#2B2B38]"
                      : "text-slate-600 dark:text-[#9898b0] bg-transparent"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mb-3.5 flex-wrap">
            {prices.slice(0, 5).map((coin, i) => (
              <button
                key={i}
                onClick={() => setActiveCoin(i)}
                className={`flex items-center gap-1.5 px-3 py-1.25 rounded-lg border text-[11px] font-bold cursor-pointer ${
                  activeCoin === i
                    ? "border-[#006AD9] bg-[#006AD9]/7 text-[#006AD9]"
                    : `border-gray-200 dark:border-[#2B2B38] bg-transparent text-slate-600 dark:text-[#9898b0]`
                }`}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: coin.color }}
                />
                {coin.sym}
              </button>
            ))}
          </div>
          <div className="bg-white dark:bg-[#20202A] border border-gray-200 dark:border-[#2B2B38] rounded-xl p-4.5 h-[200px]">
            <div className="flex justify-between items-start mb-2.5">
              <div>
                <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">
                  ${c.price.toLocaleString()}
                </div>
                <div
                  className={`text-xs font-bold font-mono ${
                    c.chg >= 0 ? "text-[#4A9D7F]" : "text-[#FF6B6B]"
                  }`}
                >
                  {c.chg >= 0 ? "▲" : "▼"} {c.chg >= 0 ? "+" : ""}
                  {c.chg}% today
                </div>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-[#6b6b85] text-right font-mono">
                <div>H: ${(c.price * 1.01).toFixed(0)}</div>
                <div>L: ${(c.price * 0.98).toFixed(0)}</div>
              </div>
            </div>
            <canvas ref={canvasRef} className="w-full h-[120px]" />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Market Table ───────────────────────────────────────────────────────
function MarketTable({ dark, prices }) {
  return (
    <RevealSection>
      <div className="py-15 px-8 max-w-[1200px] mx-auto overflow-x-auto">
        <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
          Markets
        </div>
        <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mb-7">
          Top Assets
        </div>
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              {["#", "Asset", "Price", "24h Change", "Market Cap", "7d Chart", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    className="text-left text-[10px] font-bold text-slate-500 dark:text-[#6b6b85] tracking-[.07em] uppercase px-4 pb-3 border-b border-gray-200 dark:border-[#2B2B38]"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {prices.map((c, i) => (
              <tr key={i} className="border-b border-gray-200/25 dark:border-[#2B2B38]/25">
                <td className="py-3 px-4 text-[11px] font-mono text-slate-500 dark:text-[#6b6b85]">
                  {i + 1}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold font-mono flex-shrink-0"
                      style={{ background: c.bg, color: c.color }}
                    >
                      {c.sym[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white">
                        {c.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-[#6b6b85] font-mono">
                        {c.sym}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-xs text-gray-900 dark:text-white">
                  ${c.price.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono ${
                      c.chg >= 0
                        ? "bg-[#4A9D7F]/15 text-[#4A9D7F]"
                        : "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                    }`}
                  >
                    {c.chg >= 0 ? "▲" : "▼"} {Math.abs(c.chg)}%
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-[#9898b0]">
                  {c.cap}
                </td>
                <td className="py-3 px-4">
                  <Spark data={c.hist} color={c.color} />
                </td>
                <td className="py-3 px-4">
                  <button className="px-3.5 py-1 rounded-md border border-[#006AD9]/40 bg-transparent text-[#006AD9] text-[11px] font-bold cursor-pointer">
                    Trade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RevealSection>
  );
}

// ─── Investment Plans ───────────────────────────────────────────────────
function Plans({ dark }) {
  const plans = [
    {
      name: "Basic",
      rate: "1.2",
      period: "30-day lock",
      min: "$50",
      max: "$999",
      feats: ["Instant withdrawals", "Real-time dashboard", "Email support"],
      featured: false,
    },
    {
      name: "Silver",
      rate: "1.8",
      period: "14-day lock",
      min: "$1,000",
      max: "$4,999",
      feats: [
        "Priority withdrawals",
        "Advanced analytics",
        "Referral bonuses",
        "Live chat support",
      ],
      featured: true,
    },
    {
      name: "Gold",
      rate: "2.5",
      period: "7-day lock",
      min: "$5,000",
      max: "$24,999",
      feats: [
        "Instant withdrawals",
        "Dedicated manager",
        "OTC trading access",
        "API access",
      ],
      featured: false,
    },
  ];
  return (
    <RevealSection>
      <div className="py-15 px-8 bg-[#E6F1FD] dark:bg-[#0E0E12] border-t border-t-gray-200 dark:border-t-[#2B2B38]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[500px] mx-auto mb-10">
            <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
              Investment Plans
            </div>
            <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mb-2.5">
              Grow Your Capital
            </div>
            <div className="text-[13px] text-slate-600 dark:text-[#9898b0] leading-relaxed">
              Choose a plan. Start earning daily passive returns from day one.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl p-7 transition-all ${
                  p.featured
                    ? "border border-[#006AD9] bg-gradient-to-br from-[#006AD9]/5 to-white dark:to-[#20202A]"
                    : `border border-gray-200 dark:border-[#2B2B38] bg-white dark:bg-[#20202A]`
                }`}
              >
                {p.featured && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#006AD9] text-white text-[9px] font-extrabold px-3 py-0.5 rounded-full tracking-[.07em] uppercase whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-xs font-bold text-slate-600 dark:text-[#9898b0] tracking-[.06em] uppercase mb-3.5">
                  {p.name}
                </div>
                <div className="text-[46px] font-extrabold leading-none text-gray-900 dark:text-white tracking-[-.04em] font-mono">
                  {p.rate}
                  <span className="text-xl text-[#006AD9] align-super ml-0.5">
                    %
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-[#6b6b85] mt-1.25 mb-5">
                  daily return · {p.period}
                </div>
                <div className="h-px bg-gray-200 dark:bg-[#2B2B38] mb-5" />
                {p.feats.map((f, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#9898b0] mb-2.5"
                  >
                    <CheckCircle size={14} color="#4A9D7F" />
                    {f}
                  </div>
                ))}
                <div className="flex justify-between mt-5 pt-4 border-t border-gray-200 dark:border-[#2B2B38]">
                  {[
                    ["Min", p.min],
                    ["Max", p.max],
                  ].map(([lbl, val]) => (
                    <div key={lbl} className="text-center">
                      <div className="font-mono text-[13px] font-bold text-gray-900 dark:text-white">
                        {val}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-[#6b6b85] mt-0.5 uppercase tracking-[.05em]">
                        {lbl}
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full mt-6 py-2.75 rounded-lg text-xs font-extrabold text-center cursor-pointer ${
                    p.featured
                      ? "border-none bg-[#006AD9] text-white"
                      : `border border-gray-200 dark:border-[#2B2B38] bg-transparent text-gray-900 dark:text-white`
                  }`}
                >
                  Start with {p.name}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Features Grid ──────────────────────────────────────────────────────
function Features({ dark }) {
  const feats = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "256-bit SSL, 2FA, and cold storage for 95% of assets.",
      accent: "#006AD9",
    },
    {
      icon: Zap,
      title: "Lightning Transactions",
      desc: "Deposits credited in seconds. Withdrawals under 60 min.",
      accent: "#F0B90B",
    },
    {
      icon: LineChart,
      title: "Real-Time Markets",
      desc: "Live prices, advanced charting, deep order book data.",
      accent: "#4A9D7F",
    },
    {
      icon: Coins,
      title: "Daily Passive Income",
      desc: "Earn up to 2.5% daily returns with zero active management.",
      accent: "#627EEA",
    },
    {
      icon: Users,
      title: "Referral Program",
      desc: "Earn 5% commission on every referral's investment.",
      accent: "#9164CC",
    },
    {
      icon: Lock,
      title: "KYC Compliant",
      desc: "Fully regulated, KYC-verified platform.",
      accent: "#4A9D7F",
    },
  ];
  return (
    <RevealSection>
      <section className="py-15 px-8 max-w-[1200px] mx-auto">
        <div className="text-center max-w-[500px] mx-auto mb-10">
          <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
            Why Wix Capital
          </div>
          <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white">
            Built for serious traders
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {feats.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="border border-gray-200 dark:border-[#2B2B38] rounded-xl p-6 bg-white dark:bg-[#20202A]"
            >
              <div
                className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-4.5"
                style={{ background: `${f.accent}14`, border: `1px solid ${f.accent}28`, color: f.accent }}
              >
                <f.icon size={20} />
              </div>
              <div className="text-sm font-bold mb-1.5 text-gray-900 dark:text-white">
                {f.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-[#9898b0] leading-relaxed">
                {f.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </RevealSection>
  );
}

// ─── Recent Transactions ────────────────────────────────────────────────
function RecentTransactions({ dark }) {
  const transactions = [
    { id: 1, type: "Buy", asset: "BTC", amount: "0.024", value: "$1,620", status: "Completed", time: "2 min ago" },
    { id: 2, type: "Staking", asset: "ETH", amount: "2.5", value: "$9,605", status: "Earning", time: "1 hour ago" },
    { id: 3, type: "Deposit", asset: "USDT", amount: "5,000", value: "$5,000", status: "Completed", time: "5 hours ago" },
    { id: 4, type: "Withdraw", asset: "SOL", amount: "85", value: "$15,164", status: "Pending", time: "12 hours ago" },
  ];
  return (
    <RevealSection>
      <div className="py-15 px-8 max-w-[1200px] mx-auto">
        <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
          Activity
        </div>
        <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mb-7">
          Recent Transactions
        </div>
        <div className="bg-white dark:bg-[#16161D] rounded-2xl border border-gray-200 dark:border-[#2B2B38] overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-[#2B2B38]">
                {["Type", "Asset", "Amount", "Value", "Status", "Time"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-[#6b6b85] uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-200/25 dark:border-[#2B2B38]/25">
                  <td className="px-5 py-3 font-semibold text-xs text-gray-900 dark:text-white">
                    {tx.type}
                  </td>
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-600 dark:text-[#9898b0]">
                    {tx.asset}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-900 dark:text-white">
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-900 dark:text-white">
                    {tx.value}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === "Completed"
                          ? "bg-[#4A9D7F]/15 text-[#4A9D7F]"
                          : tx.status === "Earning"
                          ? "bg-[#F0B90B]/15 text-[#F0B90B]"
                          : "bg-[#FF6B6B]/15 text-[#FF6B6B]"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[11px] text-slate-500 dark:text-[#6b6b85]">
                    {tx.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────
function Testimonials({ dark }) {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Crypto Investor",
      text: "Daily returns are unbelievable. I've grown my portfolio 34% in 3 months using Wix Capital's plans.",
      avatar: "SC",
    },
    {
      name: "Mike Rodriguez",
      role: "Day Trader",
      text: "The charting tools and execution speed are top-notch. Best platform I've used for active trading.",
      avatar: "MR",
    },
    {
      name: "Emma Watson",
      role: "Fund Manager",
      text: "Security and transparency give me peace of mind. Withdrawals are fast and support is incredible.",
      avatar: "EW",
    },
  ];
  return (
    <RevealSection>
      <div className="py-15 px-8 bg-[#E6F1FD] dark:bg-[#0E0E12] border-t border-t-gray-200 dark:border-t-[#2B2B38] border-b border-b-gray-200 dark:border-b-[#2B2B38]">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
            Social Proof
          </div>
          <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mb-10">
            What Investors Say
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-[#20202A] rounded-2xl p-6 border border-gray-200 dark:border-[#2B2B38] text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#006AD9]/20 flex items-center justify-center font-extrabold text-base text-[#006AD9]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-gray-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#6b6b85]">
                      {t.role}
                    </div>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-[#9898b0]">
                  “{t.text}”
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Crypto Education ───────────────────────────────────────────────────
function Education({ dark }) {
  const articles = [
    {
      title: "How to start earning daily passive income",
      desc: "Learn about staking, yield farming, and our investment plans.",
      icon: BookOpen,
    },
    {
      title: "Understanding market cycles",
      desc: "Bull vs bear markets — how to protect your capital.",
      icon: TrendingUp,
    },
    {
      title: "Security best practices",
      desc: "Keep your assets safe with 2FA, hardware wallets and more.",
      icon: Shield,
    },
  ];
  return (
    <RevealSection>
      <div className="py-15 px-8 max-w-[1200px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-10">
          <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase mb-1.5">
            Learn & Earn
          </div>
          <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mb-2.5">
            Crypto Education
          </div>
          <div className="text-[13px] text-slate-600 dark:text-[#9898b0]">
            Master crypto investing with our free guides and insights.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="border border-gray-200 dark:border-[#2B2B38] rounded-2xl p-6 bg-white dark:bg-[#16161D] cursor-pointer"
            >
              <div className="w-10 h-10 rounded-[10px] bg-[#006AD9]/14 flex items-center justify-center mb-4 text-[#006AD9]">
                <art.icon size={20} />
              </div>
              <div className="text-[15px] font-bold mb-2 text-gray-900 dark:text-white">
                {art.title}
              </div>
              <div className="text-xs text-slate-600 dark:text-[#9898b0] mb-4 leading-relaxed">
                {art.desc}
              </div>
              <button className="bg-transparent border-none text-[#006AD9] font-bold text-xs cursor-pointer flex items-center gap-1">
                Read more <ArrowRight size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// ─── FAQ Accordion ──────────────────────────────────────────────────────
function FAQ({ dark }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: "How are daily returns calculated?", a: "Daily returns are based on your invested amount multiplied by the plan's daily rate, credited every 24 hours." },
    { q: "Is my capital protected?", a: "We use multi-layer security, cold storage, and insurance funds to protect assets against breaches." },
    { q: "Can I withdraw anytime?", a: "Yes, most plans allow instant withdrawals with no hidden fees, subject to lock periods for premium plans." },
    { q: "What cryptocurrencies can I invest in?", a: "BTC, ETH, SOL, BNB, USDT and 20+ major tokens are supported for deposits and earnings." },
  ];
  return (
    <RevealSection>
      <div className="py-15 px-8 bg-[#E6F1FD] dark:bg-[#0E0E12] border-t border-t-gray-200 dark:border-t-[#2B2B38]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <div className="text-[10px] font-bold text-[#006AD9] tracking-[.1em] uppercase">
              FAQ
            </div>
            <div className="text-[32px] font-extrabold tracking-[-.03em] text-gray-900 dark:text-white mt-1.5">
              Frequently Asked Questions
            </div>
          </div>
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200 dark:border-[#2B2B38] mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left py-4.5 bg-transparent border-none cursor-pointer flex justify-between items-center"
              >
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {faq.q}
                </span>
                <span className="text-xl text-[#006AD9]">
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pb-5 text-[13px] text-slate-600 dark:text-[#9898b0] leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────
function Footer({ dark }) {
  return (
    <footer className="border-t border-gray-200 dark:border-[#2B2B38] py-8 px-8 bg-white dark:bg-[#09090B]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-white">
          <div className="w-2 h-2 rounded-full bg-[#006AD9]" />
          Wix Capital
        </div>
        <div className="text-[11px] text-slate-500 dark:text-[#6b6b85]">
          © 2026 Wix Capital. All rights reserved.
        </div>
        <div className="flex gap-5 text-[11px] text-slate-500 dark:text-[#6b6b85]">
          {["Privacy", "Terms", "Support", "API"].map((l) => (
            <a key={l} href="#" className="hover:text-[#006AD9] transition">
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Root Component ─────────────────────────────────────────────────────
export default function WixCapital() {
  const [dark, setDark] = useState(true);
  const [prices, setPrices] = useState(COINS);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Live price wiggle
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((prev) =>
        prev.map((c) => ({
          ...c,
          price: parseFloat(
            (c.price * (1 + (Math.random() - 0.499) * 0.0008)).toFixed(
              c.price > 100 ? 2 : 4
            )
          ),
        }))
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090B] text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <div className="sticky top-0 z-[100] bg-inherit">
        <TickerBar prices={prices} />
        <Nav
          dark={dark}
          toggleDark={() => setDark((d) => !d)}
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>
      <MobileSidebar
        dark={dark}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        toggleDark={() => setDark((d) => !d)}
      />
      <Hero dark={dark} />
      <ChartSection dark={dark} prices={prices} />
      <MarketTable dark={dark} prices={prices} />
      <Plans dark={dark} />
      <Features dark={dark} />
      <RecentTransactions dark={dark} />
      <Testimonials dark={dark} />
      <Education dark={dark} />
      <FAQ dark={dark} />
      <Footer dark={dark} />
    </div>
  );
}