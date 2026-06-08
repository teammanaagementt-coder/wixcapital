// src/pages/home/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Lucide icons
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Check,
  Bitcoin,
  Gem,
  Scale,
  Circle,
  Landmark,
  Image as ImageIcon,
  Link2,
  Menu,
  MessageCircle,
  X,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   SCROLL ANIMATION HOOK
────────────────────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ──────────────────────────────────────────────
   TRADINGVIEW WIDGET
────────────────────────────────────────────── */
function TradingViewWidget({ symbol = 'BTCUSDT' }) {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const widgetId = `tv-${Date.now()}`;
    const wrapper = document.createElement('div');
    wrapper.id = widgetId;
    containerRef.current.appendChild(wrapper);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(10, 10, 20, 0)',
      gridColor: 'rgba(255,255,255,0.04)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
      container_id: widgetId,
    });
    wrapper.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [symbol]);

  return <div ref={containerRef} className="w-full h-full" />;
}

/* ──────────────────────────────────────────────
   MINI SPARKLINE
────────────────────────────────────────────── */
function Sparkline({ history, color, up }) {
  const min = Math.min(...history);
  const max = Math.max(...history);
  const r = max - min || 1;
  const w = 88, h = 32;
  const pts = history
    .map((v, i) => `${i * (w / (history.length - 1))},${h - ((v - min) / r) * (h - 2) - 1}`)
    .join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={`url(#sg-${color.replace('#', '')})`}
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   ANIMATED COUNTER
────────────────────────────────────────────── */
function Counter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseFloat(target);
    const duration = 1800;
    const step = 16;
    const increment = end / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else setVal(start);
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {prefix}
      {typeof val === 'number' ? val.toFixed(decimals) : val}
      {suffix}
    </span>
  );
}

/* ──────────────────────────────────────────────
   MAIN DASHBOARD
────────────────────────────────────────────── */
const WixCapitalDashboard = () => {
  const initialCoins = [
    {
      sym: 'BTC', name: 'Bitcoin', price: 67420, chg: 2.34, vol: '$48.2B', cap: '$1.33T',
      color: '#f7931a', bg: 'rgba(247,147,26,.1)', tv: 'BTCUSDT',
      history: [61000, 63400, 62100, 65800, 64200, 67100, 67420],
    },
    {
      sym: 'ETH', name: 'Ethereum', price: 3842, chg: -1.12, vol: '$18.6B', cap: '$461B',
      color: '#627eea', bg: 'rgba(98,126,234,.1)', tv: 'ETHUSDT',
      history: [3600, 3750, 3680, 3900, 3820, 3870, 3842],
    },
    {
      sym: 'SOL', name: 'Solana', price: 178.4, chg: 5.67, vol: '$6.1B', cap: '$84B',
      color: '#9945ff', bg: 'rgba(153,69,255,.1)', tv: 'SOLUSDT',
      history: [145, 158, 152, 168, 171, 176, 178],
    },
    {
      sym: 'BNB', name: 'BNB', price: 612.3, chg: 0.89, vol: '$2.3B', cap: '$92B',
      color: '#f3ba2f', bg: 'rgba(243,186,47,.1)', tv: 'BNBUSDT',
      history: [580, 595, 588, 602, 608, 609, 612],
    },
    {
      sym: 'ADA', name: 'Cardano', price: 0.614, chg: -2.45, vol: '$892M', cap: '$21B',
      color: '#4a9dff', bg: 'rgba(74,157,255,.1)', tv: 'ADAUSDT',
      history: [0.68, 0.65, 0.63, 0.66, 0.64, 0.62, 0.614],
    },
    {
      sym: 'AVAX', name: 'Avalanche', price: 42.18, chg: 3.21, vol: '$1.1B', cap: '$17B',
      color: '#e84142', bg: 'rgba(232,65,66,.1)', tv: 'AVAXUSDT',
      history: [36, 38, 37, 40, 41, 42, 42.18],
    },
  ];

  const [coins, setCoins] = useState(initialCoins);
  const [activeCoin, setActiveCoin] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live price updates
  useEffect(() => {
    const iv = setInterval(() => {
      setCoins(prev =>
        prev.map(c => ({
          ...c,
          price: parseFloat(
            (c.price * (1 + (Math.random() - 0.499) * 0.001)).toFixed(
              c.price > 100 ? 2 : 4
            )
          ),
        }))
      );
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  // Scroll animation refs
  const [heroRef, heroIn] = useInView({ threshold: 0.1 });
  const [statsRef, statsIn] = useInView();
  const [chartRef2, chartIn] = useInView();
  const [marketRef, marketIn] = useInView();
  const [plansRef, plansIn] = useInView();
  const [featRef, featIn] = useInView();
  const [heatRef, heatIn] = useInView();
  const [newsRef, newsIn] = useInView();
  const [ctaRef, ctaIn] = useInView();

  const coin = coins[activeCoin];
  const isUp = coin.chg >= 0;
    const [sidebarOpen, setSidebarOpen] = useState(false);

  const newsItems = [
    { tag: 'Market', title: 'Bitcoin surges past $67K as institutional demand accelerates', time: '2h ago', icon: <Bitcoin className="w-6 h-6 text-[#f7931a]" /> },
    { tag: 'DeFi', title: 'Ethereum Layer 2 networks hit record $12B TVL in Q2 2026', time: '4h ago', icon: <Gem className="w-6 h-6 text-[#627eea]" /> },
    { tag: 'Regulation', title: 'SEC approves spot ETH ETF options, market reacts positively', time: '6h ago', icon: <Scale className="w-6 h-6 text-[#4a4a64]" /> },
    { tag: 'Altcoins', title: 'Solana DApp ecosystem crosses 400M total transactions milestone', time: '8h ago', icon: <Circle className="w-6 h-6 text-[#9945ff]" /> },
    { tag: 'Macro', title: 'Fed signals rate pause — crypto markets rally across the board', time: '10h ago', icon: <Landmark className="w-6 h-6 text-[#4a4a64]" /> },
    { tag: 'NFTs', title: 'NFT trading volume rebounds 35% week-over-week on Ethereum', time: '12h ago', icon: <ImageIcon className="w-6 h-6 text-[#4a4a64]" /> },
  ];

  const heatData = [
    { sym: 'BTC', chg: 2.34, size: 'large' },
    { sym: 'ETH', chg: -1.12, size: 'large' },
    { sym: 'SOL', chg: 5.67, size: 'medium' },
    { sym: 'BNB', chg: 0.89, size: 'medium' },
    { sym: 'XRP', chg: -0.45, size: 'medium' },
    { sym: 'ADA', chg: -2.45, size: 'small' },
    { sym: 'AVAX', chg: 3.21, size: 'small' },
    { sym: 'DOT', chg: 1.78, size: 'small' },
    { sym: 'MATIC', chg: -3.2, size: 'small' },
    { sym: 'LINK', chg: 4.1, size: 'small' },
    { sym: 'ATOM', chg: 2.9, size: 'small' },
    { sym: 'UNI', chg: -0.8, size: 'small' },
  ];

  
  const navLinks = [
    { label: 'Markets', to: '/markets' },
    { label: 'Trade', to: '/trade' },
    { label: 'Invest', to: '/invest' },
    { label: 'Earn', to: '/invest' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'About', to: '/about' },
  ];


  const fearIndex = 72; // greed

  return (
    <div
      className="bg-[#07070e] text-[#e8e8f0] overflow-x-hidden"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        /* TICKER */
        @keyframes tickerRoll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ticker { animation: tickerRoll 50s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }

        /* GLOW PULSE */
        @keyframes glowPulse { 0%,100% { opacity:1; box-shadow: 0 0 8px #00c896; } 50% { opacity:0.5; box-shadow: 0 0 20px #00c896; } }
        .glow-dot { animation: glowPulse 2s ease-in-out infinite; }

        /* FLOAT */
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }

        /* GRAIN */
        @keyframes grain { 0%,100% { transform: translate(0,0); } 10% { transform: translate(-2%,-3%); } 30% { transform: translate(3%,-1%); } 50% { transform: translate(-1%,2%); } 70% { transform: translate(2%,3%); } 90% { transform: translate(-3%,1%); } }
        .grain::before { content:''; position:absolute; inset:-50%; width:200%; height:200%; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"); opacity:.04; animation: grain 1s steps(1) infinite; pointer-events:none; }

        /* SCROLL REVEAL */
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-left { opacity: 0; transform: translateX(-32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-left.visible { opacity: 1; transform: translateX(0); }
        .reveal-right { opacity: 0; transform: translateX(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-right.visible { opacity: 1; transform: translateX(0); }
        .reveal-scale { opacity: 0; transform: scale(0.92); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal-scale.visible { opacity: 1; transform: scale(1); }

        /* STAGGER */
        .stagger-1 { transition-delay: 0.1s !important; }
        .stagger-2 { transition-delay: 0.2s !important; }
        .stagger-3 { transition-delay: 0.3s !important; }
        .stagger-4 { transition-delay: 0.4s !important; }
        .stagger-5 { transition-delay: 0.5s !important; }
        .stagger-6 { transition-delay: 0.6s !important; }

        /* HERO TEXT */
        @keyframes slideUp { from { opacity:0; transform: translateY(40px); } to { opacity:1; transform: translateY(0); } }
        .hero-line-1 { animation: slideUp 0.8s 0.1s both ease; }
        .hero-line-2 { animation: slideUp 0.8s 0.3s both ease; }
        .hero-line-3 { animation: slideUp 0.8s 0.5s both ease; }
        .hero-sub   { animation: slideUp 0.8s 0.7s both ease; }
        .hero-btns  { animation: slideUp 0.8s 0.9s both ease; }
        .hero-stats { animation: slideUp 0.8s 1.1s both ease; }

        /* GRADIENT TEXT */
        .grad-text { background: linear-gradient(135deg, #00c896 0%, #00a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-text-gold { background: linear-gradient(135deg, #f7931a 0%, #f3ba2f 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* CARD HOVER */
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,200,150,0.08); border-color: rgba(0,200,150,0.3) !important; }

        /* GRID LINES BG */
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px); background-size: 52px 52px; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0c0c16; } ::-webkit-scrollbar-thumb { background: #1e1e30; border-radius: 4px; }

        /* MARQUEE */
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 30s linear infinite; }

        /* HEAT MAP */
        .heat-large { grid-column: span 3; grid-row: span 2; }
        .heat-medium { grid-column: span 2; grid-row: span 2; }
        .heat-small { grid-column: span 2; grid-row: span 1; }

        /* FEAR GAUGE */
        @keyframes gaugeAnim { from { stroke-dashoffset: 226; } }
        .gauge-arc { stroke-dasharray: 226; animation: gaugeAnim 2s ease forwards; }

        /* NAV BLUR */
        .nav-blur { background: rgba(7,7,14,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

        /* PLAN CARD FEATURED */
        .plan-featured { background: linear-gradient(135deg, rgba(0,200,150,0.08) 0%, rgba(0,168,255,0.05) 100%); }

        /* ORBIT */
        @keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
        @keyframes orbit2 { from { transform: rotate(60deg) translateX(80px) rotate(-60deg); } to { transform: rotate(420deg) translateX(80px) rotate(-420deg); } }
        .orbit-1 { animation: orbit 8s linear infinite; }
        .orbit-2 { animation: orbit2 5s linear infinite; }

        /* MORPHING BG */
        @keyframes morph { 0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; } }
        .morphing { animation: morph 8s ease-in-out infinite; }

        /* SHIMMER */
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        .shimmer-line { background: linear-gradient(90deg, transparent 0%, rgba(0,200,150,0.2) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }

        /* PRICE FLASH */
        @keyframes flashGreen { 0%,100% { color: #e8e8f0; } 50% { color: #00c896; } }
        @keyframes flashRed { 0%,100% { color: #e8e8f0; } 50% { color: #ff5b6e; } }
      `}</style>

      {/* ══════════════════ TICKER ══════════════════ */}
      <div className="bg-[#060610] border-b border-[#1a1a28] overflow-hidden h-9 flex items-center relative z-50">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...coins, ...coins, ...coins].map((c, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2.5 px-6 border-r border-[#1a1a28]"
            >
              <span className="text-[10px] font-bold font-mono text-[#9898b0]">{c.sym}</span>
              <span className="text-[10px] font-mono text-[#e8e8f0]">
                ${c.price.toLocaleString()}
              </span>
              <span
                className={`text-[10px] font-mono font-bold ${
                  c.chg >= 0 ? 'text-[#00c896]' : 'text-[#ff5b6e]'
                }`}
              >
                {c.chg >= 0 ? (
                  <ArrowUp className="w-3 h-3 inline" />
                ) : (
                  <ArrowDown className="w-3 h-3 inline" />
                )}{' '}
                {Math.abs(c.chg)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════ NAV ══════════════════ */}
        <nav className={`flex items-center justify-between px-8 md:px-14 h-[68px] sticky top-0 z-40 nav-blur transition-all duration-300 ${scrollY > 40 ? 'border-b border-[#1a1a28]' : ''}`}>
        <Link to="/" className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight">
          <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
          <span>Wix</span>
          <span className="grad-text">Capital</span>
        </Link>
        <div className="hidden md:flex gap-8 text-[12px] font-semibold text-[#6b6b85]">
          {navLinks.map(l => (
            <Link key={l.label} to={l.to} className="hover:text-[#e8e8f0] transition-colors duration-200 relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00c896] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
        <div className="flex gap-2.5 items-center">
          <Link to="/login" className="hidden md:block px-4 py-2 border border-[#2a2a3e] rounded-lg text-[11px] font-semibold text-[#9898b0] hover:border-[#00c896] hover:text-[#00c896] transition-all">
            Log in
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-lg text-[11px] font-bold bg-[#00c896] text-black hover:bg-[#00dea8] hover:shadow-[0_0_24px_rgba(0,200,150,0.4)] transition-all">
            Get Started
          </Link>
          {/* ═══ MOBILE HAMBURGER ═══ */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#9898b0] hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ═══ MOBILE SIDEBAR (NEW) ═══ */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0c0c16] border-r border-[#1a1a28] p-6 flex flex-col">
            <button onClick={() => setSidebarOpen(false)} className="self-end p-2 text-[#9898b0]">
              <X className="w-5 h-5" />
            </button>
            <div className="mt-8 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className="text-sm font-semibold text-[#6b6b85] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#1a1a28] my-2" />
              <Link to="/login" onClick={() => setSidebarOpen(false)} className="text-sm font-semibold text-[#9898b0] hover:text-white">
                Log in
              </Link>
              <Link to="/register" onClick={() => setSidebarOpen(false)} className="text-sm font-semibold text-[#00c896]">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center py-24 px-6 md:px-14 overflow-hidden">
        {/* BG grid + radial */}
        <div className="absolute inset-0 grid-bg opacity-100 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_100%)]" />
        {/* Morphing blobs */}
        <div
          className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] morphing"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,200,150,0.07) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="absolute bottom-0 right-[-100px] w-[500px] h-[500px] morphing"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,120,255,0.05) 0%, transparent 65%)',
            pointerEvents: 'none',
            animationDelay: '-4s',
          }}
        />

        {/* Orbiting accent */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div className="orbit-1 absolute w-8 h-8 rounded-full border border-[rgba(0,200,150,0.2)] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c896] opacity-60" />
          </div>
          <div className="orbit-2 absolute w-6 h-6 rounded-full border border-[rgba(0,120,255,0.2)] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#4a9dff] opacity-60" />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-[820px]">
          {/* Badge */}
          <div className="hero-line-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,200,150,0.2)] bg-[rgba(0,200,150,0.05)] text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c896] glow-dot" />
            Live Markets · 10,000+ Investors
          </div>

          <h1
            className="font-extrabold tracking-tighter leading-[1.0]"
            style={{ fontSize: 'clamp(44px,6.5vw,90px)' }}
          >
            <div className="hero-line-1 text-[#e8e8f0]">Trade Smarter.</div>
            <div className="hero-line-2 mt-1">
              <span className="grad-text">Earn Daily.</span>
            </div>
            <div className="hero-line-3 text-[#3a3a58] mt-1 italic font-extrabold">
              Build Wealth.
            </div>
          </h1>

          <p className="hero-sub mt-7 text-[15px] text-[#6b6b85] max-w-[460px] mx-auto leading-relaxed">
            Institutional-grade crypto trading with daily passive returns, real-time
            analytics, and bank-level security—in one unified platform.
          </p>

          <div className="hero-btns flex gap-3 justify-center mt-10 flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl text-[14px] font-bold bg-[#00c896] text-black hover:bg-[#00dea8] hover:shadow-[0_0_40px_rgba(0,200,150,0.4)] transition-all duration-300 inline-flex items-center"
            >
              Start Investing <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-3.5 rounded-xl text-[14px] font-bold border border-[#2a2a3e] text-[#9898b0] hover:text-[#e8e8f0] hover:border-[#3a3a56] transition-all duration-300"
            >
              Explore Demo
            </Link>
          </div>

          {/* Shimmer divider */}
          <div className="hero-stats mt-14 h-px shimmer-line rounded-full mx-auto max-w-[600px] mb-8" />

          {/* Stats bar */}
          <div className="hero-stats flex flex-wrap justify-center gap-0">
            {[
              { val: '2.4', suffix: 'B+', label: '24h Volume', pre: '$' },
              { val: '10', suffix: 'K+', label: 'Active Traders', pre: '' },
              { val: '2.5', suffix: '%', label: 'Max Daily Return', pre: '' },
              { val: '99.9', suffix: '%', label: 'Uptime SLA', pre: '' },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex-1 min-w-[120px] py-5 px-6 text-center ${
                  i < 3 ? 'border-r border-[#1a1a28]' : ''
                }`}
              >
                <div className="text-[24px] font-extrabold tracking-tighter font-mono text-[#e8e8f0]">
                  {s.pre}
                  <Counter
                    target={parseFloat(s.val)}
                    suffix={s.suffix}
                    decimals={s.val.includes('.') ? 1 : 0}
                  />
                </div>
                <div className="text-[10px] text-[#4a4a64] mt-1.5 font-semibold tracking-[0.1em] uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ LIVE TRADINGVIEW CHART ══════════════════ */}
      <section
        ref={chartRef2}
        className="py-20 px-6 md:px-14 bg-[#0a0a16] border-y border-[#1a1a28]"
      >
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div
            className={`reveal ${
              chartIn ? 'visible' : ''
            } flex flex-wrap justify-between items-end gap-5 mb-8`}
          >
            <div>
              <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-2">
                Real-Time Price
              </div>
              <div className="text-[28px] font-extrabold tracking-tighter">
                Live Chart
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {coins.map((c, i) => (
                <button
                  key={c.sym}
                  onClick={() => setActiveCoin(i)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-200 ${
                    activeCoin === i
                      ? 'border-[#00c896] text-[#00c896] bg-[rgba(0,200,150,0.08)]'
                      : 'border-[#1e1e30] text-[#6b6b85] hover:border-[#2a2a3e]'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.sym}
                </button>
              ))}
            </div>
          </div>

          {/* Chart + Stats side by side */}
          <div
            className={`reveal stagger-2 ${
              chartIn ? 'visible' : ''
            } flex flex-col lg:flex-row gap-4`}
          >
            {/* TradingView */}
            <div
              className="flex-1 rounded-2xl border border-[#1a1a28] overflow-hidden bg-[#0c0c18]"
              style={{ height: 460 }}
            >
              <TradingViewWidget symbol={coin.tv} />
            </div>

            {/* Right stats column */}
            <div className="flex flex-col gap-3 lg:w-[220px]">
              {/* Price card */}
              <div className="rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-5">
                <div className="text-[10px] text-[#4a4a64] font-semibold tracking-wider uppercase mb-2">
                  {coin.name}
                </div>
                <div className="text-[28px] font-bold font-mono text-[#e8e8f0] tracking-tighter">
                  ${coin.price.toLocaleString()}
                </div>
                <div
                  className={`text-[13px] font-bold font-mono mt-1 ${
                    isUp ? 'text-[#00c896]' : 'text-[#ff5b6e]'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3 h-3 inline" />
                  ) : (
                    <ArrowDown className="w-3 h-3 inline" />
                  )}{' '}
                  {isUp ? '+' : ''}
                  {coin.chg}% 24h
                </div>
                <div className="mt-4 h-px bg-[#1a1a28]" />
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: 'Volume 24h', val: coin.vol },
                    { label: 'Market Cap', val: coin.cap },
                    {
                      label: 'High 24h',
                      val: `$${(coin.price * 1.012).toFixed(
                        coin.price > 100 ? 0 : 3
                      )}`,
                    },
                    {
                      label: 'Low 24h',
                      val: `$${(coin.price * 0.988).toFixed(
                        coin.price > 100 ? 0 : 3
                      )}`,
                    },
                  ].map(s => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-[11px] text-[#4a4a64]">{s.label}</span>
                      <span className="text-[11px] font-bold font-mono text-[#9898b0]">
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sparkline card */}
              <div className="flex-1 rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-5 flex flex-col justify-between">
                <div className="text-[10px] text-[#4a4a64] font-semibold tracking-wider uppercase mb-3">
                  7-Day Trend
                </div>
                <Sparkline history={coin.history} color={coin.color} up={coin.chg >= 0} />
                <Link
                  to="/trade"
                  className="mt-4 w-full py-2.5 rounded-lg bg-[#00c896] text-black text-[11px] font-extrabold hover:bg-[#00dea8] transition-all hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] text-center block"
                >
                  Trade {coin.sym} <ArrowRight className="w-3 h-3 inline ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ HEAT MAP ══════════════════ */}
      <section ref={heatRef} className="py-20 px-6 md:px-14">
        <div className="max-w-[1280px] mx-auto">
          <div className={`reveal ${heatIn ? 'visible' : ''} mb-10`}>
            <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-2">
              Market Pulse
            </div>
            <div className="text-[28px] font-extrabold tracking-tighter">
              Crypto Heat Map
            </div>
          </div>
          <div
            className={`reveal stagger-2 ${
              heatIn ? 'visible' : ''
            } grid gap-2`}
            style={{
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridTemplateRows: 'repeat(3, 80px)',
            }}
          >
            {heatData.map((h, i) => {
              const intensity = Math.min(Math.abs(h.chg) / 6, 1);
              const bg =
                h.chg >= 0
                  ? `rgba(0, 200, 150, ${0.1 + intensity * 0.35})`
                  : `rgba(255, 91, 110, ${0.1 + intensity * 0.35})`;
              const textColor = h.chg >= 0 ? '#00c896' : '#ff5b6e';
              const span =
                h.size === 'large'
                  ? 'col-span-2 row-span-2'
                  : h.size === 'medium'
                  ? 'col-span-2 row-span-1'
                  : 'col-span-2 row-span-1';
              return (
                <div
                  key={h.sym}
                  className={`${span} rounded-xl border flex flex-col items-center justify-center cursor-pointer card-hover`}
                  style={{
                    background: bg,
                    borderColor:
                      h.chg >= 0
                        ? 'rgba(0,200,150,0.15)'
                        : 'rgba(255,91,110,0.15)',
                  }}
                >
                  <div className="font-mono font-bold text-[#e8e8f0] text-[13px]">
                    {h.sym}
                  </div>
                  <div
                    className="font-mono font-bold text-[11px] mt-1"
                    style={{ color: textColor }}
                  >
                    {h.chg >= 0 ? '+' : ''}
                    {h.chg}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fear & Greed + Dominance side by side */}
          <div
            className={`reveal stagger-3 ${
              heatIn ? 'visible' : ''
            } mt-4 grid grid-cols-1 md:grid-cols-2 gap-4`}
          >
            {/* Fear & Greed */}
            <div className="rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-6 flex items-center gap-8">
              <div className="relative w-[120px] h-[120px] flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#1a1a28"
                    strokeWidth="7"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="#00c896"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="226"
                    strokeDashoffset={226 - (fearIndex / 100) * 226}
                    style={{ transition: 'stroke-dashoffset 2s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[24px] font-extrabold font-mono text-[#e8e8f0]">
                    {fearIndex}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#4a4a64] font-bold tracking-wider uppercase mb-1">
                  Fear & Greed Index
                </div>
                <div className="text-[22px] font-extrabold text-[#00c896] tracking-tight">
                  Greed
                </div>
                <p className="text-[12px] text-[#6b6b85] mt-2 leading-relaxed max-w-[220px]">
                  Market sentiment is strongly bullish. Investors are optimistic.
                </p>
              </div>
            </div>

            {/* BTC Dominance */}
            <div className="rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-6">
              <div className="text-[10px] text-[#4a4a64] font-bold tracking-wider uppercase mb-4">
                Market Dominance
              </div>
              <div className="space-y-3">
                {[
                  { sym: 'BTC', color: '#f7931a', pct: 52.4 },
                  { sym: 'ETH', color: '#627eea', pct: 17.8 },
                  { sym: 'Others', color: '#4a4a64', pct: 29.8 },
                ].map(d => (
                  <div key={d.sym}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-[#9898b0]">{d.sym}</span>
                      <span className="font-mono text-[#6b6b85]">{d.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1a1a28] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: heatIn ? `${d.pct}%` : '0%',
                          background: d.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ MARKET TABLE ══════════════════ */}
      <section
        ref={marketRef}
        className="py-20 px-6 md:px-14 bg-[#0a0a16] border-y border-[#1a1a28]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className={`reveal ${marketIn ? 'visible' : ''} mb-10`}>
            <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-2">
              Markets
            </div>
            <div className="text-[28px] font-extrabold tracking-tighter">
              Top Assets
            </div>
          </div>
          <div
            className={`reveal stagger-1 ${
              marketIn ? 'visible' : ''
            } overflow-x-auto rounded-2xl border border-[#1a1a28]`}
          >
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-[#1a1a28]">
                  {[
                    '#',
                    'Asset',
                    'Price',
                    '24h Change',
                    'Volume',
                    'Market Cap',
                    '7d Chart',
                    'Action',
                  ].map(h => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[10px] font-bold text-[#4a4a64] tracking-[0.12em] uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coins.map((c, i) => {
                  const up = c.chg >= 0;
                  return (
                    <tr
                      key={c.sym}
                      className="border-b border-[#0f0f1c] hover:bg-[rgba(255,255,255,0.015)] transition-colors group cursor-pointer"
                    >
                      <td className="px-5 py-4 text-[12px] text-[#3a3a58] font-mono">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold font-mono flex-shrink-0"
                            style={{ background: c.bg, color: c.color }}
                          >
                            {c.sym[0]}
                          </div>
                          <div>
                            <div className="font-bold text-[12px] text-[#e8e8f0] group-hover:text-[#00c896] transition-colors">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-[#4a4a64] font-mono">
                              {c.sym}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-[13px] text-[#e8e8f0]">
                        ${c.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                            up
                              ? 'bg-[rgba(0,200,150,0.1)] text-[#00c896]'
                              : 'bg-[rgba(255,91,110,0.1)] text-[#ff5b6e]'
                          }`}
                        >
                          {up ? (
                            <ArrowUp className="w-3 h-3 inline" />
                          ) : (
                            <ArrowDown className="w-3 h-3 inline" />
                          )}{' '}
                          {Math.abs(c.chg)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#6b6b85] font-mono">
                        {c.vol}
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#6b6b85] font-mono">
                        {c.cap}
                      </td>
                      <td className="px-5 py-4">
                        <Sparkline history={c.history} color={c.color} up={up} />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to="/trade"
                          onClick={() => setActiveCoin(i)}
                          className="px-4 py-1.5 rounded-lg border border-[#2a2a3e] text-[#00c896] text-[11px] font-bold hover:bg-[rgba(0,200,150,0.08)] hover:border-[#00c896] transition-all"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════ PLANS ══════════════════ */}
      <section ref={plansRef} className="py-20 px-6 md:px-14">
        <div className="max-w-[1280px] mx-auto">
          <div
            className={`reveal text-center max-w-[480px] mx-auto mb-14 ${
              plansIn ? 'visible' : ''
            }`}
          >
            <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-3">
              Investment Plans
            </div>
            <div className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-tighter leading-[1.1]">
              Grow Your Capital
            </div>
            <p className="text-[14px] text-[#6b6b85] mt-4 leading-relaxed">
              Choose a plan and start earning daily passive returns from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Basic',
                rate: '1.2',
                lock: '30-day',
                min: '$50',
                max: '$999',
                features: [
                  'Instant withdrawals',
                  'Real-time dashboard',
                  'Email support',
                  'Basic analytics',
                ],
                featured: false,
              },
              {
                name: 'Silver',
                rate: '1.8',
                lock: '14-day',
                min: '$1,000',
                max: '$4,999',
                features: [
                  'Priority withdrawals',
                  'Advanced analytics',
                  'Referral bonuses',
                  'Live chat support',
                  'Portfolio insights',
                ],
                featured: true,
              },
              {
                name: 'Gold',
                rate: '2.5',
                lock: '7-day',
                min: '$5,000',
                max: '$24,999',
                features: [
                  'Instant withdrawals',
                  'Dedicated manager',
                  'OTC trading access',
                  'API access',
                  'VIP events',
                ],
                featured: false,
              },
            ].map((plan, i) => (
              <div
                key={plan.name}
                className={`reveal stagger-${i + 1} ${
                  plansIn ? 'visible' : ''
                } relative rounded-2xl p-8 border card-hover ${
                  plan.featured
                    ? 'border-[#00c896] plan-featured'
                    : 'border-[#1a1a28] bg-[#0c0c18]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00c896] text-black text-[9px] font-extrabold px-4 py-1 rounded-full tracking-[0.12em] uppercase whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className="text-[11px] font-bold text-[#4a4a64] tracking-[0.14em] uppercase mb-5">
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[56px] font-extrabold font-mono leading-none text-[#e8e8f0] tracking-tighter">
                    {plan.rate}
                  </span>
                  <span className="text-[22px] font-bold text-[#00c896] mb-2">%</span>
                </div>
                <div className="text-[11px] text-[#4a4a64] mb-7">
                  daily return · {plan.lock} lock
                </div>
                <div className="h-px bg-[#1a1a28] mb-7" />
                <div className="space-y-3 mb-7">
                  {plan.features.map(f => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 text-[12px] text-[#9898b0]"
                    >
                      <Check
                        className="w-3.5 h-3.5 text-[#00c896]"
                        strokeWidth={2.5}
                      />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-4 border-t border-b border-[#1a1a28] mb-7">
                  <div className="text-center">
                    <div className="font-mono text-[13px] font-bold text-[#e8e8f0]">
                      {plan.min}
                    </div>
                    <div className="text-[9px] text-[#4a4a64] mt-1 tracking-wider uppercase">
                      Min
                    </div>
                  </div>
                  <div className="w-px bg-[#1a1a28]" />
                  <div className="text-center">
                    <div className="font-mono text-[13px] font-bold text-[#e8e8f0]">
                      {plan.max}
                    </div>
                    <div className="text-[9px] text-[#4a4a64] mt-1 tracking-wider uppercase">
                      Max
                    </div>
                  </div>
                </div>
                <Link
                  to="/register"
                  className={`w-full py-3 rounded-xl text-[12px] font-extrabold transition-all duration-300 block text-center ${
                    plan.featured
                      ? 'bg-[#00c896] text-black hover:bg-[#00dea8] hover:shadow-[0_0_28px_rgba(0,200,150,0.4)]'
                      : 'bg-[#181826] text-[#e8e8f0] border border-[#2a2a3e] hover:border-[#00c896] hover:text-[#00c896]'
                  }`}
                >
                  Start with {plan.name}
                </Link>
              </div>
            ))}
          </div>

          {/* ROI Calculator */}
          <div
            className={`reveal stagger-4 ${
              plansIn ? 'visible' : ''
            } mt-8 rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-8`}
          >
            <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-2">
              ROI Calculator
            </div>
            <div className="text-[18px] font-extrabold tracking-tight mb-6">
              Project Your Earnings
            </div>
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ══════════════════ FEATURES ══════════════════ */}
      <section
        ref={featRef}
        className="py-20 px-6 md:px-14 bg-[#0a0a16] border-y border-[#1a1a28]"
      >
        <div className="max-w-[1280px] mx-auto">
          <div
            className={`reveal text-center max-w-[500px] mx-auto mb-14 ${
              featIn ? 'visible' : ''
            }`}
          >
            <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-3">
              Why Wix Capital
            </div>
            <div className="text-[clamp(28px,3.5vw,44px)] font-extrabold tracking-tighter leading-[1.1]">
              Built for serious traders
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Bank-Grade Security',
                desc: '256-bit SSL encryption, mandatory 2FA, and cold storage for 95% of assets. Your funds are always protected.',
                tag: 'Security',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Lightning Transactions',
                desc: 'Deposits credited in seconds. Withdrawals processed in under 60 minutes, 24/7, every day of the year.',
                tag: 'Speed',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Real-Time Markets',
                desc: 'Live price feeds, advanced charting with 50+ indicators, and deep order book data across 150+ pairs.',
                tag: 'Analytics',
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: 'Daily Passive Income',
                desc: 'Earn up to 2.5% daily returns on invested capital through our algorithmic trading strategies.',
                tag: 'Returns',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Referral Program',
                desc: "Earn 5% commission on every referral's investment, automatically compounded as they grow.",
                tag: 'Social',
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'KYC Compliant',
                desc: 'Fully regulated, KYC-verified platform operating under global compliance standards and AML protocols.',
                tag: 'Compliance',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`reveal stagger-${
                  (i % 3) + 1
                } ${
                  featIn ? 'visible' : ''
                } rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-7 card-hover group`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(0,200,150,0.07)] border border-[rgba(0,200,150,0.12)] flex items-center justify-center text-[#00c896] group-hover:scale-110 transition-transform duration-300">
                    {f.icon}
                  </div>
                  <span className="text-[9px] font-bold text-[#4a4a64] tracking-wider uppercase border border-[#1a1a28] px-2 py-1 rounded-full">
                    {f.tag}
                  </span>
                </div>
                <div className="text-[14px] font-bold text-[#e8e8f0] mb-2.5 group-hover:text-[#00c896] transition-colors">
                  {f.title}
                </div>
                <div className="text-[12px] text-[#6b6b85] leading-relaxed">
                  {f.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEWS ══════════════════ */}
      <section ref={newsRef} className="py-20 px-6 md:px-14">
        <div className="max-w-[1280px] mx-auto">
          <div
            className={`reveal flex justify-between items-end mb-10 ${
              newsIn ? 'visible' : ''
            }`}
          >
            <div>
              <div className="text-[10px] font-bold text-[#00c896] tracking-[0.18em] uppercase mb-2">
                Latest Updates
              </div>
              <div className="text-[28px] font-extrabold tracking-tighter">
                Crypto News
              </div>
            </div>
            <Link
              to="#"
              className="text-[11px] font-bold text-[#00c896] hover:text-[#00dea8] transition-colors"
            >
              View all <ArrowRight className="w-3 h-3 inline ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((n, i) => (
              <div
                key={i}
                className={`reveal stagger-${
                  (i % 3) + 1
                } ${
                  newsIn ? 'visible' : ''
                } rounded-2xl border border-[#1a1a28] bg-[#0c0c18] p-6 card-hover group cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-5">
                  <span className="text-[9px] font-bold text-[#00c896] tracking-wider uppercase border border-[rgba(0,200,150,0.2)] bg-[rgba(0,200,150,0.05)] px-2.5 py-1 rounded-full">
                    {n.tag}
                  </span>
                  <span className="text-[10px] text-[#3a3a58] font-mono">
                    {n.time}
                  </span>
                </div>
                <div className="text-[30px] mb-3">{n.icon}</div>
                <div className="text-[13px] font-bold text-[#9898b0] leading-snug group-hover:text-[#e8e8f0] transition-colors">
                  {n.title}
                </div>
                <div className="mt-4 text-[11px] text-[#00c896] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more <ArrowRight className="w-3 h-3 inline ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ MARQUEE LOGOS (Trust band) ══════════════════ */}
      <div className="py-10 border-y border-[#1a1a28] bg-[#0a0a16] overflow-hidden">
        <div className="flex gap-16 marquee-track whitespace-nowrap">
          {[...Array(3)].flatMap(() =>
            [
              'Binance',
              'Coinbase',
              'Kraken',
              'Ledger',
              'Chainlink',
              'Fireblocks',
              'Chainalysis',
              'Consensys',
            ].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="text-[13px] font-bold text-[#2a2a3e] tracking-wider uppercase"
              >
                {b}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════ CTA ══════════════════ */}
      <section
        ref={ctaRef}
        className="py-28 px-6 md:px-14 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
          <div
            className="absolute w-[600px] h-[600px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 morphing"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,200,150,0.06) 0%, transparent 65%)',
              animationDelay: '-2s',
            }}
          />
        </div>
        <div
          className={`reveal-scale ${
            ctaIn ? 'visible' : ''
          } max-w-[640px] mx-auto text-center relative z-10`}
        >
          <div className="text-[10px] font-bold text-[#00c896] tracking-[0.2em] uppercase mb-5">
            Start Today
          </div>
          <div className="text-[clamp(32px,5vw,64px)] font-extrabold tracking-tighter leading-[1.05] mb-6">
            Ready to <span className="grad-text">grow</span>
            <br />
            your wealth?
          </div>
          <p className="text-[14px] text-[#6b6b85] max-w-[420px] mx-auto leading-relaxed mb-10">
            Join over 10,000 investors already earning daily passive returns on Wix
            Capital.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-10 py-4 rounded-xl text-[14px] font-extrabold bg-[#00c896] text-black hover:bg-[#00dea8] hover:shadow-[0_0_50px_rgba(0,200,150,0.4)] transition-all duration-300 inline-flex items-center"
            >
              Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              to="/about"
              className="px-10 py-4 rounded-xl text-[14px] font-bold border border-[#2a2a3e] text-[#6b6b85] hover:text-[#e8e8f0] hover:border-[#3a3a56] transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t border-[#1a1a28] bg-[#05050d] px-6 md:px-14 pt-16 pb-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2">
              <Link
                to="/"
                className="flex items-center gap-2 text-[16px] font-extrabold mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
                <span>Wix</span>
                <span className="grad-text">Capital</span>
              </Link>
              <p className="text-[12px] text-[#4a4a64] leading-relaxed max-w-[240px]">
                Institutional-grade crypto trading platform built for modern investors.
              </p>
              <div className="flex gap-3 mt-5">
                <Link
                  to="#"
                  className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                >
                  <Link2 className="w-4 h-4" />
                </Link>
                <Link
                  to="#"
                  className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                >
                  <Link2 className="w-4 h-4" />
                </Link>
                <Link
                  to="#"
                  className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                >
                  <Link2 className="w-4 h-4" />
                </Link>
                <Link
                  to="#"
                  className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {[
              {
                title: 'Platform',
                links: [
                  { label: 'Markets', to: '/markets' },
                  { label: 'Trade', to: '/trade' },
                  { label: 'Invest', to: '/invest' },
                  { label: 'Analytics', to: '/analytics' },
                  { label: 'API', to: '#' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'About', to: '/about' },
                  { label: 'Blog', to: '#' },
                  { label: 'Careers', to: '/careers' },
                  { label: 'Press', to: '#' },
                  { label: 'Contact', to: '/contact' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy', to: '#' },
                  { label: 'Terms', to: '#' },
                  { label: 'Cookie Policy', to: '#' },
                  { label: 'Compliance', to: '#' },
                  { label: 'AML Policy', to: '#' },
                ],
              },
            ].map(col => (
              <div key={col.title}>
                <div className="text-[10px] font-bold text-[#4a4a64] tracking-[0.14em] uppercase mb-4">
                  {col.title}
                </div>
                <div className="space-y-2.5">
                  {col.links.map(l => (
                    <Link
                      key={l.label}
                      to={l.to}
                      className="block text-[12px] text-[#4a4a64] hover:text-[#9898b0] transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="h-px bg-[#0f0f1c] mb-8" />
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-[11px] text-[#2a2a3e]">
              © 2026 Wix Capital. All rights reserved.
            </div>
            <div className="text-[11px] text-[#2a2a3e]">
              Risk warning: Crypto investments involve significant risk. Past
              performance ≠ future results.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ──────────────────────────────────────────────
   ROI CALCULATOR (embedded)
────────────────────────────────────────────── */
function RoiCalculator() {
  const [amount, setAmount] = useState(1000);
  const [days, setDays] = useState(30);
  const [rate, setRate] = useState(1.8);

  const daily = amount * (rate / 100);
  const total = amount * Math.pow(1 + rate / 100, days);
  const profit = total - amount;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-[11px] text-[#4a4a64] mb-2">
            <span>Investment Amount</span>
            <span className="font-mono text-[#e8e8f0]">
              ${amount.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="25000"
            step="50"
            value={amount}
            onChange={e => setAmount(+e.target.value)}
            className="w-full accent-[#00c896] cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-[#4a4a64] mb-2">
            <span>Duration (Days)</span>
            <span className="font-mono text-[#e8e8f0]">{days} days</span>
          </div>
          <input
            type="range"
            min="7"
            max="365"
            step="1"
            value={days}
            onChange={e => setDays(+e.target.value)}
            className="w-full accent-[#00c896] cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-[#4a4a64] mb-2">
            <span>Daily Return</span>
            <span className="font-mono text-[#00c896]">{rate}%</span>
          </div>
          <div className="flex gap-2">
            {[1.2, 1.8, 2.5].map(r => (
              <button
                key={r}
                onClick={() => setRate(r)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold border transition-all ${
                  rate === r
                    ? 'border-[#00c896] text-[#00c896] bg-[rgba(0,200,150,0.08)]'
                    : 'border-[#1a1a28] text-[#4a4a64]'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-[#1a1a28] bg-[#07070e] p-6 space-y-5">
        <div>
          <div className="text-[10px] text-[#4a4a64] font-bold tracking-wider uppercase mb-1">
            Daily Earnings
          </div>
          <div className="text-[28px] font-extrabold font-mono text-[#e8e8f0]">
            ${daily.toFixed(2)}
          </div>
        </div>
        <div className="h-px bg-[#1a1a28]" />
        <div>
          <div className="text-[10px] text-[#4a4a64] font-bold tracking-wider uppercase mb-1">
            Total Profit
          </div>
          <div className="text-[28px] font-extrabold font-mono text-[#00c896]">
            +${profit.toFixed(2)}
          </div>
        </div>
        <div className="h-px bg-[#1a1a28]" />
        <div>
          <div className="text-[10px] text-[#4a4a64] font-bold tracking-wider uppercase mb-1">
            Total Value After {days}d
          </div>
          <div className="text-[20px] font-extrabold font-mono text-[#e8e8f0]">
            ${total.toFixed(2)}
          </div>
        </div>
        <div className="text-[10px] text-[#3a3a58] mt-1">
          * Compound interest calculated daily
        </div>
      </div>
    </div>
  );
}

export default WixCapitalDashboard;