import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  leads as initialLeads, clients as initialClients, projects as initialProjects,
  invoices as initialInvoices, payments as initialPayments, tasks as initialTasks,
  messages as initialMessages, meetings as initialMeetings, documents as initialDocuments,
  teamMembers as initialTeam, notifications as initialNotifications, expenses as initialExpenses,
  retainers as initialRetainers, reviews as initialReviews
} from '../data/mockData';

type Lead = typeof initialLeads[0];
type Client = typeof initialClients[0];
type Project = typeof initialProjects[0];
type Invoice = typeof initialInvoices[0];
type Payment = typeof initialPayments[0];
type Task = typeof initialTasks[0];
type Message = typeof initialMessages[0];
type Meeting = typeof initialMeetings[0];
type Document = typeof initialDocuments[0];
type Notification = typeof initialNotifications[0];

interface Store {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  invoices: Invoice[];
  payments: Payment[];
  tasks: Task[];
  messages: Message[];
  meetings: Meeting[];
  documents: Document[];
  notifications: Notification[];
  retainers: typeof initialRetainers;
  expenses: typeof initialExpenses;
  reviews: typeof initialReviews;
  
  // Actions
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadToStage: (id: string, stage: string) => void;
  convertLeadToClient: (id: string) => void;
  
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  
  addMessage: (msg: Omit<Message, 'id'>) => void;
  markMessageRead: (id: string) => void;
  
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  addDocument: (doc: Omit<Document, 'id'>) => void;
  
  addNotification: (n: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const StoreContext = createContext<Store | null>(null);

let idCounter = 1000;
const genId = (prefix: string) => `${prefix}_${++idCounter}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [retainers] = useState(initialRetainers);
  const [expenses] = useState(initialExpenses);
  const [reviews] = useState(initialReviews);

  const addLead = (lead: Omit<Lead, 'id'>) => {
    setLeads(prev => [...prev, { ...lead, id: genId('l') } as unknown as Lead]);
  };
  
  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } as Lead : l));
  };
  
  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };
  
  const moveLeadToStage = (id: string, stage: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } as Lead : l));
  };
  
  const convertLeadToClient = (id: string) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    
    const newClient: Client = {
      id: genId('c'),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      address: '',
      gstin: '',
      currency: lead.currency,
      currencySymbol: lead.currency === 'USD' ? '$' : '₹',
      owner: lead.assignedTo,
      portalEnabled: false,
      totalProjects: 0,
      totalInvoiced: 0,
      totalPaid: 0,
      outstanding: 0,
      since: new Date().toISOString().split('T')[0],
    };
    
    setClients(prev => [...prev, newClient]);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: 's5', wonDate: new Date().toISOString().split('T')[0] } as Lead : l));
  };
  
  const addClient = (client: Omit<Client, 'id'>) => {
    setClients(prev => [...prev, { ...client, id: genId('c') } as Client]);
  };
  
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  
  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...project, id: genId('p') } as Project]);
  };
  
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    setInvoices(prev => [...prev, { ...invoice, id: genId('inv') } as Invoice]);
  };
  
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    setPayments(prev => [...prev, { ...payment, id: genId('pay') } as Payment]);
  };
  
  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: genId('t') } as Task]);
  };
  
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  
  const addMessage = (msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: genId('msg') } as Message]);
  };
  
  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };
  
  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    setMeetings(prev => [...prev, { ...meeting, id: genId('m') } as Meeting]);
  };
  
  const addDocument = (doc: Omit<Document, 'id'>) => {
    setDocuments(prev => [...prev, { ...doc, id: genId('d') } as Document]);
  };
  
  const addNotification = (n: Omit<Notification, 'id'>) => {
    setNotifications(prev => [{ ...n, id: genId('n') } as Notification, ...prev]);
  };
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <StoreContext.Provider value={{
      leads, clients, projects, invoices, payments, tasks, messages, meetings, documents, notifications, retainers, expenses, reviews,
      addLead, updateLead, deleteLead, moveLeadToStage, convertLeadToClient,
      addClient, updateClient, addProject, updateProject,
      addInvoice, addPayment, addTask, updateTask,
      addMessage, markMessageRead, addMeeting, addDocument,
      addNotification, markNotificationRead, markAllNotificationsRead,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
