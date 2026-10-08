import { useState } from 'react';
import { useApp } from '../App';
import { invoices, clients, payments, expenses } from '../data/mockData';
import { Plus, Download, Send, FileText, CheckCircle2, TrendingDown } from 'lucide-react';

export default function Invoices() {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'expenses'>('invoices');
  const [statusFilter, setStatusFilter] = useState('all');

  const getClient = (id: string) => clients.find(c => c.id === id);

  const filteredInvoices = invoices.filter(inv => statusFilter === 'all' || inv.status === statusFilter);

  const totalInvoiced = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      overdue: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      partially_paid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      draft: 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400',
    };
    const labels: Record<string, string> = {
      paid: 'Paid', sent: 'Sent', overdue: 'Overdue', partially_paid: 'Partial', draft: 'Draft'
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.draft}`}>{labels[status] || status}</span>;
  };

  const cardClass = `rounded-xl border ${darkMode ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Payments & Invoices</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage invoices, track payments, and monitor expenses</p>
        </div>
        <div className="flex gap-2">
          <button className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${darkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
            <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Record Payment</span>
          </button>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${cardClass} p-4 border-l-4 border-l-blue-500`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Total Invoiced</p>
          <p className="text-xl font-bold">₹{(totalInvoiced / 100000).toFixed(1)}L</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-green-500`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Collected</p>
          <p className="text-xl font-bold text-green-500">₹{(totalPaid / 100000).toFixed(1)}L</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-red-500`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Overdue</p>
          <p className="text-xl font-bold text-red-500">₹{(totalOverdue / 1000).toFixed(0)}K</p>
        </div>
        <div className={`${cardClass} p-4 border-l-4 border-l-purple-500`}>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Expenses</p>
          <p className="text-xl font-bold">₹{(totalExpenses / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b mb-6 ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        {(['invoices', 'payments', 'expenses'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition capitalize ${
              activeTab === tab ? 'border-orange-600 text-orange-600' : `border-transparent ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
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
              className={`px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} border`}
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
                <div key={inv.id} className={`${cardClass} p-5 hover:shadow-md transition`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{inv.number}</h3>
                          {getStatusBadge(inv.status)}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{client?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{inv.currency === 'USD' ? '$' : '₹'}{inv.amount.toLocaleString()}</p>
                        {inv.gst > 0 && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>+{inv.gst}% GST</p>}
                      </div>
                      <div className="flex gap-1">
                        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`} title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition`} title="Send">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`flex flex-wrap items-center gap-4 mt-3 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Issued: {inv.issuedDate}</span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Due: {inv.dueDate}</span>
                    {inv.type && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
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
          {payments.map((pay) => {
            const client = getClient(pay.clientId);
            return (
              <div key={pay.id} className={`${cardClass} p-5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{client?.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{pay.method} · {pay.reference}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-500">{pay.currency === 'USD' ? '$' : '₹'}{pay.amount.toLocaleString()}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{pay.date}</p>
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
          {expenses.map((exp) => (
            <div key={exp.id} className={`${cardClass} p-5`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.description}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{exp.category} · {exp.date}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-500">₹{exp.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
