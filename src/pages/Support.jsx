import { useState } from 'react';
import { Calendar, MessageCircle, Mail, Phone, HelpCircle, BookOpen, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Message sent! We’ll get back to you soon.');
      setForm({ subject: '', message: '' });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div style={{
      padding: '24px',
      overflowX: 'hidden',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      fontFamily: "'Syne', sans-serif",
      background: '#0d0600',
      minHeight: '100vh'
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px 32px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', color: '#8a7060', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>Help & Support</span>
            </div>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            How can we help?
          </h1>
          <p style={{ color: '#8a7060', marginBottom: '0', maxWidth: '500px', fontSize: '14px' }}>
            Reach out to our support team or browse helpful resources.
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageCircle size={24} style={{ color: '#f97316' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Live Chat</h3>
          <p style={{ fontSize: '13px', color: '#8a7060', marginBottom: '16px' }}>Chat with our team in real-time.</p>
          <button style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
            Start Chat
          </button>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={24} style={{ color: '#f97316' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Email Us</h3>
          <p style={{ fontSize: '13px', color: '#8a7060', marginBottom: '16px' }}>support@wixcapital.com</p>
          <a href="mailto:support@wixcapital.com" style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
            Send Email
          </a>
        </div>
        <div style={{
          background: '#0a0400',
          border: '1px solid rgba(249,115,22,0.09)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'rgba(249,115,22,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={24} style={{ color: '#f97316' }} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Knowledge Base</h3>
          <p style={{ fontSize: '13px', color: '#8a7060', marginBottom: '16px' }}>Browse articles and FAQs.</p>
          <button style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: '#f97316',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fb923c'}
          onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
            View Articles
          </button>
        </div>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} style={{ color: '#f97316' }} /> Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { q: 'How do I deposit funds?', a: 'Go to Deposit, choose a method, enter the amount, and follow the payment instructions.' },
            { q: 'How long do withdrawals take?', a: 'Withdrawals are processed within 15–30 minutes for most methods.' },
            { q: 'Is my account secure?', a: 'Yes, we use 256-bit SSL encryption and cold storage for crypto assets.' },
            { q: 'How does the referral program work?', a: 'Share your unique link and earn 5% of your friends’ investments as commission.' },
          ].map((faq, i) => (
            <details key={i} style={{
              background: 'rgba(249,115,22,0.03)',
              border: '1px solid rgba(249,115,22,0.1)',
              borderRadius: '16px',
              padding: '12px 16px'
            }}>
              <summary style={{ fontSize: '13px', fontWeight: 500, color: '#fff', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ color: '#f97316', transition: 'transform 0.2s' }}>▼</span>
              </summary>
              <p style={{ marginTop: '12px', fontSize: '13px', color: '#8a7060' }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div style={{
        background: '#0a0400',
        border: '1px solid rgba(249,115,22,0.09)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Send size={20} style={{ color: '#f97316' }} /> Send a Message
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#8a7060' }}>Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '12px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                outline: 'none'
              }}
              placeholder="What's this about?"
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', color: '#8a7060' }}>Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '12px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(249,115,22,0.2)',
                color: '#fff',
                outline: 'none',
                resize: 'vertical'
              }}
              placeholder="Describe your issue or question..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '12px',
              borderRadius: '999px',
              background: '#f97316',
              color: '#fff',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              opacity: submitting ? 0.7 : 1
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#fb923c'; }}
            onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#f97316'; }}
          >
            {submitting ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: '8px' }} />
                Sending...
              </>
            ) : (
              <>
                <Send size={16} style={{ display: 'inline', marginRight: '8px' }} /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;