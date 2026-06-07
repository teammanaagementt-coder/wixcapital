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

  // Fetch user balance
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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Deposit Funds</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Wallet className="w-4 h-4" />
              <span>
                Balance: {loadingBalance ? '...' : `$${userBalance.toFixed(2)}`}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Fund Your Account</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Add funds to start investing or trading. Choose your preferred method below.
          </p>
        </div>
      </div>

      {/* Deposit Form */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary" />
            Deposit Details
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount to deposit</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="amount"
                type="number"
                step="any"
                min="50"
                {...register('amount', { required: 'Amount is required', min: 50 })}
                className="block w-full pl-10 pr-12 py-3 text-lg rounded-xl bg-dark-100 border border-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent text-white transition-all placeholder-gray-600"
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-sm text-danger">{errors.amount.message}</p>}
          </div>

          {/* Payment Methods Table */}
          <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-base font-semibold text-white">Select Deposit Method</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-100 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Method</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paymentMethods.map(method => (
                    <tr key={method.id} className="hover:bg-dark-100/50 transition-colors text-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-dark-100 p-1.5 mr-3 flex items-center justify-center">
                            <img src={method.icon} alt={method.name} className="h-full w-full object-contain" />
                          </div>
                          <p className="font-medium text-white">{method.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => selectMethod(method.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary-600 transition-colors"
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
            <div className="p-4 rounded-xl bg-dark-100 border border-gray-800 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-dark-200 p-2 mr-3 flex items-center justify-center">
                  {methodIcon && <img src={methodIcon} alt="" className="h-full w-full object-contain" />}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Selected Method</p>
                  <p className="text-base font-medium text-white">{methodName}</p>
                </div>
              </div>
              <button type="button" onClick={resetMethod} className="text-xs text-primary hover:underline">
                Change
              </button>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={!selectedMethod}
              className="w-full py-4 px-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Proceed to Payment</span>
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              By proceeding, you agree to our terms of service
            </p>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deposit Process */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center">
            <CheckCircle className="w-5 h-5 text-primary mr-2" />
            <h3 className="text-base font-medium text-white">Deposit Process</h3>
          </div>
          <div className="p-5">
            <ol className="relative border-l border-gray-800 ml-3 space-y-6">
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">1</span>
                </span>
                <h3 className="font-medium text-white">Select Method</h3>
                <p className="text-xs text-gray-400 mt-1">Choose your preferred deposit method.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">2</span>
                </span>
                <h3 className="font-medium text-white">Enter Amount</h3>
                <p className="text-xs text-gray-400 mt-1">Specify the amount you wish to deposit.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">3</span>
                </span>
                <h3 className="font-medium text-white">Complete Payment</h3>
                <p className="text-xs text-gray-400 mt-1">Follow instructions to complete your deposit.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">4</span>
                </span>
                <h3 className="font-medium text-white">Confirmation</h3>
                <p className="text-xs text-gray-400 mt-1">Your deposit will be confirmed and credited.</p>
              </li>
            </ol>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center">
            <Shield className="w-5 h-5 text-accent mr-2" />
            <h3 className="text-base font-medium text-white">Security Tips</h3>
          </div>
          <div className="p-5">
            <ul className="space-y-3">
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Always verify payment details before confirming.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Use secure and private internet connections.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Double-check network type for crypto deposits.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Never share your payment credentials.</p>
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-800">
              <div className="flex items-center p-3 rounded-lg bg-dark-100 border border-gray-800">
                <Clock className="w-5 h-5 text-tertiary mr-3 flex-shrink-0" />
                <p className="text-xs text-tertiary">
                  Need help? Contact support via the help center.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Stats */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Deposit Summary</h3>
            <div className="bg-dark-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Deposited</p>
                  <p className="text-2xl font-bold text-white">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <CircleCheckBig className="h-6 w-6 text-tertiary" />
                </div>
              </div>
            </div>
            <div className="bg-dark-100 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending Deposits</p>
                  <p className="text-2xl font-bold text-white">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <History className="h-6 w-6 text-tertiary" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/dashboard/transactions" className="flex items-center justify-center py-2 px-4 bg-dark-100 rounded-lg hover:bg-dark-200 transition-colors text-gray-300">
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