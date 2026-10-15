import { useState } from 'react';
import { useApp } from '../App';
import { useStore } from '../store/StoreContext';
import { clients } from '../data/mockData';
import { Plus, Download, Send, FileText, CheckCircle2, TrendingDown, X } from 'lucide-react';

export default function Invoices() {
  const { darkMode } = useApp();
  const store = useStore();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'expenses'>('invoices');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    number: `INV-${Date.now()}`,
    clientId: 'c1',
    projectId: 'p1',
    amount: 0,
    currency: 'INR',
    status: 'sent' as 'draft' | 'sent' | 'paid' | 'overdue' | 'partially_paid',
    issuedDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    gst: 18,
    cgst: 0,
    sgst: 0,
    igst: 0,
    type: 'intra-state' as 'intra-state' | 'inter-state',
  });
  const [newPayment, setNewPayment] = useState({
    invoiceId: '',
    clientId: 'c1',
    amount: 0,
    currency: 'INR',
    date: new Date().toISOString().split('T')[0],
    method: 'Bank Transfer',
    reference: '',
    projectId: 'p1',
  });

  const getClient = (id: string) => clients.find(c => c.id === id);

  const filteredInvoices = store.invoices.filter((inv: any) => statusFilter === 'all' || inv.status === statusFilter);

  const totalInvoiced = store.invoices.reduce((s: number, i: any) => s + i.amount, 0);
  const totalPaid = store.invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + i.amount, 0);
  const totalOverdue = store.invoices.filter((i: any) => i.status === 'overdue').reduce((s: number, i: any) => s + i.amount, 0);
  const totalExpenses = store.expenses.reduce((s: number, e: any) => s + e.amount, 0);

  const handleCreateInvoice = () => {
    if (!newInvoice.amount) return;
    store.addInvoice({
      ...newInvoice,
      amount: Number(newInvoice.amount),
      cgst: newInvoice.type === 'intra-state' ? (newInvoice.amount * newInvoice.gst / 2) / 100 : 0,
      sgst: newInvoice.type === 'intra-state' ? (newInvoice.amount * newInvoice.gst / 2) / 100 : 0,
      igst: newInvoice.type === 'inter-state' ? (newInvoice.amount * newInvoice.gst) / 100 : 0,
    });
    store.addNotification({
      type: 'payment',
      title: 'New invoice created',
      message: `Invoice #${newInvoice.number}`,
      time: 'Just now',
      read: false,
    });
    setShowNewInvoice(false);
  };

  const handleRecordPayment = () => {
    if (!newPayment.amount || !newPayment.invoiceId) return;
    store.addPayment({
      ...newPayment,
      amount: Number(newPayment.amount),
    });
    store.addNotification({
      type: 'payment',
      title: 'Payment recorded',
      message: `₹${newPayment.amount} received`,
      time: 'Just now',
      read: false,
    });
    setShowRecordPayment(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      paid: { bg: '#f0fdf4', text: '#166534' },
      sent: { bg: '#eff6ff', text: '#1d4ed8' },
      overdue: { bg: '#fef2f2', text: '#991b1b' },
      partially_paid: { bg: '#fffbeb', text: '#92400e' },
      draft: { bg: '#FAFAF8', text: '#78716C' },
    };
    const labels: Record<string, string> = {
      paid: 'Paid', sent: 'Sent', overdue: 'Overdue', partially_paid: 'Partial', draft: 'Draft'
    };
    const style = styles[status] || styles.draft;
    return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: style.bg, color: style.text }}>{labels[status] || status}</span>;
  };

  const cardClass = `rounded-xl bg-white`;
  const cardStyle = { border: '1px solid #E7E5E4' };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments & Invoices</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>Manage invoices, track payments, and monitor expenses</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowRecordPayment(true)} className="px-4 py-2 rounded-lg text-sm font-medium border border-[#E7E5E4] transition hover:bg-stone-50">
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Record Payment</span>
          </button>
          <button onClick={() => setShowNewInvoice(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${cardClass} p-4 border-l-4 border-l-blue-500`} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Total Invoiced</p>
          <p className="text-xl font-bold">₹{(totalInvoiced / 100000).toFixed(1)}L</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-green-500`} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Collected</p>
          <p className="text-xl font-bold text-green-500">₹{(totalPaid / 100000).toFixed(1)}L</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-red-500`} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Overdue</p>
          <p className="text-xl font-bold text-red-500">₹{(totalOverdue / 1000).toFixed(0)}K</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-purple-500`} style={cardStyle}>
          <p className="text-xs" style={{ color: '#78716C' }}>Expenses</p>
          <p className="text-xl font-bold">₹{(totalExpenses / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7E5E4] mb-6">
        {(['invoices', 'payments', 'expenses'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition capitalize ${
              activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white border border-[#E7E5E4] text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="sent">Sent</option>
              <option value="overdue">Overdue</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredInvoices.map((inv) => {
              const client = getClient(inv.clientId);
              return (
                <div key={inv.id} className={`${cardClass} p-5 hover:shadow-md transition`} style={cardStyle}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF8F2' }}>
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{inv.number}</h3>
                          {getStatusBadge(inv.status)}
                        </div>
                        <p className="text-sm" style={{ color: '#78716C' }}>{client?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{inv.currency === 'USD' ? '$' : '₹'}{inv.amount.toLocaleString()}</p>
                        {inv.gst > 0 && <p className="text-xs" style={{ color: '#78716C' }}>+{inv.gst}% GST</p>}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-lg hover:bg-stone-50 transition" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-stone-50 transition" title="Send">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[#E7E5E4]">
                    <span className="text-xs" style={{ color: '#78716C' }}>Issued: {inv.issuedDate}</span>
                    <span className="text-xs" style={{ color: '#78716C' }}>Due: {inv.dueDate}</span>
                    {inv.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FAFAF8', color: '#78716C' }}>
                        {inv.type === 'intra-state' ? 'CGST+SGST' : 'IGST'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-3">
          {store.payments.map((pay: any) => {
            const client = getClient(pay.clientId);
            return (
              <div key={pay.id} className={`${cardClass} p-5`} style={cardStyle}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{client?.name}</h3>
                      <p className="text-sm" style={{ color: '#78716C' }}>{pay.method} · {pay.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-500">{pay.currency === 'USD' ? '$' : '₹'}{pay.amount.toLocaleString()}</p>
                    <p className="text-xs" style={{ color: '#78716C' }}>{pay.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-3">
          {store.expenses.map((exp: any) => (
            <div key={exp.id} className={`${cardClass} p-5`} style={cardStyle}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.description}</h3>
                    <p className="text-sm" style={{ color: '#78716C' }}>{exp.category} · {exp.date}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-500">₹{exp.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Invoice Modal */}
      {showNewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNewInvoice(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Invoice</h3>
              <button onClick={() => setShowNewInvoice(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <select
                  value={newInvoice.clientId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                  placeholder="100000"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    value={newInvoice.currency}
                    onChange={(e) => setNewInvoice({ ...newInvoice, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GST %</label>
                  <input
                    type="number"
                    value={newInvoice.gst}
                    onChange={(e) => setNewInvoice({ ...newInvoice, gst: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tax Type</label>
                <select
                  value={newInvoice.type}
                  onChange={(e) => setNewInvoice({ ...newInvoice, type: e.target.value as 'intra-state' | 'inter-state' })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  <option value="intra-state">Intra-state (CGST + SGST)</option>
                  <option value="inter-state">Inter-state (IGST)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewInvoice(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button 
                onClick={handleCreateInvoice} 
                disabled={!newInvoice.amount} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showRecordPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowRecordPayment(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Record Payment</h3>
              <button onClick={() => setShowRecordPayment(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Invoice</label>
                <select
                  value={newPayment.invoiceId}
                  onChange={(e) => setNewPayment({ ...newPayment, invoiceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  <option value="">Select invoice</option>
                  {store.invoices.filter((i: any) => i.status !== 'paid').map((inv: any) => (
                    <option key={inv.id} value={inv.id}>{inv.number} - ₹{inv.amount.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount *</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                  placeholder="100000"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reference/Transaction ID</label>
                <input
                  type="text"
                  value={newPayment.reference}
                  onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
                  placeholder="UTR123456789"
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowRecordPayment(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4' }}>
                Cancel
              </button>
              <button 
                onClick={handleRecordPayment} 
                disabled={!newPayment.amount || !newPayment.invoiceId} 
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
