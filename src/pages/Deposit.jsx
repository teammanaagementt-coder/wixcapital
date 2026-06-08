import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Wallet, Shield, Clock, CheckCircle, CircleCheckBig, History, 
  Calendar, ArrowUpRight, DollarSign 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const paymentMethods = [
  { id: '22', name: 'USDT (ERC20)', icon: '/images/usdt.png' },
  { id: '17', name: 'USDT (TRC20)', icon: '/images/usdt.png' },
  { id: '2', name: 'Ethereum (ERC20)', icon: '/images/eth.png' },
  { id: '1', name: 'Bitcoin', icon: '/images/btc.png' },
];

const Deposit = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [methodName, setMethodName] = useState('');
  const [methodIcon, setMethodIcon] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUserBalance(data.user.balance);
        } else {
          toast.error('Could not load balance');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBalance(false);
      }
    };
    fetchBalance();
  }, []);

  const selectMethod = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method) {
      setSelectedMethod(id);
      setMethodName(method.name);
      setMethodIcon(method.icon);
      toast.success(`You have chosen to pay with ${method.name}`);
    }
  };

  const resetMethod = () => {
    setSelectedMethod(null);
    setMethodName('');
    setMethodIcon(null);
  };

  const onSubmit = async (data) => {
    if (!selectedMethod) {
      toast.error('Please choose a payment method');
      return;
    }
    navigate('/dashboard/deposit-payment', {
      state: {
        methodId: selectedMethod,
        methodName: methodName,
        amount: data.amount,
        methodIcon: methodIcon,
      }
    });
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
              <span>Deposit Funds</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#4a4a64]">
              <Wallet className="w-4 h-4" />
              <span>
                Balance: {loadingBalance ? '...' : `$${userBalance.toFixed(2)}`}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Fund Your Account</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Add funds to start investing or trading. Choose your preferred method below.
          </p>
        </div>
      </div>

      {/* Deposit Form */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#1a1a28]">
          <h2 className="text-base font-semibold text-[#e8e8f0] flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-[#00c896]" />
            Deposit Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-[#9898b0]">Amount to deposit</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-[#6b6b85]">$</span>
              </div>
              <input
                id="amount"
                type="number"
                step="any"
                min="50"
                {...register('amount', { required: 'Amount is required', min: 50 })}
                className="block w-full pl-10 pr-12 py-3 text-lg rounded-xl bg-[#0c0c16] border border-[#1a1a28] focus:ring-2 focus:ring-[#00c896] focus:border-transparent text-[#e8e8f0] transition-all placeholder-[#4a4a64]"
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-sm text-[#ff5b6e]">{errors.amount.message}</p>}
          </div>

          {/* Payment Methods Table */}
          <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#1a1a28]">
              <h2 className="text-base font-semibold text-[#e8e8f0]">Select Deposit Method</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0c0c16] text-[#6b6b85] text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Method</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a28]">
                  {paymentMethods.map(method => (
                    <tr key={method.id} className="hover:bg-[#1a1a28]/50 transition-colors text-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-[#0c0c16] p-1.5 mr-3 flex items-center justify-center">
                            <img src={method.icon} alt={method.name} className="h-full w-full object-contain" />
                          </div>
                          <p className="font-medium text-[#e8e8f0]">{method.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => selectMethod(method.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#00c896] text-black hover:bg-[#00dea8] transition-colors"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedMethod && (
            <div className="p-4 rounded-xl bg-[#0c0c16] border border-[#1a1a28] flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-[#1a1a28] p-2 mr-3 flex items-center justify-center">
                  {methodIcon && <img src={methodIcon} alt="" className="h-full w-full object-contain" />}
                </div>
                <div>
                  <p className="text-sm text-[#6b6b85]">Selected Method</p>
                  <p className="text-base font-medium text-[#e8e8f0]">{methodName}</p>
                </div>
              </div>
              <button type="button" onClick={resetMethod} className="text-xs text-[#00c896] hover:underline">
                Change
              </button>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!selectedMethod}
              className="w-full py-4 px-4 rounded-xl bg-[#00c896] hover:bg-[#00dea8] text-black font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Proceed to Payment</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-center text-xs text-[#4a4a64]">
              By proceeding, you agree to our terms of service
            </p>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deposit Process */}
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center">
            <CheckCircle className="w-5 h-5 text-[#00c896] mr-2" />
            <h3 className="text-base font-medium text-[#e8e8f0]">Deposit Process</h3>
          </div>
          <div className="p-5">
            <ol className="relative border-l border-[#1a1a28] ml-3 space-y-6">
              {['Select Method', 'Enter Amount', 'Complete Payment', 'Confirmation'].map((step, idx) => (
                <li key={step} className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-[#1a1a28] rounded-full -left-3 ring-4 ring-[#0c0c18]">
                    <span className="text-xs font-bold text-[#00c896]">{idx + 1}</span>
                  </span>
                  <h3 className="font-medium text-[#e8e8f0]">{step}</h3>
                  <p className="text-xs text-[#6b6b85] mt-1">
                    {idx === 0 && 'Choose your preferred deposit method.'}
                    {idx === 1 && 'Specify the amount you wish to deposit.'}
                    {idx === 2 && 'Follow instructions to complete your deposit.'}
                    {idx === 3 && 'Your deposit will be confirmed and credited.'}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center">
            <Shield className="w-5 h-5 text-[#00c896] mr-2" />
            <h3 className="text-base font-medium text-[#e8e8f0]">Security Tips</h3>
          </div>
          <div className="p-5">
            <ul className="space-y-3">
              {[
                'Always verify payment details before confirming.',
                'Use secure and private internet connections.',
                'Double-check network type for crypto deposits.',
                'Never share your payment credentials.',
              ].map((tip, i) => (
                <li key={i} className="flex">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1a1a28] flex items-center justify-center mr-3 mt-0.5">
                    <CheckCircle className="w-3 h-3 text-[#00c896]" />
                  </div>
                  <p className="text-xs text-[#6b6b85]">{tip}</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-4 border-t border-[#1a1a28]">
              <div className="flex items-center p-3 rounded-lg bg-[#0c0c16] border border-[#1a1a28]">
                <Clock className="w-5 h-5 text-[#00c896] mr-3 flex-shrink-0" />
                <p className="text-xs text-[#00c896]">
                  Need help? Contact support via the help center.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Stats */}
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-[#e8e8f0] mb-4">Deposit Summary</h3>
            <div className="bg-[#0c0c16] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6b6b85]">Total Deposited</p>
                  <p className="text-2xl font-bold text-[#e8e8f0]">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
                  <CircleCheckBig className="h-6 w-6 text-[#00c896]" />
                </div>
              </div>
            </div>
            <div className="bg-[#0c0c16] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6b6b85]">Pending Deposits</p>
                  <p className="text-2xl font-bold text-[#e8e8f0]">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
                  <History className="h-6 w-6 text-[#00c896]" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/dashboard/transactions" className="flex items-center justify-center py-2 px-4 bg-[#0c0c16] rounded-lg hover:bg-[#1a1a28] transition-colors text-[#9898b0]">
                <History className="h-4 w-4 mr-2" />
                <span>View Deposit History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;