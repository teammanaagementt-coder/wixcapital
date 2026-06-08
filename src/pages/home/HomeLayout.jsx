// src/pages/home/HomeLayout.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Link2,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';

const HomeLayout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const location = useLocation();

  // Close dropdown when clicking outside or on a link (navigation)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Scroll tracking for navbar shadow
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Markets', to: '/markets' },
    { label: 'Trade', to: '/trade' },
    { label: 'Invest', to: '/invest' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'Company', to: '/company' },
    { label: 'About', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
  ];

  const footerPlatformLinks = [
    { label: 'Markets', to: '/markets' },
    { label: 'Trade', to: '/trade' },
    { label: 'Invest', to: '/invest' },
    { label: 'Analytics', to: '/analytics' },
    { label: 'API', to: '#' },
  ];

  const footerCompanyLinks = [
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '/careers' },
    { label: 'Press', to: '#' },
    { label: 'Contact', to: '/contact' },
  ];

  const footerLegalLinks = [
    { label: 'Privacy', to: '#' },
    { label: 'Terms', to: '#' },
    { label: 'Cookie Policy', to: '#' },
    { label: 'Compliance', to: '#' },
    { label: 'AML Policy', to: '#' },
  ];

  return (
    <div className="bg-[#07070e] text-[#e8e8f0] min-h-screen flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');

        .glow-dot { animation: glowPulse 2s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100% { opacity:1; box-shadow: 0 0 8px #00c896; } 50% { opacity:0.5; box-shadow: 0 0 20px #00c896; } }
        .grad-text { background: linear-gradient(135deg, #00c896 0%, #00a8ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
      `}</style>

      {/* Navbar */}
      <nav
        className={`flex items-center justify-between px-6 md:px-14 h-[68px] sticky top-0 z-50 bg-[rgba(7,7,14,0.85)] backdrop-blur-xl border-b border-[#1a1a28] ${
          scrollY > 40 ? 'border-b' : ''
        }`}
      >
        <Link to="/" className="flex items-center gap-2 text-[17px] font-extrabold tracking-tight">
          <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
          <span>Wix</span>
          <span className="grad-text">Capital</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex gap-6 text-[12px] font-semibold text-[#6b6b85]">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-[#e8e8f0] transition-colors relative group ${
                location.pathname === link.to ? 'text-[#00c896]' : ''
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00c896] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:block px-4 py-2 border border-[#2a2a3e] rounded-lg text-[11px] font-semibold text-[#9898b0] hover:border-[#00c896] hover:text-[#00c896] transition-all"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg text-[11px] font-bold bg-[#00c896] text-black hover:bg-[#00dea8] hover:shadow-[0_0_24px_rgba(0,200,150,0.4)] transition-all"
          >
            Get Started
          </Link>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="lg:hidden p-2 text-[#9898b0] hover:text-white"
          >
            {dropdownOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Dropdown Menu (mobile) */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="lg:hidden bg-[#0c0c16] border-b border-[#1a1a28] shadow-lg animate-fade-down"
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold ${
                  location.pathname === link.to
                    ? 'text-[#00c896]'
                    : 'text-[#9898b0]'
                } hover:text-white transition-colors`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#1a1a28]" />
            <Link
              to="/login"
              className="text-sm font-semibold text-[#9898b0] hover:text-white"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-[#00c896]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (unchanged) */}
      <footer className="border-t border-[#1a1a28] bg-[#05050d] px-6 md:px-14 pt-16 pb-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 text-[16px] font-extrabold mb-4">
                <div className="w-2 h-2 rounded-full bg-[#00c896] glow-dot" />
                <span>Wix</span>
                <span className="grad-text">Capital</span>
              </Link>
              <p className="text-[12px] text-[#4a4a64] leading-relaxed max-w-[240px]">
                Institutional-grade crypto trading platform built for modern investors.
              </p>
              <div className="flex gap-3 mt-5">
                {[...Array(3)].map((_, i) => (
                  <Link
                    key={i}
                    to="#"
                    className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                  >
                    <Link2 className="w-4 h-4" />
                  </Link>
                ))}
                <Link
                  to="#"
                  className="w-8 h-8 rounded-lg border border-[#1a1a28] flex items-center justify-center text-[#4a4a64] hover:border-[#00c896] hover:text-[#00c896] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#4a4a64] tracking-[0.14em] uppercase mb-4">Platform</div>
              <div className="space-y-2.5">
                {footerPlatformLinks.map(l => (
                  <Link key={l.label} to={l.to} className="block text-[12px] text-[#4a4a64] hover:text-[#9898b0] transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#4a4a64] tracking-[0.14em] uppercase mb-4">Company</div>
              <div className="space-y-2.5">
                {footerCompanyLinks.map(l => (
                  <Link key={l.label} to={l.to} className="block text-[12px] text-[#4a4a64] hover:text-[#9898b0] transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#4a4a64] tracking-[0.14em] uppercase mb-4">Legal</div>
              <div className="space-y-2.5">
                {footerLegalLinks.map(l => (
                  <Link key={l.label} to={l.to} className="block text-[12px] text-[#4a4a64] hover:text-[#9898b0] transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-[#0f0f1c] mb-8" />
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-[11px] text-[#2a2a3e]">© 2026 Wix Capital. All rights reserved.</div>
            <div className="text-[11px] text-[#2a2a3e]">Risk warning: Crypto investments involve significant risk.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;