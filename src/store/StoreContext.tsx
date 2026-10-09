import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { teamMembers, pipelineStages, revenueData, revenueByType, leadsBySource, plans } from '../data/mockData';

interface Store {
  // Current user & workspace
  currentUser: any;
  currentWorkspace: any;
  loading: boolean;
  
  // Data
  leads: any[];
  clients: any[];
  projects: any[];
  invoices: any[];
  payments: any[];
  tasks: any[];
  messages: any[];
  meetings: any[];
  documents: any[];
  notifications: any[];
  expenses: any[];
  retainers: any[];
  reviews: any[];
  
  // Static data
  teamMembers: any[];
  pipelineStages: any[];
  revenueData: any[];
  revenueByType: any[];
  leadsBySource: any[];
  plans: any;
  
  // Lead actions
  addLead: (lead: any) => Promise<void>;
  updateLead: (id: string, updates: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  moveLeadToStage: (id: string, stage: string) => Promise<void>;
  convertLeadToClient: (id: string) => Promise<void>;
  
  // Client actions
  addClient: (client: any) => Promise<void>;
  updateClient: (id: string, updates: any) => Promise<void>;
  
  // Project actions
  addProject: (project: any) => Promise<void>;
  updateProject: (id: string, updates: any) => Promise<void>;
  
  // Invoice actions
  addInvoice: (invoice: any) => Promise<void>;
  
  // Retainer actions
  addRetainer: (retainer: any) => Promise<void>;
  updateRetainer: (id: string, updates: any) => Promise<void>;
  deleteRetainer: (id: string) => Promise<void>;
  
  // Payment actions
  addPayment: (payment: any) => Promise<void>;
  
  // Task actions
  addTask: (task: any) => Promise<void>;
  updateTask: (id: string, updates: any) => Promise<void>;
  
  // Message actions
  addMessage: (msg: any) => Promise<void>;
  
  // Meeting actions
  addMeeting: (meeting: any) => Promise<void>;
  
  // Document actions
  addDocument: (doc: any) => Promise<void>;
  
  // Notification actions
  addNotification: (n: any) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  
  // Auth actions
  logout: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  updateWorkspace: (updates: any) => Promise<void>;
  
  // Refresh data from storage
  refresh: () => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [leads, setLeads] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [retainers, setRetainers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Load user, workspace, and data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await auth.getCurrentUser();
        const workspace = await auth.getCurrentWorkspace();
        
        setCurrentUser(user);
        setCurrentWorkspace(workspace);
        
        if (workspace) {
          const data = await storage.getData(workspace.id);
          setLeads(data.leads);
          setClients(data.clients);
          setProjects(data.projects);
          setInvoices(data.invoices);
          setPayments(data.payments);
          setTasks(data.tasks);
          setMessages(data.messages);
          setMeetings(data.meetings);
          setDocuments(data.documents);
          setNotifications(data.notifications);
          setExpenses(data.expenses);
          setRetainers(data.retainers);
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const getWorkspaceId = useCallback(() => {
    return currentWorkspace?.id || '';
  }, [currentWorkspace]);
  
  // Refresh data from storage
  const refresh = useCallback(async () => {
    const user = await auth.getCurrentUser();
    const workspace = await auth.getCurrentWorkspace();
    
    setCurrentUser(user);
    setCurrentWorkspace(workspace);
    
    if (workspace) {
      const data = await storage.getData(workspace.id);
      setLeads(data.leads);
      setClients(data.clients);
      setProjects(data.projects);
      setInvoices(data.invoices);
      setPayments(data.payments);
      setTasks(data.tasks);
      setMessages(data.messages);
      setMeetings(data.meetings);
      setDocuments(data.documents);
      setNotifications(data.notifications);
      setExpenses(data.expenses);
      setRetainers(data.retainers);
      setReviews(data.reviews);
    }
  }, []);
  
  // ID generator
  const genId = (prefix: string) => storage.genId(prefix);
  
  // Lead actions
  const addLead = async (lead: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newLead = { ...lead, id: genId('l'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'leads', newLead);
    setLeads(prev => [...prev, newLead]);
  };
  
  const updateLead = async (id: string, updates: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'leads', id, updates);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };
  
  const deleteLead = async (id: string) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.deleteItem(workspaceId, 'leads', id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };
  
  const moveLeadToStage = async (id: string, stage: string) => {
    await updateLead(id, { stage });
  };
  
  const convertLeadToClient = async (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newClient = {
      id: genId('c'),
      workspace_id: workspaceId,
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: '',
      gstin: '',
      currency: lead.currency,
      currency_symbol: lead.currency === 'USD' ? '$' : '₹',
      owner_id: lead.assigned_to,
      portal_enabled: false,
      total_projects: 0,
      total_invoiced: 0,
      total_paid: 0,
      outstanding: 0,
      since: new Date().toISOString().split('T')[0]
    };
    
    await storage.addItem(workspaceId, 'clients', newClient);
    setClients(prev => [...prev, newClient]);
    await updateLead(id, { stage: 's5', won_date: new Date().toISOString().split('T')[0] });
  };
  
  // Client actions
  const addClient = async (client: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add client: no workspace ID');
      return;
    }
    
    console.log('Adding client to workspace:', workspaceId, client);
    const newClient = { ...client, id: genId('c'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'clients', newClient);
    console.log('Client added to state');
    setClients(prev => [...prev, newClient]);
  };
  
  const updateClient = async (id: string, updates: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'clients', id, updates);
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  
  // Project actions
  const addProject = async (project: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newProject = { ...project, id: genId('p'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'projects', newProject);
    setProjects(prev => [...prev, newProject]);
  };
  
  const updateProject = async (id: string, updates: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'projects', id, updates);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  
  // Invoice actions
  const addInvoice = async (invoice: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newInvoice = { ...invoice, id: genId('inv'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'invoices', newInvoice);
    setInvoices(prev => [...prev, newInvoice]);
  };
  
  // Retainer actions
  const addRetainer = async (retainer: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newRetainer = { ...retainer, id: genId('ret'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'retainers', newRetainer);
    setRetainers(prev => [...prev, newRetainer]);
  };
  
  const updateRetainer = async (id: string, updates: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'retainers', id, updates);
    setRetainers(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };
  
  const deleteRetainer = async (id: string) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.deleteItem(workspaceId, 'retainers', id);
    setRetainers(prev => prev.filter(r => r.id !== id));
  };
  
  // Payment actions
  const addPayment = async (payment: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newPayment = { ...payment, id: genId('pay'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'payments', newPayment);
    setPayments(prev => [...prev, newPayment]);
  };
  
  // Task actions
  const addTask = async (task: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newTask = { ...task, id: genId('t'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'tasks', newTask);
    setTasks(prev => [...prev, newTask]);
  };
  
  const updateTask = async (id: string, updates: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'tasks', id, updates);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  
  // Message actions
  const addMessage = async (msg: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newMsg = { ...msg, id: genId('msg'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'messages', newMsg);
    setMessages(prev => [...prev, newMsg]);
  };
  
  // Meeting actions
  const addMeeting = async (meeting: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add meeting: no workspace ID');
      return;
    }
    
    console.log('Adding meeting to workspace:', workspaceId, meeting);
    const newMeeting = { ...meeting, id: genId('m'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'meetings', newMeeting);
    console.log('Meeting added to state');
    setMeetings(prev => [...prev, newMeeting]);
  };
  
  // Document actions
  const addDocument = async (doc: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newDoc = { ...doc, id: genId('d'), workspace_id: workspaceId };
    await storage.addItem(workspaceId, 'documents', newDoc);
    setDocuments(prev => [...prev, newDoc]);
  };
  
  // Notification actions
  const addNotification = async (n: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    const newN = { ...n, id: genId('n'), workspace_id: workspaceId, time: n.time || 'Just now' };
    await storage.addItem(workspaceId, 'notifications', newN);
    setNotifications(prev => [newN, ...prev]);
  };
  
  const markNotificationRead = async (id: string) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    await storage.updateItem(workspaceId, 'notifications', id, { read: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsRead = async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) return;
    
    for (const n of notifications) {
      if (!n.read) {
        await storage.updateItem(workspaceId, 'notifications', n.id, { read: true });
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  // Auth actions
  const logout = async () => {
    await auth.logout();
    setCurrentUser(null);
    setCurrentWorkspace(null);
    setLeads([]);
    setClients([]);
    setProjects([]);
    setInvoices([]);
    setPayments([]);
    setTasks([]);
    setMessages([]);
    setMeetings([]);
    setDocuments([]);
    setNotifications([]);
    setExpenses([]);
    setRetainers([]);
    setReviews([]);
  };
  
  const updateProfile = async (updates: any) => {
    if (!currentUser) {
      console.error('Cannot update profile: no current user');
      return;
    }
    try {
      console.log('Updating profile in store:', updates);
      await auth.updateProfile(currentUser.id, updates);
      const user = await auth.getCurrentUser();
      console.log('Profile updated, new user:', user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };
  
  const updateWorkspace = async (updates: any) => {
    if (!currentWorkspace) {
      console.error('Cannot update workspace: no current workspace');
      return;
    }
    try {
      console.log('Updating workspace in store:', updates);
      await auth.updateWorkspace(currentWorkspace.id, updates);
      const workspace = await auth.getCurrentWorkspace();
      console.log('Workspace updated, new workspace:', workspace);
      setCurrentWorkspace(workspace);
    } catch (error) {
      console.error('Error in updateWorkspace:', error);
      throw error;
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const store: Store = {
    currentUser,
    currentWorkspace,
    loading,
    leads,
    clients,
    projects,
    invoices,
    payments,
    tasks,
    messages,
    meetings,
    documents,
    notifications,
    expenses,
    retainers,
    reviews,
    teamMembers,
    pipelineStages,
    revenueData,
    revenueByType,
    leadsBySource,
    plans,
    addLead,
    updateLead,
    deleteLead,
    moveLeadToStage,
    convertLeadToClient,
    addClient,
    updateClient,
    addProject,
    updateProject,
    addInvoice,
    addRetainer,
    updateRetainer,
    deleteRetainer,
    addPayment,
    addTask,
    updateTask,
    addMessage,
    addMeeting,
    addDocument,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
    updateProfile,
    updateWorkspace,
    refresh,
  };
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
