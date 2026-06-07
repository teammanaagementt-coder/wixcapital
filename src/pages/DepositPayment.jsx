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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Confirm Payment</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard/deposit')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-100 border border-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-gray-400 mb-2">
            Send exactly <span className="font-semibold text-white">${amount}</span> using {methodName}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          {/* Payment Method Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-dark-100 flex items-center justify-center">
                {methodIcon && <img src={methodIcon} className="w-6 h-6 object-contain" alt="" />}
              </div>
              <div>
                <p className="text-sm text-gray-400">Selected payment method</p>
                <p className="text-lg font-semibold text-white">{methodName}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="mb-4 text-center p-4 rounded-xl bg-dark-100 border border-gray-800">
                <p className="text-gray-300">
                  You are to make a payment of <span className="font-bold text-white">${amount}</span> using {methodName}.
                </p>
              </div>
              <div className="my-6 flex justify-center">
                <div className="p-4 rounded-xl bg-dark-100 border border-gray-800 shadow-md inline-block">
                  <img src={methodIcon || '/images/usdt.png'} alt={methodName} className="h-16 object-contain" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {methodName} Address:
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={walletInfo.address}
                    className="w-full py-3 pl-4 pr-12 rounded-xl bg-dark-100 border border-gray-800 text-white focus:ring-2 focus:ring-primary font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(walletInfo.address)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Network:</span> {walletInfo.network}
                </p>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mt-8 border-t border-gray-800 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Upload payment proof after sending
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="proof"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,application/pdf"
                      className="block w-full text-sm text-gray-300
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-dark-100 file:text-primary
                        hover:file:bg-dark-200
                        cursor-pointer focus:outline-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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