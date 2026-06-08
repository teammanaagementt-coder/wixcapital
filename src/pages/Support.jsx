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
    // Simulate sending (replace with actual API if needed)
    setTimeout(() => {
      toast.success('Message sent! We’ll get back to you soon.');
      setForm({ subject: '', message: '' });
      setSubmitting(false);
    }, 1500);
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
              <span>Help & Support</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">How can we help?</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Reach out to our support team or browse helpful resources.
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[#00c896]" />
          </div>
          <h3 className="text-lg font-semibold text-[#e8e8f0] mb-1">Live Chat</h3>
          <p className="text-sm text-[#6b6b85] mb-4">Chat with our team in real-time.</p>
          <button className="px-5 py-2 rounded-lg bg-[#00c896] text-black font-medium hover:bg-[#00dea8] transition-colors">
            Start Chat
          </button>
        </div>
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
            <Mail className="w-6 h-6 text-[#00c896]" />
          </div>
          <h3 className="text-lg font-semibold text-[#e8e8f0] mb-1">Email Us</h3>
          <p className="text-sm text-[#6b6b85] mb-4">support@wixcapital.com</p>
          <a href="mailto:support@wixcapital.com" className="px-5 py-2 rounded-lg bg-[#00c896] text-black font-medium hover:bg-[#00dea8] transition-colors inline-block">
            Send Email
          </a>
        </div>
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-[#00c896]" />
          </div>
          <h3 className="text-lg font-semibold text-[#e8e8f0] mb-1">Knowledge Base</h3>
          <p className="text-sm text-[#6b6b85] mb-4">Browse articles and FAQs.</p>
          <button className="px-5 py-2 rounded-lg bg-[#00c896] text-black font-medium hover:bg-[#00dea8] transition-colors">
            View Articles
          </button>
        </div>
      </div>

      {/* FAQ Accordion (simple) */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e8e8f0] mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#00c896]" /> Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            { q: 'How do I deposit funds?', a: 'Go to Deposit, choose a method, enter the amount, and follow the payment instructions.' },
            { q: 'How long do withdrawals take?', a: 'Withdrawals are processed within 15–30 minutes for most methods.' },
            { q: 'Is my account secure?', a: 'Yes, we use 256-bit SSL encryption and cold storage for crypto assets.' },
            { q: 'How does the referral program work?', a: 'Share your unique link and earn 5% of your friends’ investments as commission.' },
          ].map((faq, i) => (
            <details key={i} className="bg-[#0c0c16] border border-[#1a1a28] rounded-xl p-4 group">
              <summary className="text-sm font-medium text-[#e8e8f0] cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <span className="text-[#6b6b85] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-sm text-[#6b6b85]">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#e8e8f0] mb-4 flex items-center gap-2">
          <Send className="w-5 h-5 text-[#00c896]" /> Send a Message
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-[#6b6b85]">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
              placeholder="What's this about?"
            />
          </div>
          <div>
            <label className="text-sm text-[#6b6b85]">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full mt-1 p-3 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] focus:border-transparent"
              placeholder="Describe your issue or question..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;