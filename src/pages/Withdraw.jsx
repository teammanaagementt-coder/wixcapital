import { useNavigate } from 'react-router-dom';
import { 
  Wallet, CircleCheckBig, ClockArrowDown, History, 
  Calendar, ArrowUp, Shield, CheckCircle, Clock, Info
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
    <div className="p-4 md:p-6 pb-20 md:pb-8 overflow-x-hidden flex-grow space-y-6" style={{ fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Header */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2 text-[#6b6b85] text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#4a4a64]">
              <Wallet className="w-4 h-4" />
              <span>Balance: $0.00</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#e8e8f0] mb-2">Place Withdrawal</h1>
          <p className="text-[#6b6b85] mb-6 max-w-lg">
            Withdraw funds to your external wallet or bank account.
          </p>
        </div>
      </div>

      {/* Withdrawal Methods Table */}
      <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
        <div className="p-5 border-b border-[#1a1a28]">
          <h2 className="text-base font-semibold text-[#e8e8f0]">Select Withdrawal Method</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0c0c16] text-[#6b6b85] text-xs uppercase">
                <th className="px-6 py-3 text-left font-medium">Method</th>
                <th className="px-6 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a28]">
              {withdrawalsMethods.map((method) => (
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
                      onClick={() => handleWithdraw(method)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#00c896] text-black hover:bg-[#00dea8] transition-colors"
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
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#1a1a28] flex items-center">
            <CheckCircle className="w-5 h-5 text-[#00c896] mr-2" />
            <h3 className="text-base font-medium text-[#e8e8f0]">Withdrawal Process</h3>
          </div>
          <div className="p-5">
            <ol className="relative border-l border-[#1a1a28] ml-3 space-y-6">
              {['Select Method', 'Enter Details', 'Confirmation', 'Processing'].map((step, idx) => (
                <li key={step} className="ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-[#1a1a28] rounded-full -left-3 ring-4 ring-[#0c0c18]">
                    <span className="text-xs font-bold text-[#00c896]">{idx + 1}</span>
                  </span>
                  <h3 className="font-medium text-[#e8e8f0]">{step}</h3>
                  <p className="text-xs text-[#6b6b85] mt-1">
                    {idx === 0 && 'Choose your preferred withdrawal method.'}
                    {idx === 1 && 'Provide your withdrawal amount and destination details.'}
                    {idx === 2 && 'Review and confirm your withdrawal request.'}
                    {idx === 3 && "Your request will be processed according to the method's timeframe."}
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
                'Always verify withdrawal addresses before confirming.',
                'For crypto, confirm network type to avoid loss.',
                'Never share your account credentials.',
                'Be cautious of phishing attempts.',
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
                <Info className="w-5 h-5 text-[#00c896] mr-3 flex-shrink-0" />
                <p className="text-xs text-[#00c896]">
                  Need help? Contact support via the help center.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Summary */}
        <div className="bg-[#0c0c18] border border-[#1a1a28] rounded-xl overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-[#e8e8f0] mb-4">Withdrawal Summary</h3>
            <div className="bg-[#0c0c16] rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6b6b85]">Total Withdrawals</p>
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
                  <p className="text-sm text-[#6b6b85]">Pending Withdrawals</p>
                  <p className="text-2xl font-bold text-[#e8e8f0]">$0.00</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-[rgba(0,200,150,0.1)] flex items-center justify-center">
                  <ClockArrowDown className="h-6 w-6 text-[#00c896]" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard/transactions')}
                className="flex items-center justify-center w-full py-2 px-4 bg-[#0c0c16] rounded-lg hover:bg-[#1a1a28] transition-colors text-[#9898b0]"
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