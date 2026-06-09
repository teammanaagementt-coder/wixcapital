import { useState, useEffect } from 'react';
import { Key, RefreshCw, Plus, Trash2, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminWithdrawalCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCode, setNewCode] = useState({ assignedTo: '', amountLimit: '', expiresInDays: 7 });
  const [users, setUsers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchCodes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawal-codes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCodes(data);
    } catch (err) {
      toast.error('Failed to load codes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCodes();
    fetchUsers();
  }, []);

  const generateCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawal-codes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedTo: newCode.assignedTo || null,
          amountLimit: newCode.amountLimit ? parseFloat(newCode.amountLimit) : null,
          expiresInDays: parseInt(newCode.expiresInDays)
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Code ${data.code} generated`);
        fetchCodes();
        setShowModal(false);
        setNewCode({ assignedTo: '', amountLimit: '', expiresInDays: 7 });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Error generating code');
    }
  };

  const revokeCode = async (id) => {
    if (!confirm('Revoke this code? It will no longer be usable.')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/withdrawal-codes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Code revoked');
        fetchCodes();
      } else {
        toast.error('Failed to revoke');
      }
    } catch (err) {
      toast.error('Error revoking code');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Code copied');
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Key className="w-6 h-6 text-primary" />
          Withdrawal Codes (WC Codes)
        </h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary rounded-lg text-sm flex items-center gap-2">
          <Plus size={16} /> Generate Code
        </button>
      </div>

      <div className="bg-dark-50/90 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-dark-100 text-gray-400">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Assigned To</th>
              <th className="px-4 py-3 text-right">Amount Limit</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Expires</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {codes.map(code => (
              <tr key={code._id}>
                <td className="px-4 py-3 font-mono text-primary flex items-center gap-2">
                  {code.code}
                  <button onClick={() => copyToClipboard(code.code)} className="text-gray-400 hover:text-white">
                    {copiedCode === code.code ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {code.assignedTo ? `${code.assignedTo.name} (${code.assignedTo.email})` : 'Any user'}
                </td>
                <td className="px-4 py-3 text-right">{code.amountLimit ? `$${code.amountLimit}` : 'Unlimited'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    code.status === 'active' ? 'bg-green-900/30 text-green-400' :
                    code.status === 'used' ? 'bg-gray-800 text-gray-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {code.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {new Date(code.expiresAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {code.status === 'active' && (
                    <button onClick={() => revokeCode(code._id)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {codes.length === 0 && <div className="text-center py-12 text-gray-500">No withdrawal codes yet.</div>}
      </div>

      {/* Modal for generating new code */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-100 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Generate Withdrawal Code</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Assign to user (optional)</label>
                <select
                  value={newCode.assignedTo}
                  onChange={(e) => setNewCode({ ...newCode, assignedTo: e.target.value })}
                  className="w-full mt-1 p-2 rounded bg-dark-200 border border-gray-700 text-white"
                >
                  <option value="">Any user</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400">Amount limit (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Unlimited"
                  value={newCode.amountLimit}
                  onChange={(e) => setNewCode({ ...newCode, amountLimit: e.target.value })}
                  className="w-full mt-1 p-2 rounded bg-dark-200 border border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Valid for (days)</label>
                <input
                  type="number"
                  min="1"
                  value={newCode.expiresInDays}
                  onChange={(e) => setNewCode({ ...newCode, expiresInDays: e.target.value })}
                  className="w-full mt-1 p-2 rounded bg-dark-200 border border-gray-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-700 text-white">Cancel</button>
                <button onClick={generateCode} className="px-4 py-2 rounded bg-primary text-white">Generate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawalCodes;