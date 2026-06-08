import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  User, UserCheck, Mail, Phone, Lock, Sun, MapPin, Users, UserPlus, Shield, Eye, EyeOff
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const countries = [
  { code: 'US', name: 'United States of America' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' },
];

const Register = () => {
  const { dark, toggleDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem('token', result.token);
        toast.success('Registration successful!');
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

      {/* Theme toggle – kept for logic */}
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
              Start your <span style={{ color: '#f97316' }}>journey</span>
            </h1>
            <p style={{ color: '#a89070', lineHeight: 1.6 }}>
              Join thousands of investors building wealth with transparent, secure tools.
            </p>
            <div style={{ marginTop: 48, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <div className="glow-dot" style={{ width: 6, height: 6, background: '#f97316', borderRadius: '50%', animation: 'glowPulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#f97316', fontFamily: "'Space Mono', monospace" }}>SECURE & REGULATED</span>
            </div>
          </div>
        </div>

        {/* Right panel – registration form */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ maxWidth: 540, width: '100%' }}>
            <div className="glass-card" style={{ padding: '28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Create Account</h2>
                <p style={{ color: '#8a7060', fontSize: 14 }}>Start investing in minutes</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gap: 18 }}>
                  {/* Username */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Username *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type="text" {...register('username', { required: 'Username is required' })} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14 }} placeholder="unique_username" />
                    </div>
                    {errors.username && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.username.message}</p>}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <UserCheck size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type="text" {...register('name', { required: 'Full name is required' })} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14 }} placeholder="John Doe" />
                    </div>
                    {errors.name && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14 }} placeholder="hello@example.com" />
                    </div>
                    {errors.email && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Phone Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type="tel" {...register('phone', { required: 'Phone number is required' })} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14 }} placeholder="+1 234 567 890" />
                    </div>
                    {errors.phone && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.phone.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type={showPassword ? 'text' : 'password'} {...register('password', { required: 'Password required', minLength: { value: 8, message: 'At least 8 characters' } })} className="input-dark" style={{ width: '100%', padding: '12px 44px 12px 44px', fontSize: 14 }} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a89070', cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Confirm Password *</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type={showConfirmPassword ? 'text' : 'password'} {...register('password_confirmation', { required: 'Please confirm', validate: value => value === password || 'Passwords do not match' })} className="input-dark" style={{ width: '100%', padding: '12px 44px 12px 44px', fontSize: 14 }} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a89070', cursor: 'pointer' }}>
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password_confirmation && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.password_confirmation.message}</p>}
                  </div>

                  {/* Country */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Country *</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7, pointerEvents: 'none' }} />
                      <select {...register('country', { required: 'Country is required' })} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14, appearance: 'none', cursor: 'pointer' }}>
                        <option value="">Select country</option>
                        {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                      </select>
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a89070" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                    {errors.country && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.country.message}</p>}
                  </div>

                  {/* Referral ID */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Referral ID (Optional)</label>
                    <div style={{ position: 'relative' }}>
                      <Users size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#f97316', opacity: 0.7 }} />
                      <input type="text" {...register('ref_by')} className="input-dark" style={{ width: '100%', padding: '12px 12px 12px 44px', fontSize: 14 }} placeholder="Enter referral code" />
                    </div>
                  </div>

                  {/* reCAPTCHA placeholder – kept exactly */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#e0c9a0', marginBottom: 6, display: 'block' }}>Captcha *</label>
                    <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
                    <p style={{ fontSize: 10, color: '#5a3a22', marginTop: 4 }}>reCAPTCHA integration – replace with actual widget</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-orange"
                  style={{ padding: '14px 24px', fontSize: 15, width: '100%', marginTop: 8 }}
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </button>
              </form>

              <div style={{ marginTop: 28, textAlign: 'center', borderTop: '1px solid rgba(249,115,22,0.1)', paddingTop: 24 }}>
                <p style={{ fontSize: 13, color: '#a89070' }}>
                  Already have an account?{' '}
                  <a href="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
                </p>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Shield size={14} style={{ color: '#f97316' }} />
              <span style={{ fontSize: 11, color: '#5a3a22' }}>Your information is secure – We respect your privacy</span>
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

export default Register;