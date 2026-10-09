import { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { clients } from '../data/mockData';
import { Plus, Repeat, Calendar, DollarSign, X, Edit2, Trash2, Pause, Play } from 'lucide-react';

export default function Retainers() {
  const store = useStore();
  const [showAddRetainer, setShowAddRetainer] = useState(false);
  const [editingRetainer, setEditingRetainer] = useState<any>(null);
  const [newRetainer, setNewRetainer] = useState({
    clientId: 'c1',
    amount: 0,
    currency: 'INR',
    billingDay: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    scope: '',
    status: 'active' as 'active' | 'paused' | 'ended',
  });

  const activeRetainers = store.retainers.filter((r: any) => r.status === 'active');
  const pausedRetainers = store.retainers.filter((r: any) => r.status === 'paused');
  const endedRetainers = store.retainers.filter((r: any) => r.status === 'ended');
  
  const mrr = activeRetainers.reduce((sum: number, r: any) => {
    const amount = r.currency === 'USD' ? r.amount * 83 : r.amount;
    return sum + amount;
  }, 0);

  const getClient = (id: string) => clients.find(c => c.id === id);

  const handleAddRetainer = () => {
    if (!newRetainer.amount || !newRetainer.scope) return;
    
    const retainerData = {
      ...newRetainer,
      id: `ret_${Date.now()}`,
      amount: Number(newRetainer.amount),
    };

    store.addRetainer(retainerData);
    store.addNotification({
      type: 'payment',
      title: 'New retainer created',
      message: `${getClient(newRetainer.clientId)?.name} - ₹${newRetainer.amount.toLocaleString()}/mo`,
      time: 'Just now',
      read: false,
    });

    setNewRetainer({
      clientId: 'c1',
      amount: 0,
      currency: 'INR',
      billingDay: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      scope: '',
      status: 'active',
    });
    setShowAddRetainer(false);
  };

  const handleUpdateRetainer = () => {
    if (!editingRetainer) return;
    
    store.updateRetainer(editingRetainer.id, editingRetainer);
    store.addNotification({
      type: 'payment',
      title: 'Retainer updated',
      message: `${getClient(editingRetainer.clientId)?.name}`,
      time: 'Just now',
      read: false,
    });

    setEditingRetainer(null);
  };

  const handleStatusChange = (id: string, status: 'active' | 'paused' | 'ended') => {
    store.updateRetainer(id, { status });
    store.addNotification({
      type: 'payment',
      title: `Retainer ${status}`,
      message: status === 'active' ? 'Retainer activated' : status === 'paused' ? 'Retainer paused' : 'Retainer ended',
      time: 'Just now',
      read: false,
    });
  };

  const handleDeleteRetainer = (id: string) => {
    if (confirm('Are you sure you want to delete this retainer?')) {
      store.deleteRetainer(id);
      store.addNotification({
        type: 'payment',
        title: 'Retainer deleted',
        message: 'Retainer has been removed',
        time: 'Just now',
        read: false,
      });
    }
  };

  const RetainerCard = ({ retainer }: { retainer: any }) => {
    const client = getClient(retainer.clientId);
    return (
      <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #E7E5E4' }}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFF8F2' }}>
              <Repeat className="w-6 h-6" style={{ color: '#ea580c' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: '#1C1917' }}>{client?.name}</h3>
              <p className="text-sm" style={{ color: '#78716C' }}>{retainer.scope}</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{
            backgroundColor: retainer.status === 'active' ? '#f0fdf4' : retainer.status === 'paused' ? '#fffbeb' : '#FAFAF8',
            color: retainer.status === 'active' ? '#166534' : retainer.status === 'paused' ? '#92400e' : '#78716C'
          }}>
            {retainer.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
            <p className="text-xs" style={{ color: '#78716C' }}>Monthly Amount</p>
            <p className="text-lg font-bold" style={{ color: '#1C1917' }}>
              {retainer.currency === 'USD' ? '$' : '₹'}{retainer.amount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FAFAF8' }}>
            <p className="text-xs" style={{ color: '#78716C' }}>Billing Day</p>
            <p className="text-lg font-bold" style={{ color: '#1C1917' }}>{retainer.billingDay}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: '#78716C' }}>
          <Calendar className="w-3 h-3" />
          <span>{retainer.startDate} to {retainer.endDate || 'Ongoing'}</span>
        </div>

        <div className="flex gap-2">
          {retainer.status === 'active' && (
            <button
              onClick={() => handleStatusChange(retainer.id, 'paused')}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-stone-50"
              style={{ border: '1px solid #E7E5E4', color: '#78716C' }}
            >
              <Pause className="w-3 h-3 inline mr-1" /> Pause
            </button>
          )}
          {retainer.status === 'paused' && (
            <button
              onClick={() => handleStatusChange(retainer.id, 'active')}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-stone-50"
              style={{ border: '1px solid #E7E5E4', color: '#78716C' }}
            >
              <Play className="w-3 h-3 inline mr-1" /> Resume
            </button>
          )}
          {retainer.status !== 'ended' && (
            <>
              <button
                onClick={() => setEditingRetainer(retainer)}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-stone-50"
                style={{ border: '1px solid #E7E5E4', color: '#78716C' }}
              >
                <Edit2 className="w-3 h-3 inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleStatusChange(retainer.id, 'ended')}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-stone-50"
                style={{ border: '1px solid #E7E5E4', color: '#78716C' }}
              >
                End
              </button>
            </>
          )}
          <button
            onClick={() => handleDeleteRetainer(retainer.id)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition hover:bg-red-50"
            style={{ border: '1px solid #fecaca', color: '#dc2626' }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto animate-fade-in" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1C1917' }}>Retainers</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>
            {activeRetainers.length} active · MRR: ₹{(mrr / 1000).toFixed(0)}K/mo
          </p>
        </div>
        <button onClick={() => setShowAddRetainer(true)} className="btn-primary text-sm flex items-center gap-2 !py-2">
          <Plus className="w-4 h-4" /> New Retainer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E7E5E4' }}>
          <p className="text-xs" style={{ color: '#78716C' }}>Active Retainers</p>
          <p className="text-xl font-bold" style={{ color: '#1C1917' }}>{activeRetainers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E7E5E4' }}>
          <p className="text-xs" style={{ color: '#78716C' }}>Monthly Recurring Revenue</p>
          <p className="text-xl font-bold" style={{ color: '#16a34a' }}>₹{(mrr / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E7E5E4' }}>
          <p className="text-xs" style={{ color: '#78716C' }}>Paused</p>
          <p className="text-xl font-bold" style={{ color: '#d97706' }}>{pausedRetainers.length}</p>
        </div>
      </div>

      {/* Active Retainers */}
      {activeRetainers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1C1917' }}>Active Retainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRetainers.map((retainer: any) => (
              <RetainerCard key={retainer.id} retainer={retainer} />
            ))}
          </div>
        </div>
      )}

      {/* Paused Retainers */}
      {pausedRetainers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1C1917' }}>Paused Retainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pausedRetainers.map((retainer: any) => (
              <RetainerCard key={retainer.id} retainer={retainer} />
            ))}
          </div>
        </div>
      )}

      {/* Ended Retainers */}
      {endedRetainers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1C1917' }}>Ended Retainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {endedRetainers.map((retainer: any) => (
              <RetainerCard key={retainer.id} retainer={retainer} />
            ))}
          </div>
        </div>
      )}

      {store.retainers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center" style={{ border: '1px solid #E7E5E4' }}>
          <Repeat className="w-12 h-12 mx-auto mb-4" style={{ color: '#A8A29E' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1917' }}>No retainers yet</h3>
          <p className="text-sm mb-4" style={{ color: '#78716C' }}>
            Create your first retainer to start tracking recurring revenue
          </p>
          <button onClick={() => setShowAddRetainer(true)} className="btn-primary text-sm">
            Create Retainer
          </button>
        </div>
      )}

      {/* Add Retainer Modal */}
      {showAddRetainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddRetainer(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1C1917' }}>Create New Retainer</h3>
              <button onClick={() => setShowAddRetainer(false)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Client *</label>
                <select
                  value={newRetainer.clientId}
                  onChange={(e) => setNewRetainer({ ...newRetainer, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Amount *</label>
                  <input
                    type="number"
                    value={newRetainer.amount}
                    onChange={(e) => setNewRetainer({ ...newRetainer, amount: Number(e.target.value) })}
                    placeholder="45000"
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Currency</label>
                  <select
                    value={newRetainer.currency}
                    onChange={(e) => setNewRetainer({ ...newRetainer, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Billing Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={newRetainer.billingDay}
                  onChange={(e) => setNewRetainer({ ...newRetainer, billingDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Start Date</label>
                  <input
                    type="date"
                    value={newRetainer.startDate}
                    onChange={(e) => setNewRetainer({ ...newRetainer, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>End Date</label>
                  <input
                    type="date"
                    value={newRetainer.endDate}
                    onChange={(e) => setNewRetainer({ ...newRetainer, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Scope *</label>
                <textarea
                  value={newRetainer.scope}
                  onChange={(e) => setNewRetainer({ ...newRetainer, scope: e.target.value })}
                  placeholder="Monthly website maintenance, bug fixes, minor updates"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddRetainer(false)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}>
                Cancel
              </button>
              <button
                onClick={handleAddRetainer}
                disabled={!newRetainer.amount || !newRetainer.scope}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Retainer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Retainer Modal */}
      {editingRetainer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingRetainer(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1C1917' }}>Edit Retainer</h3>
              <button onClick={() => setEditingRetainer(null)} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Amount</label>
                <input
                  type="number"
                  value={editingRetainer.amount}
                  onChange={(e) => setEditingRetainer({ ...editingRetainer, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Billing Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={editingRetainer.billingDay}
                  onChange={(e) => setEditingRetainer({ ...editingRetainer, billingDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Start Date</label>
                  <input
                    type="date"
                    value={editingRetainer.startDate}
                    onChange={(e) => setEditingRetainer({ ...editingRetainer, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>End Date</label>
                  <input
                    type="date"
                    value={editingRetainer.endDate}
                    onChange={(e) => setEditingRetainer({ ...editingRetainer, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C1917' }}>Scope</label>
                <textarea
                  value={editingRetainer.scope}
                  onChange={(e) => setEditingRetainer({ ...editingRetainer, scope: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingRetainer(null)} className="flex-1 px-4 py-2 rounded-lg hover:bg-stone-50" style={{ border: '1px solid #E7E5E4', color: '#1C1917' }}>
                Cancel
              </button>
              <button
                onClick={handleUpdateRetainer}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Update Retainer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
