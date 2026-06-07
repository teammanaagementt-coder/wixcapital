import { useNavigate } from 'react-router-dom';
import { 
  Wallet, CircleCheckBig, ClockArrowDown, History, 
  Calendar, ArrowUp 
} from 'lucide-react';

const withdrawalsMethods = [
  { id: 'zelle', name: 'Zelle', icon: '/images/zelle.png' },
  { id: 'usdt_erc20', name: 'USDT (ERC20)', icon: '/images/usdt.png' },
  { id: 'usdt_trc20', name: 'USDT (TRC20)', icon: '/images/usdt.png' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '/images/bank.png' },
  { id: 'ethereum', name: 'Ethereum (ERC20)', icon: '/images/eth.png' },
  { id: 'bitcoin', name: 'Bitcoin', icon: '/images/btc.png' },
];

const Withdraw = () => {
  const navigate = useNavigate();

  const handleWithdraw = (method) => {
    navigate('/dashboard/withdraw-funds', { state: { method } });
  };

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6">
      {/* Header */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-gray-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Wallet className="w-4 h-4" />
              <span>Balance: $0.00</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Place Withdrawal</h1>
          <p className="text-gray-400 mb-6 max-w-lg">
            Withdraw funds to your external wallet or bank account.
          </p>
        </div>
      </div>

      {/* Withdrawal Methods Table */}
      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">Select Withdrawal Method</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-100 text-gray-400 text-xs uppercase">
                <th className="px-6 py-3 text-left font-medium">Method</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {withdrawalsMethods.map((method) => (
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
                      onClick={() => handleWithdraw(method)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary-600 transition-colors"
                    >
                      Withdraw
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Withdrawal Process */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center">
            <svg className="w-5 h-5 text-primary mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M10.75 2.44995C11.44 1.85995 12.57 1.85995 13.27 2.44995L14.85 3.81001C15.15 4.07001 15.71 4.28002 16.11 4.28002H17.81C18.87 4.28002 19.74 5.14996 19.74 6.20996V7.91003C19.74 8.30003 19.95 8.87001 20.21 9.17001L21.57 10.75C22.16 11.44 22.16 12.57 21.57 13.27L20.21 14.85C19.95 15.15 19.74 15.71 19.74 16.11V17.8101C19.74 18.8701 18.87 19.74 17.81 19.74H16.11C15.72 19.74 15.15 19.95 14.85 20.21L13.27 21.5699C12.58 22.1599 11.45 22.1599 10.75 21.5699L9.17004 20.21C8.87004 19.95 8.31004 19.74 7.91004 19.74H6.18C5.12 19.74 4.25 18.8701 4.25 17.8101V16.1C4.25 15.71 4.04 15.15 3.79 14.85L2.44 13.26C1.86 12.57 1.86 11.45 2.44 10.76L3.79 9.17001C4.04 8.87001 4.25 8.31003 4.25 7.91003V6.20996C4.25 5.14996 5.12 4.28002 6.18 4.28002H7.91004C8.30004 4.28002 8.87004 4.07001 9.17004 3.81001L10.75 2.44995Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M10.58 16.46L7.34998 13.23C6.94998 12.83 6.94998 12.16 7.34998 11.76C7.74998 11.36 8.41998 11.36 8.81998 11.76L10.58 13.52L15.18 8.91998C15.58 8.51998 16.25 8.51998 16.65 8.91998C17.05 9.31998 17.05 9.98998 16.65 10.39L10.58 16.46Z" fill="currentColor" />
            </svg>
            <h3 className="text-base font-medium text-white">Withdrawal Process</h3>
          </div>
          <div className="p-5">
            <ol className="relative border-l border-gray-800 ml-3 space-y-6">
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">1</span>
                </span>
                <h3 className="font-medium text-white">Select Method</h3>
                <p className="text-xs text-gray-400 mt-1">Choose your preferred withdrawal method.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">2</span>
                </span>
                <h3 className="font-medium text-white">Enter Details</h3>
                <p className="text-xs text-gray-400 mt-1">Provide your withdrawal amount and destination details.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">3</span>
                </span>
                <h3 className="font-medium text-white">Confirmation</h3>
                <p className="text-xs text-gray-400 mt-1">Review and confirm your withdrawal request.</p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-dark-100 rounded-full -left-3 ring-4 ring-dark-50">
                  <span className="text-xs font-bold text-primary">4</span>
                </span>
                <h3 className="font-medium text-white">Processing</h3>
                <p className="text-xs text-gray-400 mt-1">Your request will be processed according to the method's timeframe.</p>
              </li>
            </ol>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center">
            <svg className="w-5 h-5 text-accent mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M10.49 2.23006L5.50003 4.10004C4.35003 4.53004 3.41003 5.89004 3.41003 7.12004V14.55C3.41003 15.73 4.19005 17.28 5.14005 17.99L9.44003 21.2C10.85 22.26 13.17 22.26 14.58 21.2L18.88 17.99C19.83 17.28 20.61 15.73 20.61 14.55V7.12004C20.61 5.89004 19.67 4.53004 18.52 4.10004L13.53 2.23006C12.68 1.92006 11.32 1.92006 10.49 2.23006Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 12.5C11.59 12.5 11.25 12.16 11.25 11.75V8.75C11.25 8.34 11.59 8 12 8C12.41 8 12.75 8.34 12.75 8.75V11.75C12.75 12.16 12.41 12.5 12 12.5Z" fill="currentColor" />
              <path d="M12 16C11.44 16 11 15.55 11 15C11 14.45 11.45 14 12 14C12.55 14 13 14.45 13 15C13 15.55 12.56 16 12 16Z" fill="currentColor" />
            </svg>
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
                <p className="text-xs text-gray-400">Always verify withdrawal addresses before confirming.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">For crypto, confirm network type to avoid loss.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Never share your account credentials.</p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-100 flex items-center justify-center mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 10L10.2 14.2L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-xs text-gray-400">Be cautious of phishing attempts.</p>
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-gray-800">
              <div className="flex items-center p-3 rounded-lg bg-dark-100 border border-gray-800">
                <svg className="w-5 h-5 text-tertiary mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M12 6V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-xs text-tertiary">
                  Need help? Contact support via the help center.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Summary */}
        <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Withdrawal Summary</h3>
            <div className="bg-dark-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Withdrawals</p>
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
                  <p className="text-sm text-gray-400">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-white">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <ClockArrowDown className="h-6 w-6 text-tertiary" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/transactions')}
                className="flex items-center justify-center w-full py-2 px-4 bg-dark-100 rounded-lg hover:bg-dark-200 transition-colors text-gray-300"
              >
                <History className="h-4 w-4 mr-2" />
                <span>View Withdrawal History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;