import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, Shield, Eye, EyeOff, Sun } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const { dark, toggleDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0600',
      fontFamily: "'Syne', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        .glass-card {
          background: rgba(13, 6, 0, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 24px;
        }
        .input-dark {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: 16px;
          color: #fff;
          transition: all 0.2s ease;
        }
        .input-dark:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
        .btn-orange {
          background: #f97316;
          color: #fff;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-orange:hover {
          background: #fb923c;
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.4);
        }
        .btn-outline {
          background: transparent;
          border: 1px solid rgba(249, 115, 22, 0.3);
          color: #f97316;
          border-radius: 999px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          background: rgba(249, 115, 22, 0.08);
          border-color: #f97316;
        }
        .bg-dot-pattern {
          background-image: radial-gradient(circle, rgba(249, 115, 22, 0.08) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1a0e00',
          color: '#fff',
          border: '1px solid rgba(249,115,22,0.3)',
          fontFamily: "'Syne', sans-serif"
        },
      }} />

      {/* Theme toggle – kept for logic, always dark style */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 60 }}>
        <button
          onClick={toggleDark}
          style={{
            background: 'rgba(13,6,0,0.8)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#f97316',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Sun size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', minHeight: '100vh' }}>
        {/* Left panel – illustration */}
        <div style={{
          display: 'none',
          position: 'relative',
          overflow: 'hidden',
          background: '#080300',
          borderRight: '1px solid rgba(249,115,22,0.1)',
          '@media (min-width: 1024px)': { display: 'flex', width: '50%' }
        }} className="lg:flex lg:w-1/2 bg-dot-pattern items-center justify-center">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
          <div style={{ textAlign: 'center', maxWidth: 380, zIndex: 2, padding: '2rem' }}>
            <div style={{ marginBottom: 24 }}>
              <svg viewBox="0 0 40 40" width="48" height="48" style={{ margin: '0 auto' }}>
                <polygon points="20,2 38,12 38,28 20,38 2,28 2,12" fill="none" stroke="#f97316" strokeWidth="2.5"/>
                <polygon points="20,8 33,15 33,25 20,32 7,25 7,15" fill="rgba(249,115,22,0.15)" stroke="#f97316" strokeWidth="1.5"/>
                <polygon points="20,14 26,18 26,22 20,26 14,22 14,18" fill="#f97316"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
              Welcome to <span style={{ color: '#f97316' }}>AWixCapital</span>
            </h1>
            <p style={{ color: '#a89070', lineHeight: 1.6 }}>
              Secure trading, real‑time markets, and expert insights – all in one place.
            </p>
            <div style={{ marginTop: 48, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <div className="glow-dot" style={{ width: 6, height: 6, background: '#f97316', borderRadius: '50%', animation: 'glowPulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#f97316', fontFamily: "'Space Mono', monospace" }}>LIVE MARKETS</span>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ maxWidth: 480, width: '100%' }}>
            <div className="glass-card" style={{ padding: '32px 28px' }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Sign in</h2>
                <p style={{ color: '#8a7060', fontSize: 14 }}>Access your investment account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 8 }}>
                    Email or Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                    <input
                      type="text"
                      {...register('email', { required: 'Email or username is required' })}
                      className="input-dark"
                      style={{ width: '100%', padding: '14px 14px 14px 44px', fontSize: 14 }}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 6 }}>{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 8 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: 'Password is required' })}
                      className="input-dark"
                      style={{ width: '100%', padding: '14px 44px 14px 44px', fontSize: 14 }}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a89070', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 6 }}>{errors.password.message}</p>}
                </div>

                {/* Remember & Forgot */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#a89070' }}>
                    <input type="checkbox" {...register('remember')} style={{ accentColor: '#f97316' }} />
                    Remember me
                  </label>
                  <a href="/forgot-password" style={{ fontSize: 13, color: '#f97316', textDecoration: 'none' }}>Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-orange"
                  style={{ padding: '14px 24px', fontSize: 15, width: '100%' }}
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
              </form>

              <div style={{ marginTop: 32, textAlign: 'center', borderTop: '1px solid rgba(249,115,22,0.1)', paddingTop: 24 }}>
                <p style={{ fontSize: 13, color: '#a89070' }}>
                  Don't have an account?{' '}
                  <a href="/register" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>Sign up now</a>
                </p>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Shield size={14} style={{ color: '#f97316' }} />
              <span style={{ fontSize: 11, color: '#5a3a22' }}>Your data is protected – bank‑grade security</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .glow-dot { animation: glowPulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;