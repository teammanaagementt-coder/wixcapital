import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.1, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedCounter({ end, suffix = "", duration = 2200 }) {
  const [val, setVal] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const steps = 80;
    const inc = end / steps;
    const t = setInterval(() => {
      current += inc;
      if (current >= end) { setVal(end); clearInterval(t); }
      else setVal(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const COINS = [
  { sym: "BTC",  name: "Bitcoin",   price: 67420.15, chg: 3.81, color: "#f7931a", dot: "#f7931a" },
  { sym: "BNB",  name: "BNB",       price: 603.37,   chg: 1.66, color: "#f3ba2f", dot: "#f3ba2f" },
  { sym: "SOL",  name: "Solana",    price: 66.94,    chg: 2.99, color: "#9945ff", dot: "#9945ff" },
  { sym: "XRP",  name: "XRP",       price: 1.1600,   chg: 2.13, color: "#346aa9", dot: "#346aa9" },
  { sym: "ADA",  name: "Cardano",   price: 0.614,    chg:-1.20, color: "#4a9dff", dot: "#888" },
  { sym: "ETH",  name: "Ethereum",  price: 3842.00,  chg: 1.85, color: "#627eea", dot: "#627eea" },
  { sym: "AVAX", name: "Avalanche", price: 42.18,    chg: 3.21, color: "#e84142", dot: "#e84142" },
];

const PLANS = [
  { name: "Starter", duration: "2 Weeks",  min: "$1,000",  profit: "$200",    featured: false },
  { name: "Growth",  duration: "1 Month",  min: "$2,000",  profit: "$500",    featured: false },
  { name: "Pro",     duration: "2 Months", min: "$4,000",  profit: "$1,000",  featured: true  },
  { name: "Elite",   duration: "3 Months", min: "$10,000", profit: "$2,000",  featured: false },
  { name: "Premium", duration: "6 Months", min: "$20,000", profit: "$5,000",  featured: false },
];

const TESTIMONIALS = [
  { name: "Sarah Thompson",  role: "Retail Investor",    img: "https://www.tescryptvest.com/woman1.jpg", text: "aWixCapita made my crypto journey so easy! The platform is secure, user-friendly, and their support team is always there when I need them." },
  { name: "Michael Chen",    role: "Day Trader",         img: "https://www.tescryptvest.com/man1.jpeg",  text: "I've been trading on aWixCapita for over a year and I love the seamless experience. Their security features give me complete peace of mind." },
  { name: "Emily Rodriguez", role: "First-time Investor",img: "https://www.tescryptvest.com/woman2.png", text: "As a beginner, I was nervous about crypto, but Tescryptvest's interface and resources made it simple to start. Highly recommend to anyone!" },
  { name: "Fred Rodriguez",  role: "Portfolio Manager",  img: "https://www.tescryptvest.com/man2.jpg",   text: "The best crypto platform I've used. Fast deposits, great customer service, and top-notch security. aWixCapita is a genuine game-changer." },
];

const PARTICLES = [
  {x:8,y:15,s:2.5},{x:15,y:42,s:1.5},{x:22,y:8,s:2},{x:30,y:65,s:1.5},{x:40,y:25,s:3},
  {x:52,y:50,s:1.5},{x:60,y:18,s:2.5},{x:68,y:72,s:2},{x:75,y:35,s:1.5},{x:82,y:55,s:2.5},
  {x:88,y:12,s:1.5},{x:93,y:80,s:2},{x:12,y:85,s:2},{x:45,y:88,s:1.5},{x:70,y:90,s:2.5},
  {x:35,y:45,s:1.5},{x:58,y:62,s:2},{x:78,y:22,s:1.5},{x:20,y:60,s:2},{x:90,y:45,s:1.5},
  {x:5,y:55,s:2.5},{x:48,y:10,s:2},{x:65,y:82,s:1.5},{x:82,y:8,s:2},{x:25,y:30,s:1.5},
];

export default function Tescryptvest() {
  const [coins, setCoins] = useState(COINS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes';
      document.head.appendChild(meta);
    }
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = ''; };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setCoins(prev => prev.map(c => ({
        ...c,
        price: parseFloat((c.price * (1 + (Math.random() - 0.499) * 0.0008)).toFixed(c.price > 100 ? 2 : 4))
      })));
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          "width": "100%",
          "height": 500,
          "symbol": "BITSTAMP:BTCUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#0d0600",
          "enable_publishing": false,
          "allow_symbol_change": true,
          "container_id": "tv-chart-container",
          "studies": ["RSI@tv-basicstudies"]
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      const s = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (s && s.parentNode) s.parentNode.removeChild(s);
    };
  }, []);

  const [featRef,  featIn]  = useInView();
  const [statsRef, statsIn] = useInView();
  const [secRef,   secIn]   = useInView();
  const [trustRef, trustIn] = useInView();
  const [plansRef, plansIn] = useInView();
  const [testRef,  testIn]  = useInView();
  const [ctaRef,   ctaIn]   = useInView();
  const [partRef,  partIn]  = useInView();

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html{scroll-behavior:smooth;}
    body{background:#0d0600; font-family: 'Syne', sans-serif; overflow-x: hidden;}
    img, svg, video, iframe { max-width: 100%; height: auto; display: block; }

    @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .ticker-track{animation:ticker 45s linear infinite;display:flex;white-space:nowrap; min-width: max-content;}
    .ticker-track:hover{animation-play-state:paused;}

    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .marquee-track{animation:marquee 28s linear infinite;display:flex;white-space:nowrap;}

    .reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease;}
    .reveal.in{opacity:1;transform:translateY(0);}
    .reveal-left{opacity:0;transform:translateX(-30px);transition:opacity 0.7s ease,transform 0.7s ease;}
    .reveal-left.in{opacity:1;transform:translateX(0);}
    .reveal-right{opacity:0;transform:translateX(30px);transition:opacity 0.7s ease,transform 0.7s ease;}
    .reveal-right.in{opacity:1;transform:translateX(0);}
    .reveal-scale{opacity:0;transform:scale(0.94);transition:opacity 0.6s ease,transform 0.6s ease;}
    .reveal-scale.in{opacity:1;transform:scale(1);}
    .d1{transition-delay:0.05s!important}
    .d2{transition-delay:0.15s!important}
    .d3{transition-delay:0.25s!important}
    .d4{transition-delay:0.35s!important}
    .d5{transition-delay:0.45s!important}
    .d6{transition-delay:0.55s!important}

    @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    .hero-tag{animation:slideUp 0.7s 0.1s both ease;}
    .hero-sub-tag{animation:slideUp 0.7s 0.2s both ease;}
    .hero-h1{animation:slideUp 0.8s 0.3s both ease;}
    .hero-p{animation:slideUp 0.7s 0.55s both ease;}
    .hero-btns{animation:slideUp 0.7s 0.7s both ease;}
    .hero-social{animation:slideUp 0.7s 0.85s both ease;}
    .hero-right-tag{animation:slideUp 0.7s 0.2s both ease;}
    .hero-cards{animation:slideUp 0.8s 0.4s both ease;}
    .hero-confidence{animation:slideUp 0.7s 0.6s both ease;}

    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .float-card{animation:floatY 5s ease-in-out infinite;}
    .float-card-2{animation:floatY 6s 1.5s ease-in-out infinite;}

    @keyframes particlePulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}

    @keyframes glowPulse{0%,100%{opacity:1;box-shadow:0 0 6px #f97316}50%{opacity:0.4;box-shadow:0 0 14px #f97316}}
    .glow-dot{animation:glowPulse 2s ease-in-out infinite;}
    @keyframes glowGreen{0%,100%{opacity:1;box-shadow:0 0 6px #22c55e}50%{opacity:0.4;box-shadow:0 0 14px #22c55e}}
    .glow-green{animation:glowGreen 2s ease-in-out infinite;}

    .plan-card{transition:transform 0.3s ease,box-shadow 0.3s ease,border-color 0.3s ease;}
    .plan-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(249,115,22,0.12);}

    .feat-card{transition:transform 0.3s ease,border-color 0.3s ease;}
    .feat-card:hover{transform:translateY(-4px);border-color:rgba(249,115,22,0.3)!important;}

    .nav-link{color:#a89070;font-size:14px;text-decoration:none;font-weight:500;transition:color 0.2s;padding:8px 18px;border-radius:999px;position:relative;white-space:nowrap;}
    .nav-link:hover{color:#fff;}
    .nav-link.active{color:#fff;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.08);}

    .btn-orange{background:#f97316;color:#fff;border:none;border-radius:999px;padding:14px 32px;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-family: 'Syne', sans-serif;}
    .btn-orange:hover{background:#fb923c;box-shadow:0 0 30px rgba(249,115,22,0.45);}
    .btn-dark{background:rgba(255,255,255,0.06);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:14px 30px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-family: 'Syne', sans-serif;}
    .btn-dark:hover{background:rgba(255,255,255,0.1);border-color:rgba(255,255,255,0.2);}
    .btn-outline-orange{background:transparent;color:#f97316;border:1px solid rgba(249,115,22,0.4);border-radius:10px;padding:11px 24px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-family: 'Syne', sans-serif;}
    .btn-outline-orange:hover{background:rgba(249,115,22,0.08);border-color:#f97316;}

    @keyframes scrollBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
    .scroll-arrow{animation:scrollBounce 1.8s ease-in-out infinite;}

    .glass{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;backdrop-filter:blur(12px);}
    .glass-warm{background:rgba(30,12,0,0.6);border:1px solid rgba(249,115,22,0.12);border-radius:16px;backdrop-filter:blur(12px);}

    @keyframes secGlow{0%,100%{filter:drop-shadow(0 0 20px rgba(249,115,22,0.2))}50%{filter:drop-shadow(0 0 40px rgba(249,115,22,0.4))}}
    .sec-img{animation:secGlow 4s ease-in-out infinite;}

    .circuit-line{stroke:#f97316;stroke-width:0.5;opacity:0.08;fill:none;}

    .mobile-menu {
      position: fixed;
      top: 70px;
      left: 0;
      width: 100%;
      background: rgba(13,6,0,0.98);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(249,115,22,0.2);
      z-index: 100;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      transform: translateY(-100%);
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    .mobile-menu a, .mobile-menu .btn-orange {
      color: #e0c9a0;
      text-decoration: none;
      padding: 12px 16px;
      font-weight: 600;
      border-radius: 12px;
      transition: background 0.2s;
      font-size: 16px;
      display: block;
    }
    .mobile-menu a:hover, .mobile-menu a:active {
      background: rgba(249,115,22,0.15);
      color: #f97316;
    }
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 26px;
      height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 110;
    }
    .hamburger span {
      width: 100%;
      height: 2px;
      background: #f97316;
      border-radius: 2px;
      transition: all 0.2s;
    }

    /* === RESPONSIVE OVERRIDES === */
    @media (max-width: 1024px) {
      .hero-cards { margin-left: 0 !important; align-items: center !important; }
      .hero-confidence { display: none; }
    }
    @media (max-width: 768px) {
      .desktop-only { display: none !important; }
      .hamburger { display: flex; }
      .hero-h1-text { font-size: clamp(42px, 12vw, 80px) !important; line-height: 1.1; }
      .hero-cards { align-items: center !important; margin-top: 40px; width: 100%; }
      .glass-warm { max-width: 100% !important; }
      .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .feat-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .footer-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px !important; }
      .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
      section { padding-left: 20px !important; padding-right: 20px !important; }
      .tv-chart-wrapper { margin: 0 -20px; width: calc(100% + 40px); border-radius: 0; }
      #tv-chart-container { height: 350px !important; }
      .stats-grid > div { border-right: none !important; }
      .partners-container > div { border-right: none !important; }
      .terms-grid { grid-template-columns: 1fr !important; }
      .terms-grid > div { border-right: none !important; }
    }
    @media (max-width: 640px) {
      .plans-grid { grid-template-columns: 1fr !important; }
      .stats-grid { grid-template-columns: 1fr !important; }
      .trust-grid { grid-template-columns: 1fr !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .hero-btns { flex-direction: column; align-items: stretch; }
      .hero-btns a { width: 100%; text-align: center; }
      .btn-orange, .btn-dark { padding: 14px 24px; font-size: 14px; }
    }

    .tv-chart-wrapper {
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(249,115,22,0.15);
      background: #0a0400;
      padding: 8px;
    }
    #tv-chart-container {
      height: 500px;
      width: 100%;
    }
  `;

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#0d0600", color: "#fff", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* TICKER */}
      <div style={{ background: "#080300", borderBottom: "1px solid rgba(249,115,22,0.1)", height: 36, overflow: "hidden", display: "flex", alignItems: "center", position: "relative", zIndex: 60 }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderRight: "1px solid rgba(249,115,22,0.15)", height: "100%", background: "#0d0400" }}>
          <span className="glow-dot" style={{ width: 7, height: 7, background: "#f97316", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "#f97316", letterSpacing: "0.12em", fontFamily: "'Space Mono', monospace" }}>LIVE</span>
        </div>
        <div className="ticker-track" style={{ flex: 1, overflow: "hidden" }}>
          {[...coins, ...coins, ...coins, ...coins].map((c, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 20px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#ccc", letterSpacing: "0.04em", fontFamily: "'Space Mono', monospace" }}>{c.sym}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", fontVariantNumeric: "tabular-nums", fontFamily: "'Space Mono', monospace" }}>${c.price.toLocaleString()}</span>
              <span style={{ fontSize: 10, fontWeight: 700, background: c.chg >= 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: c.chg >= 0 ? "#22c55e" : "#ef4444", padding: "1px 7px", borderRadius: 4, fontFamily: "'Space Mono', monospace" }}>
                {c.chg >= 0 ? "+" : ""}{c.chg}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(13,6,0,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(249,115,22,0.08)" : "1px solid transparent",
        transition: "all 0.35s ease",
        padding: "0 14px",  // Changed from 24px to 16px
        height: "auto",     // Changed from 70 to auto (allow it to grow if wrapping)
        minHeight: "70px",  // Keep minimum height
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",        // Reduced from 16px for tight spaces  
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 26, height: 26, position: "relative" }}>
            <svg viewBox="0 0 40 40" width="36" height="36">
              <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round"/>
              <polygon points="20,8 33,15 33,25 20,32 7,25 7,15" fill="rgba(249,115,22,0.15)" stroke="#f97316" strokeWidth="1.5"/>
              <polygon points="20,14 26,18 26,22 20,26 14,22 14,18" fill="#f97316"/>
            </svg>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" }}>
            <span style={{ color: "#fff" }}>AWix</span><span style={{ color: "#f97316" }}>Capital</span>
          </span>
        </Link>

        <div className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Trading</a>
          <a href="#" className="nav-link">Contact</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link to="/login" className="desktop-only nav-link" style={{ padding: "8px 16px" }}>Log in</Link>
          <Link to="/register" className="btn-orange" style={{ padding: "10px 26px", fontSize: 13, whiteSpace: "nowrap" }}>Get Started</Link>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <a href="#" onClick={() => setMobileOpen(false)}>Home</a>
        <a href="#" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Trading</a>
        <a href="#" onClick={() => setMobileOpen(false)}>Contact</a>
        <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
        <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-orange" style={{ textAlign: "center", marginTop: 8 }}>Get Started</Link>
      </div>

      {/* HERO SECTION */}
      <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "60px 40px 80px", flexWrap: "wrap", gap: "40px" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 60% 40%, rgba(120,40,0,0.55) 0%, rgba(13,6,0,0) 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 40% 50% at 20% 70%, rgba(80,25,0,0.3) 0%, transparent 60%)", pointerEvents: "none" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.6 }} preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(249,115,22,0.06)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <polyline points="200,100 200,200 350,200 350,300 500,300" className="circuit-line" />
          <polyline points="600,150 700,150 700,280 850,280" className="circuit-line" />
          <polyline points="100,400 200,400 200,500 400,500 400,450" className="circuit-line" />
          <line x1="750" y1="80" x2="900" y2="80" className="circuit-line" />
          <line x1="900" y1="80" x2="900" y2="200" className="circuit-line" />
        </svg>
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.s, height: p.s, borderRadius: "50%", background: "#f97316",
            animation: `particlePulse ${2 + (i % 3) * 0.8}s ${(i * 0.3) % 2}s ease-in-out infinite`,
            opacity: 0.5, pointerEvents: "none"
          }} />
        ))}
        
        <div style={{ position: "relative", zIndex: 2, flex: "1 1 500px", minWidth: "280px" }}>
          <div className="hero-tag" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(13,6,0,0.7)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 999, padding: "8px 18px", marginBottom: 24 }}>
            <span className="glow-dot" style={{ width: 7, height: 7, background: "#f97316", borderRadius: "50%", flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: 13, color: "#e0c9a0", fontWeight: 500 }}>The modern crypto investment platform</span>
          </div>
          <div className="hero-sub-tag" style={{ fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: "0.22em", marginBottom: 20, textTransform: "uppercase" }}>
            BUILD · GROW · COMPOUND
          </div>
          <h1 className="hero-h1 hero-h1-text" style={{ fontSize: "clamp(52px,7.5vw,108px)", fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: 28 }}>
            <span style={{ display: "block", color: "#fff" }}>Build wealth with</span>
            <span style={{ display: "block" }}>
              <span style={{ color: "#fff" }}>crypto </span>
              <span style={{ color: "#f97316" }}>confidence</span>
            </span>
          </h1>
          <p className="hero-p" style={{ fontSize: 16, color: "#8a7060", lineHeight: 1.75, maxWidth: 500, marginBottom: 44 }}>
            aWixCapita bridges traditional and digital finance — secure, intelligent tools to grow your portfolio with total clarity.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}>
            <a href="#plans" className="btn-orange" style={{ padding: "16px 36px", fontSize: 15, fontWeight: 800 }}>Start investing free</a>
            <a href="#plans" className="btn-dark" style={{ padding: "16px 32px", fontSize: 15 }}>Explore plans →</a>
          </div>
          <div className="hero-social" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              {[
                "https://www.tescryptvest.com/man2.jpg",
                "https://www.tescryptvest.com/woman2.png",
                "https://www.tescryptvest.com/woman1.jpg",
                "https://www.tescryptvest.com/man1.jpeg",
              ].map((src, i) => (
                <img key={i} src={src} alt="" onError={e => { e.target.src=`https://i.pravatar.cc/44?img=${i+10}`; }}
                  style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #0d0600", marginLeft: i > 0 ? -12 : 0 }} />
              ))}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>58,000+ investors</div>
              <div style={{ fontSize: 12, color: "#f97316", fontWeight: 600 }}>★ 4.9 average rating</div>
            </div>
          </div>
        </div>

        <div className="hero-cards" style={{ position: "relative", zIndex: 2, flex: "1 1 400px", minWidth: "280px", display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
          <div className="hero-right-tag" style={{ display: "flex", alignItems: "center", gap: 7, alignSelf: "flex-end", marginBottom: 4 }}>
            <span className="glow-green" style={{ width: 7, height: 7, background: "#22c55e", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#6a8060", fontWeight: 600 }}>Markets live</span>
          </div>
          <div className="glass-warm float-card" style={{ width: "100%", maxWidth: 300, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ fontSize: 11, color: "#7a5a40", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Portfolio value</span>
              <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 6 }}>+18.4%</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14 }}>$128,480</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{s:"BTC",c:"#f7931a"},{s:"ETH",c:"#627eea"},{s:"SOL",c:"#9945ff"}].map(c=>(
                <div key={c.s} style={{ flex: 1, background: c.c+"1a", border: `1px solid ${c.c}33`, borderRadius: 8, padding: "6px 0", textAlign: "center", fontSize: 10, fontWeight: 800, color: c.c }}>{c.s}</div>
              ))}
            </div>
          </div>
          <div className="glass-warm float-card-2" style={{ width: "100%", maxWidth: 300, padding: "18px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Sub-second execution</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Trade at the<br />speed of markets</div>
            <div style={{ fontSize: 11, color: "#5a4030", lineHeight: 1.6, marginBottom: 12 }}>A low-latency matching engine fills your orders in milliseconds.</div>
            <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316" }}>BUY 0.5 BTC</span>
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Filled · 14 ms</span>
            </div>
          </div>
          <div className="glass-warm" style={{ width: "100%", maxWidth: 300, padding: "18px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>Bank-grade protection</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Secured like<br />a digital vault</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["256-bit SSL", "Cold storage", "2FA"].map(t => (
                <span key={t} style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.18)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#f97316", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: "#4a3020", letterSpacing: "0.25em", fontWeight: 700, textTransform: "uppercase" }}>Scroll</span>
          <div className="scroll-arrow" style={{ width: 1, height: 28, background: "linear-gradient(to bottom, rgba(249,115,22,0.4), transparent)" }} />
        </div>
      </section>

      {/* TRADINGVIEW CHART */}
      <section style={{ padding: "80px 40px", background: "#0d0600", borderTop: "1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 999, padding: "5px 16px", fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Real-time Markets
            </div>
            <h2 style={{ fontSize: "clamp(28px,3vw,44px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 16 }}>
              Advanced TradingView Charts
            </h2>
            <p style={{ fontSize: 15, color: "#6a4a30", maxWidth: 500, margin: "0 auto" }}>
              Track price action, apply indicators, and make informed decisions with real-time data.
            </p>
          </div>
          <div className="tv-chart-wrapper">
            <div id="tv-chart-container" style={{ height: 500, width: "100%" }} />
          </div>
        </div>
      </section>

      {/* MARQUEE TRUST BAND */}
      <div style={{ borderTop: "1px solid rgba(249,115,22,0.08)", borderBottom: "1px solid rgba(249,115,22,0.08)", padding: "18px 0", overflow: "hidden", background: "#080300" }}>
        <div className="marquee-track">
          {[...Array(4)].flatMap(() =>
            ["✦ Trusted Exchange", "✦ Fast Deposits", "✦ Secure Wallets", "✦ Low Fees", "✦ Instant Trades", "✦ Global Access", "✦ 24/7 Support", "✦ Verified Liquidity"]
              .map((t, i) => (
                <span key={`${t}-${i}`} style={{ display: "inline-block", marginRight: 52, fontSize: 11, fontWeight: 700, color: "#3a2010", letterSpacing: "0.14em" }}>{t}</span>
              ))
          )}
        </div>
      </div>

      {/* PARTNERS SECTION */}
      <section ref={partRef} style={{ padding: "60px 40px", background: "#090400", borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div className={`reveal ${partIn?"in":""}`} style={{ fontSize: 11, color: "#4a3020", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 32 }}>
            Backed by industry leaders 6+
          </div>
          <div className="partners-container" style={{ display: "flex", gap: 0, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            {[
              { name: "BitGo",        src: "https://www.tescryptvest.com/C1.png" },
              { name: "3iQ",          src: "https://www.tescryptvest.com/C2.png" },
              { name: "CoinMarketCap",src: "https://www.tescryptvest.com/C3.png" },
              { name: "Coinigy",      src: "https://www.tescryptvest.com/C4.png" },
              { name: "Ledger",       src: "https://www.tescryptvest.com/C5.png" },
              { name: "Nexo",         src: "https://www.tescryptvest.com/C6.png" },
            ].map((p,i) => (
              <div key={p.name} className={`reveal d${i+1} ${partIn?"in":""}`} style={{ padding: "12px 28px", borderRight: i<5?"1px solid rgba(249,115,22,0.07)":"none", opacity: 0.5, filter: "grayscale(1) brightness(2)", transition: "opacity 0.3s, filter 0.3s", cursor: "pointer" }}
                onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.filter="grayscale(0) brightness(1)";}}
                onMouseLeave={e=>{e.currentTarget.style.opacity="0.5";e.currentTarget.style.filter="grayscale(1) brightness(2)";}}>
                <img src={p.src} alt={p.name} style={{ height: 28, display: "block" }}
                  onError={e=>{e.target.parentElement.innerHTML=`<span style="font-size:14px;font-weight:800;color:#4a3020">${p.name}</span>`;}} />
              </div>
            ))}
          </div>
          <div className={`reveal d5 ${partIn?"in":""}`} style={{ fontSize: 12, color: "#3a2010", marginTop: 24 }}>Trusted by 58,000+ investors</div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section ref={featRef} style={{ padding: "100px 40px", background: "#0d0600" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 340px", minWidth: "260px" }}>
              <div className={`reveal ${featIn?"in":""}`} style={{ display: "inline-block", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 999, padding: "5px 16px", fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
                Why choose us
              </div>
              <h2 className={`reveal d2 ${featIn?"in":""}`} style={{ fontSize: "clamp(28px,3vw,42px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 20,   }}>
                Everything you need to invest smarter
              </h2>
              <p className={`reveal d3 ${featIn?"in":""}`} style={{ fontSize: 15, color: "#6a4a30", lineHeight: 1.8, marginBottom: 32 }}>
                aWixCapita combines institutional-grade tools with a simple interface — whether you're a first-timer or a seasoned trader, you're always in control.
              </p>
              <Link to="/register" className={`reveal d4 ${featIn?"in":""} btn-orange`} style={{ fontSize: 13, padding: "12px 28px" }}>Start for free →</Link>
              <div className={`reveal d5 ${featIn?"in":""}`} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28 }}>
                <div style={{ display: "flex" }}>
                  {["https://www.tescryptvest.com/woman1.jpg","https://www.tescryptvest.com/man1.jpeg","https://www.tescryptvest.com/woman2.png","https://www.tescryptvest.com/man2.jpg"].map((src,i)=>(
                    <img key={i} src={src} alt="" onError={e=>{e.target.src=`https://i.pravatar.cc/36?img=${i+15}`;}}
                      style={{ width:30,height:30,borderRadius:"50%",objectFit:"cover",border:"2px solid #0d0600",marginLeft:i>0?-9:0 }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: "#6a4a30" }}>58,000+ investors growing with us</span>
              </div>
            </div>
            <div className="feat-grid" style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {[
                { num:"01", title:"Bank-Grade Security", desc:"2FA, cold storage, and military-grade encryption keep your assets protected around the clock." },
                { num:"02", title:"Lightning Execution", desc:"Execute trades in milliseconds with our high-performance, low-latency matching engine." },
                { num:"03", title:"Advanced Analytics", desc:"Real-time charts and AI-powered insights help you spot opportunities and trade smarter." },
                { num:"04", title:"24/7 Expert Support", desc:"Our team of crypto specialists is always available to help you navigate any situation." },
              ].map((f, i) => (
                <div key={i} className={`reveal feat-card d${i+1} ${featIn?"in":""}`}
                  style={{ background: "#0a0400", border: "1px solid rgba(249,115,22,0.09)", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#f97316", fontVariantNumeric: "tabular-nums", marginBottom: 14, letterSpacing: "0.06em" }}>{f.num}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, lineHeight: 1.3 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: "#5a3a22", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section ref={statsRef} style={{ padding: "80px 40px", background: "#080300", borderTop: "1px solid rgba(249,115,22,0.07)", borderBottom: "1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className={`reveal ${statsIn?"in":""}`} style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ display: "inline-block", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 999, padding: "5px 16px", fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              By the numbers
            </div>
            <h2 style={{ fontSize: "clamp(26px,3vw,40px)", fontWeight: 900, letterSpacing: "-0.02em",   }}>Trusted at scale</h2>
          </div>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { end: 150000, suffix: "+", label: "Transactions last 24h" },
              { end: 58000, suffix: "+", label: "Active investors" },
              { end: 5, suffix: "+", label: "Years of experience" },
              { end: 98, suffix: "%", label: "Client satisfaction" },
            ].map((s,i) => (
              <div key={i} className={`reveal d${i+1} ${statsIn?"in":""}`}
                style={{ textAlign:"center", padding:"40px 20px", borderRight: i<3?"1px solid rgba(249,115,22,0.07)":"none" }}>
                <div style={{ fontSize:"clamp(40px,4vw,60px)", fontWeight:900, letterSpacing:"-0.04em", fontStyle:"italic", color:"#fff", marginBottom:10 }}>
                  <AnimatedCounter end={s.end} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:13, color:"#4a3020", fontWeight:600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section ref={secRef} style={{ padding: "100px 40px", background: "#0d0600" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 72, alignItems: "center", flexWrap: "wrap" }}>
          <div className={`reveal-left ${secIn?"in":""}`} style={{ flex: "0 0 380px", position: "relative", display: "flex", justifyContent: "center", minWidth: "260px" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 320 }}>
              <div style={{ position:"absolute",inset:-30,borderRadius:"50%",background:"radial-gradient(ellipse at center,rgba(249,115,22,0.12) 0%,transparent 70%)",pointerEvents:"none" }} />
              <img src="https://www.tescryptvest.com/secure.png" alt="Security" className="sec-img"
                style={{ width:"100%",display:"block" }}
                onError={e=>{e.target.parentElement.innerHTML=`
                  <div style="width:100%;height:auto;aspect-ratio:1/1;background:rgba(249,115,22,0.05);border:1px solid rgba(249,115,22,0.2);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
                    <div style="font-size:64px">🔐</div>
                    <div style="font-size:14px;font-weight:700;color:#f97316">256-bit SSL</div>
                    <div style="font-size:11px;color:#4a3020">Encrypted · System Secure</div>
                  </div>
                `;}} />
              <div style={{ position:"absolute",top:-10,right:-20,background:"#0a0400",border:"1px solid rgba(249,115,22,0.2)",borderRadius:10,padding:"8px 14px",textAlign:"center" }}>
                <div style={{ fontSize:10,fontWeight:800,color:"#f97316",letterSpacing:"0.1em" }}>256-bit SSL</div>
                <div style={{ fontSize:9,color:"#4a3020",marginTop:2 }}>Encrypted</div>
              </div>
              <div style={{ position:"absolute",bottom:20,left:-10,background:"#0a0400",border:"1px solid rgba(249,115,22,0.2)",borderRadius:10,padding:"10px 14px",textAlign:"center" }}>
                <div style={{ fontSize:16,marginBottom:2 }}>🛡️</div>
                <div style={{ fontSize:10,fontWeight:800,color:"#fff" }}>System Secure</div>
                <div style={{ fontSize:9,color:"#f97316",marginTop:2 }}>Bank-grade protection</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className={`reveal ${secIn?"in":""}`} style={{ display:"inline-block",background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:999,padding:"5px 16px",fontSize:10,fontWeight:700,color:"#f97316",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:20 }}>
              Security first
            </div>
            <h2 className={`reveal d2 ${secIn?"in":""}`} style={{ fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,lineHeight:1.1,letterSpacing:"-0.02em",marginBottom:20  }}>
              Your assets,<br />our top priority
            </h2>
            <p className={`reveal d3 ${secIn?"in":""}`} style={{ fontSize:15,color:"#6a4a30",lineHeight:1.8,marginBottom:36,maxWidth:440 }}>
              aWixCapita uses cutting-edge security infrastructure trusted by over 5 million users globally.
            </p>
            {[
              { title:"Two-Factor Authentication", desc:"Every account is protected with mandatory 2FA for all logins and withdrawals." },
              { title:"Cold Storage", desc:"95% of assets held in air-gapped cold wallets, offline and unreachable." },
              { title:"24/7 Fraud Monitoring", desc:"AI-powered threat detection monitors all transactions in real time." },
              { title:"Regulatory Compliance", desc:"Fully compliant with international AML and KYC regulations." },
            ].map((item,i) => (
              <div key={i} className={`reveal d${i+2} ${secIn?"in":""}`} style={{ display:"flex",gap:14,marginBottom:20 }}>
                <div style={{ width:20,height:20,borderRadius:"50%",background:"rgba(249,115,22,0.15)",border:"1px solid rgba(249,115,22,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2 }}>
                  <span style={{ color:"#f97316",fontSize:10,fontWeight:800 }}>✓</span>
                </div>
                <div>
                  <div style={{ fontSize:14,fontWeight:700,marginBottom:4 }}>{item.title}</div>
                  <div style={{ fontSize:13,color:"#5a3a22",lineHeight:1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div className={`reveal d6 ${secIn?"in":""}`} style={{ display:"flex",gap:24,marginTop:8,flexWrap:"wrap" }}>
              {[["99.9%","Uptime"],["5M+","Protected users"],["0","Security breaches"]].map(([v,l])=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:22,fontWeight:900,color:"#f97316"  }}>{v}</div>
                  <div style={{ fontSize:11,color:"#4a3020",marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <Link to="/register" className={`reveal d6 ${secIn?"in":""} btn-orange`} style={{ marginTop:28,display:"inline-flex",fontSize:13,padding:"12px 28px" }}>Start Investing Securely</Link>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section ref={trustRef} style={{ padding:"100px 40px",background:"#080300",borderTop:"1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className={`reveal ${trustIn?"in":""}`} style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ display:"inline-block",background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:999,padding:"5px 16px",fontSize:10,fontWeight:700,color:"#f97316",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:16 }}>
              Our commitment
            </div>
            <h2 style={{ fontSize:"clamp(26px,3vw,42px)",fontWeight:900,letterSpacing:"-0.02em",marginBottom:16  }}>
              Why 58,000+ investors trust us
            </h2>
            <p style={{ fontSize:15,color:"#6a4a30",maxWidth:500,margin:"0 auto 24px" }}>
              Trust is the foundation of everything we do. Our platform is built on industry-leading security protocols, transparent operations, and a dedicated team that puts your safety first.
            </p>
            <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap" }}>
              {["SOC 2 Certified","256-bit SSL","ISO 27001","GDPR Compliant"].map(b=>(
                <span key={b} style={{ background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:6,padding:"4px 14px",fontSize:11,color:"#f97316",fontWeight:600 }}>{b}</span>
              ))}
            </div>
          </div>
          <div className="trust-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20 }}>
            {[
              { num:"01",title:"Bank-grade security & encryption",desc:"Your assets are protected with cutting-edge security measures and 256-bit encryption." },
              { num:"02",title:"Transparent fee structure",desc:"No hidden costs, no surprises — just clear, competitive pricing on every transaction." },
              { num:"03",title:"24/7 fraud monitoring",desc:"Our automated systems and expert team keep watch around the clock, every day." },
              { num:"04",title:"Regulatory compliance",desc:"Fully licensed and operating under strict AML/KYC compliance frameworks globally." },
            ].map((item,i)=>(
              <div key={i} className={`reveal feat-card d${i+1} ${trustIn?"in":""}`}
                style={{ background:"#0a0400",border:"1px solid rgba(249,115,22,0.09)",borderRadius:16,padding:"24px 20px" }}>
                <div style={{ fontSize:11,fontWeight:800,color:"#f97316",marginBottom:12 }}>{item.num}</div>
                <div style={{ fontSize:14,fontWeight:700,marginBottom:8,lineHeight:1.4 }}>{item.title}</div>
                <div style={{ fontSize:13,color:"#5a3a22",lineHeight:1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div className={`reveal d5 ${trustIn?"in":""}`} style={{ background:"#0a0400",border:"1px solid rgba(249,115,22,0.09)",borderRadius:16,padding:"24px 28px",display:"flex",gap:20,flexWrap:"wrap",alignItems:"center",justifyContent:"center" }}>
            {["🏦 Licensed Financial Institution","🔒 ISO 27001 Certified","✅ SOC 2 Type II Audited","🌍 Operating in 140+ Countries"].map(item=>(
              <span key={item} style={{ fontSize:13,fontWeight:600,color:"#6a4a30" }}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section id="plans" ref={plansRef} style={{ padding:"100px 40px",background:"#0d0600",borderTop:"1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className={`reveal ${plansIn?"in":""}`} style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ display:"inline-block",background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:999,padding:"5px 16px",fontSize:10,fontWeight:700,color:"#f97316",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:16 }}>
              Investment plans
            </div>
            <h2 style={{ fontSize:"clamp(26px,3vw,42px)",fontWeight:900,letterSpacing:"-0.02em",marginBottom:12  }}>Choose your growth plan</h2>
            <p style={{ fontSize:15,color:"#6a4a30" }}>Select a plan that matches your goals and start growing your wealth today.</p>
          </div>
          <div className="plans-grid" style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:32 }}>
            {PLANS.map((plan,i)=>(
              <div key={plan.name} className={`reveal plan-card d${i+1} ${plansIn?"in":""}`} style={{
                position:"relative",
                background: plan.featured?"rgba(249,115,22,0.06)":"#0a0400",
                border: plan.featured?"1px solid rgba(249,115,22,0.35)":"1px solid rgba(249,115,22,0.09)",
                borderRadius:16,padding:"28px 18px"
              }}>
                {plan.featured && (
                  <div style={{ position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"#f97316",color:"#fff",fontSize:9,fontWeight:800,padding:"4px 16px",borderRadius:999,whiteSpace:"nowrap",letterSpacing:"0.1em",textTransform:"uppercase" }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontSize:16,fontWeight:800,marginBottom:4 }}>{plan.name}</div>
                <div style={{ fontSize:11,color:"#5a3a22",marginBottom:16,fontVariantNumeric:"tabular-nums" }}>{plan.duration}</div>
                <div style={{ height:1,background:"rgba(249,115,22,0.08)",marginBottom:16 }} />
                <div style={{ fontSize:20,fontWeight:900,color:"#fff",marginBottom:2 }}>{plan.min}</div>
                <div style={{ fontSize:10,color:"#4a3020",marginBottom:14 }}>minimum</div>
                <div style={{ fontSize:13,fontWeight:700,color:"#f97316",marginBottom:18 }}>+{plan.profit} projected profit</div>
                {["Secure and transparent transactions","Experienced trading team","Regular updates and insights"].map(f=>(
                  <div key={f} style={{ display:"flex",gap:7,alignItems:"flex-start",marginBottom:8 }}>
                    <span style={{ color:"#f97316",fontSize:10,marginTop:2,flexShrink:0 }}>✓</span>
                    <span style={{ fontSize:11,color:"#5a3a22",lineHeight:1.5 }}>{f}</span>
                  </div>
                ))}
                <a href="#" className={plan.featured?"btn-orange":"btn-outline-orange"} style={{ width:"100%",justifyContent:"center",marginTop:20,padding:"10px 0",fontSize:12,borderRadius:10 }}>
                  Invest Now
                </a>
              </div>
            ))}
          </div>
          <div className={`reveal d5 ${plansIn?"in":""}`} style={{ background:"#0a0400",border:"1px solid rgba(249,115,22,0.09)",borderRadius:16,padding:"32px" }}>
            <h3 style={{ fontSize:16,fontWeight:800,marginBottom:24 }}>Investment Terms</h3>
            <div className="terms-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:0 }}>
              {[["Minimum Investment","$1,000"],["Maximum Investment","$50,000"],["Payment Methods","Bank transfer, Crypto"],["Crypto Processing","1–3 hours"],["Bank Processing","1–3 business days"],["Customer Support","24/7 available"]].map(([l,v],i)=>(
                <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"14px 16px",borderBottom:i<3?"1px solid rgba(249,115,22,0.07)":"none",borderRight:i%3<2?"1px solid rgba(249,115,22,0.07)":"none" }}>
                  <span style={{ fontSize:13,color:"#5a3a22" }}>{l}</span>
                  <span style={{ fontSize:13,fontWeight:700,color:"#e0c090" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign:"center",marginTop:28 }}>
              <Link to="/register" className="btn-orange" style={{ padding:"14px 44px",fontSize:15,fontWeight:800 }}>Get Started Today</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section ref={testRef} style={{ padding:"100px 40px",background:"#080300",borderTop:"1px solid rgba(249,115,22,0.07)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className={`reveal ${testIn?"in":""}`} style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ display:"inline-block",background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:999,padding:"5px 16px",fontSize:10,fontWeight:700,color:"#f97316",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:16 }}>
              Testimonials
            </div>
            <h2 style={{ fontSize:"clamp(26px,3vw,42px)",fontWeight:900,letterSpacing:"-0.02em",marginBottom:12  }}>Loved by investors worldwide</h2>
            <p style={{ fontSize:15,color:"#6a4a30" }}>Don't just take our word for it — hear from the thousands of investors who trust aWixCapita every day.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:40 }}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className={`reveal d${i%2===0?"1":"2"} ${testIn?"in":""} feat-card`}
                style={{ background:"#0a0400",border:"1px solid rgba(249,115,22,0.09)",borderRadius:16,padding:"28px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:18 }}>
                  <span style={{ fontSize:36,color:"rgba(249,115,22,0.2)",lineHeight:1,fontWeight:900 }}>"</span>
                  <span style={{ background:"rgba(34,197,94,0.1)",color:"#22c55e",fontSize:10,fontWeight:700,padding:"3px 12px",borderRadius:999,height:"fit-content" }}>Verified</span>
                </div>
                <p style={{ fontSize:14,color:"#8a6040",lineHeight:1.8,marginBottom:24 }}>{t.text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <img src={t.img} alt={t.name} onError={e=>{e.target.src=`https://i.pravatar.cc/48?img=${i+5}`;}}
                    style={{ width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(249,115,22,0.2)" }} />
                  <div>
                    <div style={{ fontSize:14,fontWeight:700 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:"#5a3a22" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`reveal d5 ${testIn?"in":""}`} style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:20,flexWrap:"wrap" }}>
            <div style={{ display:"flex" }}>
              {["https://www.tescryptvest.com/woman1.jpg","https://www.tescryptvest.com/man1.jpeg","https://www.tescryptvest.com/woman2.png","https://www.tescryptvest.com/man2.jpg"].map((src,i)=>(
                <img key={i} src={src} alt="" onError={e=>{e.target.src=`https://i.pravatar.cc/40?img=${i+20}`;}}
                  style={{ width:34,height:34,borderRadius:"50%",objectFit:"cover",border:"2px solid #080300",marginLeft:i>0?-10:0 }} />
              ))}
            </div>
            <div style={{ fontSize:28,fontWeight:900 ,color:"#f97316" }}>4.9</div>
            <div style={{ fontSize:13,color:"#5a3a22" }}>58,000+ investors · Trusted since 2019</div>
            <div style={{ display:"flex",gap:12 }}>
              {[["₿","Bitcoin","#f7931a"],["Ξ","Ethereum","#627eea"],["◎","Solana","#9945ff"]].map(([icon,name,c])=>(
                <span key={name} style={{ fontSize:12,fontWeight:700,color:c }}>
                  {icon} {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section ref={ctaRef} style={{ padding:"120px 40px",background:"#0d0600",borderTop:"1px solid rgba(249,115,22,0.07)",position:"relative",overflow:"hidden",textAlign:"center" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 70% at 50% 50%,rgba(120,40,0,0.4) 0%,transparent 65%)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(249,115,22,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,0.03) 1px,transparent 1px)",backgroundSize:"52px 52px",maskImage:"radial-gradient(ellipse 60% 60% at 50% 50%,#000 20%,transparent 100%)",pointerEvents:"none" }} />
        <div className={`reveal-scale ${ctaIn?"in":""}`} style={{ position:"relative",zIndex:1,maxWidth:640,margin:"0 auto" }}>
          <div style={{ display:"inline-block",background:"rgba(249,115,22,0.07)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:999,padding:"5px 16px",fontSize:10,fontWeight:700,color:"#f97316",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:24 }}>
            Start in under 2 minutes
          </div>
          <h2 style={{ fontSize:"clamp(32px,5vw,64px)",fontWeight:900,letterSpacing:"-0.02em",lineHeight:1.05,marginBottom:20  }}>
            Ready to grow your<br /><span style={{ color:"#f97316" }}>crypto wealth?</span>
          </h2>
          <p style={{ fontSize:16,color:"#6a4a30",maxWidth:420,margin:"0 auto 40px",lineHeight:1.8 }}>
            Sign up in minutes, deposit funds, and start investing with Tescryptvest. Whether you're buying your first Bitcoin or diversifying your portfolio, we make it simple.
          </p>
          <div style={{ display:"flex",gap:14,justifyContent:"center",marginBottom:20,flexWrap:"wrap" }}>
            <Link to="/register" className="btn-orange" style={{ padding:"16px 38px",fontSize:15,fontWeight:800 }}>Create Free Account</Link>
            <Link to="/login" className="btn-dark" style={{ padding:"16px 32px",fontSize:15 }}>Sign In →</Link>
          </div>
          <div style={{ fontSize:12,color:"#3a2010",marginBottom:48 }}>No credit card required. Free to start.</div>
          <div style={{ display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap" }}>
            {[["58K+","Active Investors"],["$2.4M+","Total Volume"],["4.9★","User Rating"]].map(([v,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:22,fontWeight:900,color:"#f97316" ,marginBottom:4 }}>{v}</div>
                <div style={{ fontSize:11,color:"#4a3020" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:"#060200",borderTop:"1px solid rgba(249,115,22,0.07)",padding:"64px 40px 32px" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48 }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div style={{ width:28,height:28,position:"relative" }}>
                  <svg viewBox="0 0 40 40" width="28" height="28">
                    <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#f97316" strokeWidth="2.5"/>
                    <polygon points="20,14 26,18 26,22 20,26 14,22 14,18" fill="#f97316"/>
                  </svg>
                </div>
                <span style={{ fontSize:16,fontWeight:800 }}><span style={{ color:"#fff" }}>AWix</span><span style={{ color:"#f97316" }}>Capital</span></span>
              </div>
              <p style={{ fontSize:13,color:"#4a3020",lineHeight:1.8,maxWidth:240,marginBottom:24 }}>
                Your trusted platform for secure, intelligent, and accessible crypto investing.
              </p>
              <div style={{ display:"flex",gap:10 }}>
                {[["💬","https://wa.me/13652834523"],["📨","https://t.me/+18352318109"],["▶","https://www.tiktok.com/@tescryptrading"]].map(([icon,href],i)=>(
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ width:34,height:34,borderRadius:8,background:"#0a0400",border:"1px solid rgba(249,115,22,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,textDecoration:"none",transition:"border-color 0.2s,background 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#f97316";e.currentTarget.style.background="rgba(249,115,22,0.08)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.12)";e.currentTarget.style.background="#0a0400";}}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            {[
              { title:"Company",  links:["About Us","Careers","Contact"] },
              { title:"Resources",links:["Blog","Help Center","Security"] },
              { title:"Legal",    links:["Privacy Policy","Terms of Service","Cookie Policy"] },
            ].map(col=>(
              <div key={col.title}>
                <div style={{ fontSize:10,fontWeight:800,color:"#4a3020",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:20 }}>{col.title}</div>
                {col.links.map(l=>(
                  <a key={l} href="#" style={{ display:"block",fontSize:13,color:"#3a2010",textDecoration:"none",marginBottom:12,transition:"color 0.2s",fontWeight:500 }}
                    onMouseEnter={e=>e.target.style.color="#f97316"}
                    onMouseLeave={e=>e.target.style.color="#3a2010"}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(249,115,22,0.07)",paddingTop:24,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12 }}>
            <span style={{ fontSize:12,color:"#2a1a08" }}>© 2026 Tescryptvest. All rights reserved.</span>
            <span style={{ fontSize:12,color:"#2a1a08" }}>Investing involves risk. Past performance does not guarantee future results.</span>
          </div>
        </div>
      </footer>

      <div style={{ position:"fixed",bottom:28,right:28,zIndex:100 }}>
        <button className="btn-orange" style={{ width:52,height:52,borderRadius:"50%",padding:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 24px rgba(249,115,22,0.4)" }}>
          💬
        </button>
      </div>
    </div>
  );
}