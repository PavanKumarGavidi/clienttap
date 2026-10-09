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
    if (!workspaceId) {
      console.error('Cannot add lead: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding lead with workspace ID:', workspaceId);
    const newLead = { ...lead, id: genId('l'), workspace_id: workspaceId };
    console.log('New lead data:', newLead);
    
    try {
      await storage.addItem(workspaceId, 'leads', newLead);
      console.log('Lead added to Supabase successfully');
      
      // Refresh data from Supabase to ensure consistency
      const data = await storage.getData(workspaceId);
      setLeads(data.leads);
      console.log('Leads refreshed from Supabase:', data.leads.length, 'leads');
    } catch (error) {
      console.error('Error in addLead:', error);
      throw error;
    }
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
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding client with workspace ID:', workspaceId);
    const newClient = { ...client, id: genId('c'), workspace_id: workspaceId };
    console.log('New client data:', newClient);
    
    try {
      await storage.addItem(workspaceId, 'clients', newClient);
      console.log('Client added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setClients(data.clients);
      console.log('Clients refreshed from Supabase:', data.clients.length, 'clients');
    } catch (error) {
      console.error('Error in addClient:', error);
      throw error;
    }
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
    if (!workspaceId) {
      console.error('Cannot add project: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding project with workspace ID:', workspaceId);
    const newProject = { ...project, id: genId('p'), workspace_id: workspaceId };
    console.log('New project data:', newProject);
    
    try {
      await storage.addItem(workspaceId, 'projects', newProject);
      console.log('Project added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setProjects(data.projects);
      console.log('Projects refreshed from Supabase:', data.projects.length, 'projects');
    } catch (error) {
      console.error('Error in addProject:', error);
      throw error;
    }
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
    if (!workspaceId) {
      console.error('Cannot add invoice: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding invoice with workspace ID:', workspaceId);
    const newInvoice = { ...invoice, id: genId('inv'), workspace_id: workspaceId };
    console.log('New invoice data:', newInvoice);
    
    try {
      await storage.addItem(workspaceId, 'invoices', newInvoice);
      console.log('Invoice added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setInvoices(data.invoices);
      console.log('Invoices refreshed from Supabase:', data.invoices.length, 'invoices');
    } catch (error) {
      console.error('Error in addInvoice:', error);
      throw error;
    }
  };
  
  // Retainer actions
  const addRetainer = async (retainer: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add retainer: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding retainer with workspace ID:', workspaceId);
    const newRetainer = { ...retainer, id: genId('ret'), workspace_id: workspaceId };
    console.log('New retainer data:', newRetainer);
    
    try {
      await storage.addItem(workspaceId, 'retainers', newRetainer);
      console.log('Retainer added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setRetainers(data.retainers);
      console.log('Retainers refreshed from Supabase:', data.retainers.length, 'retainers');
    } catch (error) {
      console.error('Error in addRetainer:', error);
      throw error;
    }
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
    if (!workspaceId) {
      console.error('Cannot add payment: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding payment with workspace ID:', workspaceId);
    const newPayment = { ...payment, id: genId('pay'), workspace_id: workspaceId };
    console.log('New payment data:', newPayment);
    
    try {
      await storage.addItem(workspaceId, 'payments', newPayment);
      console.log('Payment added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setPayments(data.payments);
      console.log('Payments refreshed from Supabase:', data.payments.length, 'payments');
    } catch (error) {
      console.error('Error in addPayment:', error);
      throw error;
    }
  };
  
  // Task actions
  const addTask = async (task: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add task: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding task with workspace ID:', workspaceId);
    const newTask = { ...task, id: genId('t'), workspace_id: workspaceId };
    console.log('New task data:', newTask);
    
    try {
      await storage.addItem(workspaceId, 'tasks', newTask);
      console.log('Task added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setTasks(data.tasks);
      console.log('Tasks refreshed from Supabase:', data.tasks.length, 'tasks');
    } catch (error) {
      console.error('Error in addTask:', error);
      throw error;
    }
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
    if (!workspaceId) {
      console.error('Cannot add message: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding message with workspace ID:', workspaceId);
    const newMsg = { ...msg, id: genId('msg'), workspace_id: workspaceId };
    console.log('New message data:', newMsg);
    
    try {
      await storage.addItem(workspaceId, 'messages', newMsg);
      console.log('Message added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setMessages(data.messages);
      console.log('Messages refreshed from Supabase:', data.messages.length, 'messages');
    } catch (error) {
      console.error('Error in addMessage:', error);
      throw error;
    }
  };
  
  // Meeting actions
  const addMeeting = async (meeting: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add meeting: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding meeting with workspace ID:', workspaceId);
    const newMeeting = { ...meeting, id: genId('m'), workspace_id: workspaceId };
    console.log('New meeting data:', newMeeting);
    
    try {
      await storage.addItem(workspaceId, 'meetings', newMeeting);
      console.log('Meeting added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setMeetings(data.meetings);
      console.log('Meetings refreshed from Supabase:', data.meetings.length, 'meetings');
    } catch (error) {
      console.error('Error in addMeeting:', error);
      throw error;
    }
  };
  
  // Document actions
  const addDocument = async (doc: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add document: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding document with workspace ID:', workspaceId);
    const newDoc = { ...doc, id: genId('d'), workspace_id: workspaceId };
    console.log('New document data:', newDoc);
    
    try {
      await storage.addItem(workspaceId, 'documents', newDoc);
      console.log('Document added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setDocuments(data.documents);
      console.log('Documents refreshed from Supabase:', data.documents.length, 'documents');
    } catch (error) {
      console.error('Error in addDocument:', error);
      throw error;
    }
  };
  
  // Notification actions
  const addNotification = async (n: any) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      console.error('Cannot add notification: no workspace ID');
      throw new Error('No workspace ID available');
    }
    
    console.log('Adding notification with workspace ID:', workspaceId);
    const newN = { ...n, id: genId('n'), workspace_id: workspaceId, time: n.time || 'Just now' };
    console.log('New notification data:', newN);
    
    try {
      await storage.addItem(workspaceId, 'notifications', newN);
      console.log('Notification added to Supabase successfully');
      
      // Refresh data from Supabase
      const data = await storage.getData(workspaceId);
      setNotifications(data.notifications);
      console.log('Notifications refreshed from Supabase:', data.notifications.length, 'notifications');
    } catch (error) {
      console.error('Error in addNotification:', error);
      throw error;
    }
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
