import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet, ArrowUpRight, Clock, Info, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const getDetailsConfig = (methodName) => {
  const method = methodName?.toLowerCase() || '';
  if (method.includes('zelle')) {
    return {
      label: 'Zelle Details',
      placeholder: 'Enter your Zelle email or phone number',
      example: 'Example: your@email.com or (123) 456-7890',
    };
  }
  if (method.includes('bank transfer')) {
    return {
      label: 'Bank Transfer Details',
      placeholder: 'Bank Name, Account Number, Account Name, Swift Code',
      example: 'Example: Chase, 123456789, John Doe, CHASUS33',
    };
  }
  if (method.includes('usdt') || method.includes('erc20') || method.includes('trc20')) {
    return {
      label: 'Wallet Address (USDT)',
      placeholder: 'Enter your USDT wallet address',
      example: 'Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0b...',
    };
  }
  if (method.includes('ethereum')) {
    return {
      label: 'Ethereum Wallet Address',
      placeholder: 'Enter your Ethereum address (0x...)',
      example: 'Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f0b...',
    };
  }
  if (method.includes('bitcoin')) {
    return {
      label: 'Bitcoin Wallet Address',
      placeholder: 'Enter your Bitcoin address',
      example: 'Example: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    };
  }
  return {
    label: 'Withdrawal Details',
    placeholder: 'Enter your payment details',
    example: 'Provide the necessary information to receive your funds',
  };
};

const WithdrawFunds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { method: selectedMethod } = location.state || {};
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [wcCode, setWcCode] = useState('');
  const [fee, setFee] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const feePercentage = 10;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setBalance(data.user.balance);
        }
      } catch (err) {
        toast.error('Could not load balance');
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    const amt = parseFloat(amount) || 0;
    const calculatedFee = (amt * feePercentage) / 100;
    setFee(calculatedFee);
    setTotalCost(amt + calculatedFee);
  }, [amount]);

  const isExceedingBalance = totalCost > balance;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (isExceedingBalance) {
      toast.error('Insufficient balance to cover amount + fee');
      return;
    }
    if (!details.trim()) {
      toast.error('Please provide your withdrawal details');
      return;
    }
    if (!wcCode.trim()) {
      toast.error('WC code is required');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          method: selectedMethod.name,
          details: details,
          wcCode: wcCode,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Withdrawal request submitted successfully!');
        navigate('/dashboard/withdraw');
      } else {
        toast.error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Provide a fallback if selectedMethod is missing (prevents crash)
  const method = selectedMethod || { name: 'USDT (ERC20)', icon: '/images/usdt.png' };
  const { label, placeholder, example } = getDetailsConfig(method.name);

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Withdrawal Details</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Wallet className="w-4 h-4" />
              <span>
                Balance: {loadingBalance ? '...' : `$${balance.toFixed(2)}`}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Withdrawal Details</h1>
          <p className="text-gray-400 mb-2">Complete your withdrawal request</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          {/* Method Header */}
          <div className="border-b border-gray-800">
            <div className="flex items-center px-6 py-4">
              <div className="flex items-center px-4 py-2 bg-dark-100 rounded-full">
                <div className="w-6 h-6 rounded-full bg-dark-200 flex items-center justify-center mr-2">
                  {method.icon ? (
                    <img src={method.icon} alt={method.name} className="w-4 h-4 object-contain" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-secondary" />
                  )}
                </div>
                <span className="text-sm font-medium text-white">{method.name}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount to withdraw</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full pl-10 pr-20 py-3 text-lg rounded-xl bg-dark-100 border border-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder-gray-600"
                    placeholder="0.00"
                    required
                  />
                </div>
                {amount && (
                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Fee ({feePercentage}%):</span>
                      <span>${fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total cost:</span>
                      <span className={isExceedingBalance ? 'text-danger' : ''}>${totalCost.toFixed(2)}</span>
                    </div>
                    {isExceedingBalance && <p className="text-danger">Amount + fee exceeds your available balance</p>}
                  </div>
                )}
              </div>

              {/* Dynamic Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="block w-full p-4 text-md rounded-xl bg-dark-100 border border-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder-gray-600"
                  placeholder={placeholder}
                  required
                />
                <div className="p-3 rounded-lg bg-dark-100 border border-gray-800">
                  <div className="flex gap-2">
                    <Info className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">
                        Please enter your necessary details required to receive your payment:
                      </p>
                      <p className="text-xs font-medium text-gray-300 mt-1">{example}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WC Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">WC Code</label>
                <input
                  type="text"
                  value={wcCode}
                  onChange={(e) => setWcCode(e.target.value)}
                  className="block w-full pl-4 pr-4 py-3 text-md rounded-xl bg-dark-100 border border-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent text-white font-mono transition-all placeholder-gray-600"
                  placeholder="Enter your withdrawal confirmation code"
                  required
                />
                <p className="mt-2 text-xs text-gray-500">
                  Please input your withdrawal confirmation code or contact support to purchase a code.
                </p>
              </div>

              {/* Processing time */}
              <div className="flex items-center p-4 rounded-xl bg-dark-100 border border-gray-800 gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-200 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Estimated processing time</h3>
                  <p className="text-xs text-gray-400">
                    Your withdrawal will be processed within 15–30 minutes.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting || isExceedingBalance || !amount}
                  className="w-full py-4 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  <span>{submitting ? 'Submitting...' : 'Complete Withdrawal Request'}</span>
                </button>
                <p className="mt-3 text-center text-xs text-gray-500">
                  By proceeding, you confirm that the provided information is correct
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;