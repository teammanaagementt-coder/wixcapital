import { useState, useEffect, useRef } from "react";
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

// ─── Theme tokens ──────────────────────────────────────────────────────
const T = {
  primary: "#006AD9",
  primary50: "#E6F1FD",
  primary100: "#C3DDFB",
  primary400: "#1F84F0",
  primary500: "#006AD9",
  primary600: "#0059B3",
  secondary: "#4A9D7F",
  secondary100: "#D1EBE1",
  secondary400: "#4A9D7F",
  tertiary: "#627EEA",
  tertiary400: "#627EEA",
  tertiary100: "#DBE1F9",
  accent: "#F0B90B",
  accent100: "#FDF3CC",
  accent400: "#F0B90B",
  danger: "#FF6B6B",
  danger100: "#FFE0E0",
  purple: "#9164CC",
  purple100: "#E7DCF5",
  dark: "#09090B",
  dark50: "#0E0E12",
  dark100: "#16161D",
  dark200: "#20202A",
  dark300: "#2B2B38",
  light: "#F1F5F9",
  light200: "#E2E8F0",
  light300: "#CBD5E1",
  white: "#FFFFFF",
};

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
    <svg width={w} height={h} style={{ overflow: "visible" }}>
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
    color: T.tertiary,
    bg: "rgba(98,126,234,.12)",
    hist: [3600, 3750, 3680, 3900, 3820, 3870, 3842],
  },
  {
    sym: "SOL",
    name: "Solana",
    price: 178.4,
    chg: 5.67,
    cap: "$84B",
    color: T.purple,
    bg: "rgba(145,100,204,.12)",
    hist: [145, 158, 152, 168, 171, 176, 178],
  },
  {
    sym: "BNB",
    name: "BNB",
    price: 612.3,
    chg: 0.89,
    cap: "$92B",
    color: T.accent,
    bg: "rgba(240,185,11,.12)",
    hist: [580, 595, 588, 602, 608, 609, 612],
  },
  {
    sym: "ADA",
    name: "Cardano",
    price: 0.614,
    chg: -2.45,
    cap: "$21B",
    color: T.primary,
    bg: "rgba(0,106,217,.12)",
    hist: [0.68, 0.65, 0.63, 0.66, 0.64, 0.62, 0.614],
  },
  {
    sym: "AVAX",
    name: "Avalanche",
    price: 42.18,
    chg: 3.21,
    cap: "$17B",
    color: T.danger,
    bg: "rgba(255,107,107,.12)",
    hist: [36, 38, 37, 40, 41, 42, 42.18],
  },
];

// ─── Ticker bar ────────────────────────────────────────────────────────
function TickerBar({ prices }) {
  const items = [...prices, ...prices];
  return (
    <div
      style={{
        background: T.dark100,
        borderBottom: `1px solid ${T.dark300}`,
        height: 38,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", whiteSpace: "nowrap" }}
      >
        {items.map((c, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 28px",
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              borderRight: `1px solid ${T.dark300}`,
            }}
          >
            <span
              style={{
                color: T.primary,
                fontWeight: 700,
                letterSpacing: ".05em",
              }}
            >
              {c.sym}
            </span>
            <span style={{ color: T.white }}>
              ${c.price.toLocaleString()}
            </span>
            <span
              style={{
                color: c.chg >= 0 ? T.secondary : T.danger,
                fontWeight: 700,
              }}
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
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 60,
        borderBottom: `1px solid ${dark ? T.dark300 : T.light200}`,
        background: dark
          ? "rgba(9,9,11,.92)"
          : "rgba(241,245,249,.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: "-.02em",
          color: dark ? T.white : T.dark,
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: T.primary,
            boxShadow: `0 0 12px ${T.primary}`,
          }}
        />
        Wix Capital
      </div>

      {!isMobile ? (
        <>
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 12,
              fontWeight: 500,
              color: dark ? "#9898b0" : "#64748b",
            }}
          >
            {["Markets", "Trade", "Invest", "About"].map((l) => (
              <a key={l} href="#" style={{ textDecoration: "none", color: "inherit" }}>
                {l}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={toggleDark}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: `1px solid ${dark ? T.dark300 : T.light300}`,
                background: "transparent",
                color: dark ? "#9898b0" : "#64748b",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: `1px solid ${dark ? T.dark300 : T.light300}`,
                background: "transparent",
                color: dark ? "#9898b0" : "#64748b",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Log in
            </button>
            <button
              style={{
                padding: "6px 18px",
                borderRadius: 8,
                border: "none",
                background: T.primary,
                color: T.white,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Get Started
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={onMenuClick}
          style={{
            background: "transparent",
            border: `1px solid ${dark ? T.dark300 : T.light300}`,
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            color: dark ? T.white : T.dark,
          }}
        >
          <Menu size={20} />
        </button>
      )}
    </nav>
  );
}

// ─── Mobile Sidebar ────────────────────────────────────────────────────
function MobileSidebar({ dark, isOpen, onClose, toggleDark }) {
  if (!isOpen) return null;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 200,
          backdropFilter: "blur(4px)",
        }}
      />
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "70%",
          maxWidth: 280,
          background: dark ? T.dark200 : T.white,
          zIndex: 210,
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
          borderRight: `1px solid ${dark ? T.dark300 : T.light200}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: dark ? T.white : T.dark }}>
            Menu
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: dark ? "#9898b0" : "#64748b",
            }}
          >
            <X size={22} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["Markets", "Trade", "Invest", "About"].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: dark ? T.white : T.dark,
                padding: "6px 0",
                borderBottom: `1px solid ${dark ? T.dark300 : T.light200}`,
              }}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          <button
            onClick={toggleDark}
            style={{
              padding: "8px",
              borderRadius: 8,
              border: `1px solid ${dark ? T.dark300 : T.light300}`,
              background: "transparent",
              color: dark ? "#9898b0" : "#64748b",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            style={{
              padding: "8px",
              borderRadius: 8,
              border: `1px solid ${dark ? T.dark300 : T.light300}`,
              background: "transparent",
              color: dark ? "#9898b0" : "#64748b",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            Log in
          </button>
          <button
            style={{
              padding: "10px",
              borderRadius: 8,
              border: "none",
              background: T.primary,
              color: T.white,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
            }}
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
  return (
    <section
      style={{
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 32px",
        position: "relative",
        overflow: "hidden",
        background: dark ? T.dark : T.light,
      }}
    >
      {/* Animated background blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: dark ? 0.18 : 0.55,
          }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.primary50} 0%, transparent 70%)`,
            top: -80,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${T.tertiary100} 0%, transparent 70%)`,
            bottom: 0,
            right: "8%",
            opacity: dark ? 0.12 : 0.45,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${
              dark ? "rgba(255,255,255,.018)" : "rgba(0,0,0,.04)"
            } 1px,transparent 1px),linear-gradient(90deg,${
              dark ? "rgba(255,255,255,.018)" : "rgba(0,0,0,.04)"
            } 1px,transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,#000 40%,transparent 100%)",
          }}
        />
      </div>

      <RevealSection>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 12px",
            borderRadius: 100,
            border: `1px solid ${T.primary}40`,
            background: `${T.primary}10`,
            fontSize: 10,
            fontWeight: 700,
            color: T.primary,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: T.primary,
            }}
          />
          Live Markets · 10,000+ Investors
        </div>
      </RevealSection>

      <RevealSection delay={0.1}>
        <h1
          style={{
            fontSize: "clamp(36px,5vw,68px)",
            fontWeight: 900,
            lineHeight: 1.0,
            textAlign: "center",
            letterSpacing: "-.035em",
            maxWidth: 760,
            marginBottom: 20,
            color: dark ? T.white : T.dark,
          }}
        >
          Trade Crypto.<br />
          <span style={{ color: T.primary }}>Earn Daily.</span>
          <br />
          <span style={{ color: dark ? "#6b6b85" : "#94a3b8" }}>Build Wealth.</span>
        </h1>
      </RevealSection>

      <RevealSection delay={0.2}>
        <p
          style={{
            fontSize: 14,
            color: dark ? "#9898b0" : "#64748b",
            textAlign: "center",
            maxWidth: 460,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Wix Capital gives you institutional-grade tools, daily passive returns, and
          bank-level security in one sleek platform.
        </p>
      </RevealSection>

      <RevealSection delay={0.3}>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 56,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              background: T.primary,
              color: T.white,
              border: "none",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Start Investing <ArrowRight size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: "12px 28px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              background: "transparent",
              border: `1px solid ${dark ? T.dark300 : T.light300}`,
              color: dark ? "#9898b0" : "#64748b",
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Explore Demo
          </motion.button>
        </div>
      </RevealSection>

      <RevealSection delay={0.4}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            border: `1px solid ${dark ? T.dark300 : T.light200}`,
            borderRadius: 14,
            overflow: "hidden",
            background: dark ? T.dark100 : T.white,
            maxWidth: 700,
            width: "100%",
          }}
        >
          {[
            { val: "$2.4B", lbl: "24h Volume" },
            { val: "10K+", lbl: "Active Traders" },
            { val: "2.5%", lbl: "Max Daily Return" },
            { val: "99.9%", lbl: "Uptime SLA" },
          ].map((s, i, arr) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "16px 20px",
                borderRight:
                  i < arr.length - 1
                    ? `1px solid ${dark ? T.dark300 : T.light200}`
                    : "none",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: T.primary,
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: dark ? "#6b6b85" : "#94a3b8",
                  marginTop: 4,
                  fontWeight: 500,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </RevealSection>
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
            backgroundColor: dark ? T.dark200 : T.white,
            borderColor: dark ? T.dark300 : T.light200,
            borderWidth: 1,
            titleColor: dark ? "#9898b0" : "#64748b",
            bodyColor: dark ? T.white : T.dark,
            padding: 8,
          },
        },
        scales: { x: { display: false }, y: { display: false } },
      },
    });
  }, [activeCoin, range, dark, prices]);

  const c = prices[activeCoin];
  const border = dark ? T.dark300 : T.light200;

  return (
    <RevealSection>
      <div
        style={{
          padding: "60px 32px",
          background: dark ? T.dark50 : T.primary50,
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.primary,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Live Chart
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-.02em",
                  color: dark ? T.white : T.dark,
                }}
              >
                Price Action
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 2,
                background: dark ? T.dark200 : T.light200,
                borderRadius: 8,
                padding: 2,
                border: `1px solid ${border}`,
              }}
            >
              {["1H", "4H", "1D", "1W"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    color:
                      range === r
                        ? T.primary
                        : dark
                        ? "#9898b0"
                        : "#64748b",
                    background:
                      range === r
                        ? dark
                          ? T.dark300
                          : T.white
                        : "transparent",
                    border: "none",
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {prices.slice(0, 5).map((coin, i) => (
              <button
                key={i}
                onClick={() => setActiveCoin(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: 8,
                  border: `1px solid ${
                    activeCoin === i ? T.primary : border
                  }`,
                  background:
                    activeCoin === i ? `${T.primary}12` : "transparent",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  color:
                    activeCoin === i
                      ? T.primary
                      : dark
                      ? "#9898b0"
                      : "#64748b",
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: coin.color,
                  }}
                />
                {coin.sym}
              </button>
            ))}
          </div>
          <div
            style={{
              background: dark ? T.dark200 : T.white,
              border: `1px solid ${border}`,
              borderRadius: 12,
              padding: 18,
              height: 200,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 24,
                    fontWeight: 700,
                    color: dark ? T.white : T.dark,
                  }}
                >
                  ${c.price.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: c.chg >= 0 ? T.secondary : T.danger,
                    fontWeight: 700,
                    fontFamily: "'Space Mono',monospace",
                  }}
                >
                  {c.chg >= 0 ? "▲" : "▼"} {c.chg >= 0 ? "+" : ""}
                  {c.chg}% today
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: dark ? "#6b6b85" : "#94a3b8",
                  textAlign: "right",
                  fontFamily: "'Space Mono',monospace",
                }}
              >
                <div>H: ${(c.price * 1.01).toFixed(0)}</div>
                <div>L: ${(c.price * 0.98).toFixed(0)}</div>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ width: "100%", height: 120 }} />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}

// ─── Market Table ───────────────────────────────────────────────────────
function MarketTable({ dark, prices }) {
  const border = dark ? T.dark300 : T.light200;
  return (
    <RevealSection>
      <div
        style={{
          padding: "60px 32px",
          maxWidth: 1200,
          margin: "0 auto",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.primary,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Markets
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: dark ? T.white : T.dark,
            marginBottom: 28,
          }}
        >
          Top Assets
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              {["#", "Asset", "Price", "24h Change", "Market Cap", "7d Chart", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: dark ? "#6b6b85" : "#94a3b8",
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                      padding: "0 16px 12px",
                      borderBottom: `1px solid ${border}`,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {prices.map((c, i) => (
              <tr
                key={i}
                style={{ borderBottom: `1px solid ${border}40` }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontSize: 11,
                    fontFamily: "'Space Mono',monospace",
                    color: dark ? "#6b6b85" : "#94a3b8",
                  }}
                >
                  {i + 1}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        color: c.color,
                        fontFamily: "'Space Mono',monospace",
                        flexShrink: 0,
                      }}
                    >
                      {c.sym[0]}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 12,
                          color: dark ? T.white : T.dark,
                        }}
                      >
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: dark ? "#6b6b85" : "#94a3b8",
                          fontFamily: "'Space Mono',monospace",
                        }}
                      >
                        {c.sym}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontFamily: "'Space Mono',monospace",
                    fontWeight: 700,
                    fontSize: 12,
                    color: dark ? T.white : T.dark,
                  }}
                >
                  ${c.price.toLocaleString()}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: "'Space Mono',monospace",
                      background:
                        c.chg >= 0 ? `${T.secondary}18` : `${T.danger}18`,
                      color: c.chg >= 0 ? T.secondary : T.danger,
                    }}
                  >
                    {c.chg >= 0 ? "▲" : "▼"} {Math.abs(c.chg)}%
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 11,
                    color: dark ? "#9898b0" : "#64748b",
                  }}
                >
                  {c.cap}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Spark data={c.hist} color={c.color} />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    style={{
                      padding: "4px 14px",
                      borderRadius: 7,
                      border: `1px solid ${T.primary}60`,
                      background: "transparent",
                      color: T.primary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
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
  const border = dark ? T.dark300 : T.light200;
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
      <div
        style={{
          padding: "60px 32px",
          background: dark ? T.dark50 : T.primary50,
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              maxWidth: 500,
              margin: "0 auto 40px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.primary,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Investment Plans
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: dark ? T.white : T.dark,
                marginBottom: 10,
              }}
            >
              Grow Your Capital
            </div>
            <div
              style={{
                fontSize: 13,
                color: dark ? "#9898b0" : "#64748b",
                lineHeight: 1.6,
              }}
            >
              Choose a plan. Start earning daily passive returns from day one.
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {plans.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                style={{
                  border: `1px solid ${p.featured ? T.primary : border}`,
                  borderRadius: 16,
                  padding: 28,
                  background: p.featured
                    ? dark
                      ? `linear-gradient(160deg,${T.primary}0a 0%,${T.dark200} 60%)`
                      : `linear-gradient(160deg,${T.primary50} 0%,${T.white} 60%)`
                    : dark
                    ? T.dark200
                    : T.white,
                  position: "relative",
                  transition: ".25s",
                }}
              >
                {p.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: T.primary,
                      color: T.white,
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "3px 12px",
                      borderRadius: 100,
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: dark ? "#9898b0" : "#64748b",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: 46,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: dark ? T.white : T.dark,
                    letterSpacing: "-.04em",
                    fontFamily: "'Space Mono',monospace",
                  }}
                >
                  {p.rate}
                  <span
                    style={{
                      fontSize: 20,
                      color: T.primary,
                      verticalAlign: "super",
                      marginLeft: 2,
                    }}
                  >
                    %
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: dark ? "#6b6b85" : "#94a3b8",
                    marginTop: 5,
                    marginBottom: 20,
                  }}
                >
                  daily return · {p.period}
                </div>
                <div
                  style={{ height: 1, background: border, marginBottom: 20 }}
                />
                {p.feats.map((f, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      color: dark ? "#9898b0" : "#64748b",
                      marginBottom: 10,
                    }}
                  >
                    <CheckCircle size={14} color={T.secondary} />
                    {f}
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: `1px solid ${border}`,
                  }}
                >
                  {[
                    ["Min", p.min],
                    ["Max", p.max],
                  ].map(([lbl, val]) => (
                    <div key={lbl} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontFamily: "'Space Mono',monospace",
                          fontSize: 13,
                          fontWeight: 700,
                          color: dark ? T.white : T.dark,
                        }}
                      >
                        {val}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: dark ? "#6b6b85" : "#94a3b8",
                          marginTop: 2,
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        {lbl}
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 24,
                    padding: 11,
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 800,
                    textAlign: "center",
                    cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    border: p.featured ? "none" : `1px solid ${border}`,
                    background: p.featured ? T.primary : "transparent",
                    color: p.featured
                      ? T.white
                      : dark
                      ? T.white
                      : T.dark,
                  }}
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
  const border = dark ? T.dark300 : T.light200;
  const feats = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      desc: "256-bit SSL, 2FA, and cold storage for 95% of assets.",
      accent: T.primary,
    },
    {
      icon: Zap,
      title: "Lightning Transactions",
      desc: "Deposits credited in seconds. Withdrawals under 60 min.",
      accent: T.accent,
    },
    {
      icon: LineChart,
      title: "Real-Time Markets",
      desc: "Live prices, advanced charting, deep order book data.",
      accent: T.secondary,
    },
    {
      icon: Coins,
      title: "Daily Passive Income",
      desc: "Earn up to 2.5% daily returns with zero active management.",
      accent: T.tertiary,
    },
    {
      icon: Users,
      title: "Referral Program",
      desc: "Earn 5% commission on every referral's investment.",
      accent: T.purple,
    },
    {
      icon: Lock,
      title: "KYC Compliant",
      desc: "Fully regulated, KYC-verified platform.",
      accent: T.secondary,
    },
  ];
  return (
    <RevealSection>
      <section
        style={{
          padding: "60px 32px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto 40px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Why Wix Capital
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: dark ? T.white : T.dark,
            }}
          >
            Built for serious traders
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {feats.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 24,
                background: dark ? T.dark200 : T.white,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${f.accent}14`,
                  border: `1px solid ${f.accent}28`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                  color: f.accent,
                }}
              >
                <f.icon size={20} />
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: dark ? T.white : T.dark,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: dark ? "#9898b0" : "#64748b",
                  lineHeight: 1.6,
                }}
              >
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
  const border = dark ? T.dark300 : T.light200;
  const transactions = [
    { id: 1, type: "Buy", asset: "BTC", amount: "0.024", value: "$1,620", status: "Completed", time: "2 min ago" },
    { id: 2, type: "Staking", asset: "ETH", amount: "2.5", value: "$9,605", status: "Earning", time: "1 hour ago" },
    { id: 3, type: "Deposit", asset: "USDT", amount: "5,000", value: "$5,000", status: "Completed", time: "5 hours ago" },
    { id: 4, type: "Withdraw", asset: "SOL", amount: "85", value: "$15,164", status: "Pending", time: "12 hours ago" },
  ];
  return (
    <RevealSection>
      <div style={{ padding: "60px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.primary,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Activity
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: dark ? T.white : T.dark,
            marginBottom: 28,
          }}
        >
          Recent Transactions
        </div>
        <div
          style={{
            background: dark ? T.dark100 : T.white,
            borderRadius: 16,
            border: `1px solid ${border}`,
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Type", "Asset", "Amount", "Value", "Status", "Time"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: dark ? "#6b6b85" : "#94a3b8",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: `1px solid ${border}40` }}>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontWeight: 600,
                      fontSize: 12,
                      color: dark ? T.white : T.dark,
                    }}
                  >
                    {tx.type}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 11,
                      color: dark ? "#9898b0" : "#64748b",
                    }}
                  >
                    {tx.asset}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 12,
                      color: dark ? T.white : T.dark,
                    }}
                  >
                    {tx.amount}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 12,
                      color: dark ? T.white : T.dark,
                    }}
                  >
                    {tx.value}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontSize: 10,
                        fontWeight: 700,
                        background:
                          tx.status === "Completed"
                            ? `${T.secondary}18`
                            : tx.status === "Earning"
                            ? `${T.accent}18`
                            : `${T.danger}18`,
                        color:
                          tx.status === "Completed"
                            ? T.secondary
                            : tx.status === "Earning"
                            ? T.accent
                            : T.danger,
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontSize: 11,
                      color: dark ? "#6b6b85" : "#94a3b8",
                    }}
                  >
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
  const border = dark ? T.dark300 : T.light200;
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
      <div
        style={{
          padding: "60px 32px",
          background: dark ? T.dark50 : T.primary50,
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Social Proof
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: dark ? T.white : T.dark,
              marginBottom: 40,
            }}
          >
            What Investors Say
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                style={{
                  background: dark ? T.dark200 : T.white,
                  borderRadius: 20,
                  padding: 24,
                  border: `1px solid ${border}`,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 100,
                      background: `${T.primary}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 16,
                      color: T.primary,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: dark ? T.white : T.dark,
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: dark ? "#6b6b85" : "#94a3b8",
                      }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: dark ? "#9898b0" : "#64748b",
                  }}
                >
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
  const border = dark ? T.dark300 : T.light200;
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
      <div style={{ padding: "60px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 40px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.primary,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Learn & Earn
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: dark ? T.white : T.dark,
              marginBottom: 10,
            }}
          >
            Crypto Education
          </div>
          <div
            style={{
              fontSize: 13,
              color: dark ? "#9898b0" : "#64748b",
            }}
          >
            Master crypto investing with our free guides and insights.
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {articles.map((art, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              style={{
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 24,
                background: dark ? T.dark100 : T.white,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${T.primary}14`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  color: T.primary,
                }}
              >
                <art.icon size={20} />
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: dark ? T.white : T.dark,
                }}
              >
                {art.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: dark ? "#9898b0" : "#64748b",
                  marginBottom: 16,
                  lineHeight: 1.5,
                }}
              >
                {art.desc}
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: T.primary,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
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
  const border = dark ? T.dark300 : T.light200;
  const faqs = [
    { q: "How are daily returns calculated?", a: "Daily returns are based on your invested amount multiplied by the plan's daily rate, credited every 24 hours." },
    { q: "Is my capital protected?", a: "We use multi-layer security, cold storage, and insurance funds to protect assets against breaches." },
    { q: "Can I withdraw anytime?", a: "Yes, most plans allow instant withdrawals with no hidden fees, subject to lock periods for premium plans." },
    { q: "What cryptocurrencies can I invest in?", a: "BTC, ETH, SOL, BNB, USDT and 20+ major tokens are supported for deposits and earnings." },
  ];
  return (
    <RevealSection>
      <div
        style={{
          padding: "60px 32px",
          background: dark ? T.dark50 : T.primary50,
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: T.primary,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              FAQ
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: dark ? T.white : T.dark,
                marginTop: 6,
              }}
            >
              Frequently Asked Questions
            </div>
          </div>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{ borderBottom: `1px solid ${border}`, marginBottom: 16 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "18px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: dark ? T.white : T.dark,
                  }}
                >
                  {faq.q}
                </span>
                <span style={{ fontSize: 20, color: T.primary }}>
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    paddingBottom: 20,
                    fontSize: 13,
                    color: dark ? "#9898b0" : "#64748b",
                    lineHeight: 1.6,
                  }}
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
  const border = dark ? T.dark300 : T.light200;
  return (
    <footer
      style={{
        borderTop: `1px solid ${border}`,
        padding: "32px 32px",
        background: dark ? T.dark : T.white,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 800,
            color: dark ? T.white : T.dark,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.primary,
            }}
          />
          Wix Capital
        </div>
        <div
          style={{
            fontSize: 11,
            color: dark ? "#6b6b85" : "#94a3b8",
          }}
        >
          © 2026 Wix Capital. All rights reserved.
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            fontSize: 11,
            color: dark ? "#6b6b85" : "#94a3b8",
          }}
        >
          {["Privacy", "Terms", "Support", "API"].map((l) => (
            <a key={l} href="#" style={{ textDecoration: "none", color: "inherit" }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Global Styles (CSS keyframes, fonts) ───────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes float1 { 0%{transform:translate(0,0) rotate(0deg)} 25%{transform:translate(15px,15px) rotate(90deg)} 50%{transform:translate(0,30px) rotate(180deg)} 75%{transform:translate(-15px,15px) rotate(270deg)} 100%{transform:translate(0,0) rotate(360deg)} }
  @keyframes float2 { 0%{transform:translate(0,0)} 25%{transform:translate(-20px,10px)} 50%{transform:translate(0,20px)} 75%{transform:translate(20px,10px)} 100%{transform:translate(0,0)} }
  @keyframes float3 { 0%{transform:translate(0,0)} 33%{transform:translate(15px,-15px)} 66%{transform:translate(-15px,-15px)} 100%{transform:translate(0,0)} }
  @keyframes float4 { 0%{transform:translate(0,0)} 33%{transform:translate(-20px,-10px)} 66%{transform:translate(20px,-20px)} 100%{transform:translate(0,0)} }
  .floating-element { position:absolute; border-radius:50%; animation-duration:15s; animation-iteration-count:infinite; animation-timing-function:ease-in-out; }
  .elem-1 { animation-name:float1; }
  .elem-2 { animation-name:float2; }
  .elem-3 { animation-name:float3; }
  .elem-4 { animation-name:float4; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Montserrat',sans-serif; }
  a { text-decoration:none; color:inherit; }
`;

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

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(style);
    };
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
    <div
      style={{
        minHeight: "100vh",
        background: dark ? T.dark : T.light,
        color: dark ? T.white : T.dark,
        fontFamily: "Montserrat, sans-serif",
        transition: "background .2s, color .2s",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "inherit" }}>
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