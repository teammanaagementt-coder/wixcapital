import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Copy, CheckCircle, Upload, AlertCircle, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const methodWalletMap = {
  '22': { address: '0xcd68e1adf3725725d4e8b6018a0cd325c49188a2', network: 'ERC20' },
  '17': { address: 'TXhhjkhjkdhjkdhjkhjkdhjkdhjkdhjkd', network: 'TRC20' },
  '2': { address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0b', network: 'ERC20' },
  '1': { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', network: 'Bitcoin' },
};

const DepositPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { methodId, methodName, amount, methodIcon } = location.state || {};
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!methodId || !amount) {
      toast.error('Invalid payment request');
      navigate('/dashboard/deposit');
    }
  }, [methodId, amount, navigate]);

  const walletInfo = methodWalletMap[methodId] || { address: 'Please contact support', network: 'N/A' };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Address copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, or PDF');
      return;
    }
    setProofFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('payment_method', methodId);
      formData.append('proof', proofFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/deposits/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Deposit request submitted!');
        navigate('/dashboard/transactions');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Confirm Payment</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/deposit')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0c0c16] border border-[#1a1a28] text-[#9898b0] hover:text-[#e8e8f0] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Complete Payment</h1>
          <p className="text-[#6b6b85] mb-2">
            Send exactly <span className="font-semibold text-[#e8e8f0]">${amount}</span> using {methodName}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          {/* Payment Method Header */}
          <div className="p-6 border-b border-[#1a1a28]">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0c0c16] flex items-center justify-center">
                {methodIcon && <img src={methodIcon} className="w-6 h-6 object-contain" alt="" />}
              </div>
              <div>
                <p className="text-sm text-[#6b6b85]">Selected payment method</p>
                <p className="text-lg font-semibold text-[#e8e8f0]">{methodName}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="mb-4 text-center p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28]">
                <p className="text-[#9898b0]">
                  You are to make a payment of <span className="font-bold text-[#e8e8f0]">${amount}</span> using {methodName}.
                </p>
              </div>
              <div className="my-6 flex justify-center">
                <div className="p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28] shadow-md inline-block">
                  <img src={methodIcon || '/images/usdt.png'} alt={methodName} className="h-16 object-contain" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-[#e8e8f0]">
                  {methodName} Address:
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={walletInfo.address}
                    className="w-full py-3 pl-4 pr-12 rounded-xl bg-[#0c0c16] border border-[#1a1a28] text-[#e8e8f0] focus:ring-2 focus:ring-[#00c896] font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(walletInfo.address)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(0,200,150,0.1)] text-[#00c896] hover:bg-[rgba(0,200,150,0.2)] transition-all"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-[#6b6b85]">
                  <span className="font-semibold">Network:</span> {walletInfo.network}
                </p>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mt-8 border-t border-[#1a1a28] pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#9898b0]">
                    Upload payment proof after sending
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="proof"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,application/pdf"
                      className="block w-full text-sm text-[#9898b0]
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-[#0c0c16] file:text-[#00c896]
                        hover:file:bg-[#1a1a28]
                        cursor-pointer focus:outline-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#4a4a64]">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        Submit Payment
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPayment;