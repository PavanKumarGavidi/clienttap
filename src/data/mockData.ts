// Clienttap Mock Data - Demo Workspace

export const workspace = {
  id: 'ws_001',
  name: 'Pixel & Code Studio',
  slug: 'pixelcode',
  logo: '🎨',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  gstin: '29ABCDE1234F1Z5',
  plan: 'pro' as const,
  owner: 'Arjun Mehta',
};

export const currentUser = {
  id: 'u_001',
  name: 'Arjun Mehta',
  email: 'arjun@pixelcode.studio',
  avatar: '👨‍💻',
  role: 'owner' as const,
};

export const teamMembers = [
  { id: 'u_001', name: 'Arjun Mehta', email: 'arjun@pixelcode.studio', avatar: '👨‍💻', role: 'owner', title: 'Founder & Lead Developer' },
  { id: 'u_002', name: 'Priya Sharma', email: 'priya@pixelcode.studio', avatar: '👩‍🎨', role: 'member', title: 'Senior Designer' },
  { id: 'u_003', name: 'Rahul Kumar', email: 'rahul@pixelcode.studio', avatar: '👨‍💼', role: 'member', title: 'Project Manager' },
  { id: 'u_004', name: 'Sneha Patel', email: 'sneha@pixelcode.studio', avatar: '👩‍💻', role: 'member', title: 'Frontend Developer' },
  { id: 'u_005', name: 'Vikram Singh', email: 'vikram@pixelcode.studio', avatar: '🧑‍💻', role: 'member', title: 'Backend Developer' },
];

export const pipelineStages = [
  { id: 's1', name: 'New', color: '#3b82f6', order: 0 },
  { id: 's2', name: 'Contacted', color: '#8b5cf6', order: 1 },
  { id: 's3', name: 'Qualified', color: '#f59e0b', order: 2 },
  { id: 's4', name: 'Proposal Sent', color: '#ea580c', order: 3 },
  { id: 's5', name: 'Won', color: '#22c55e', order: 4 },
  { id: 's6', name: 'Lost', color: '#ef4444', order: 5 },
];

export const leads = [
  { id: 'l1', name: 'Ananya Gupta', company: 'Bloom Botanics', email: 'ananya@bloombotanics.in', phone: '+91 98765 43210', value: 250000, currency: 'INR', stage: 's1', source: 'Instagram', assignedTo: 'u_001', createdAt: '2025-01-10', followUp: true },
  { id: 'l2', name: 'David Chen', company: 'TechFlow Inc', email: 'david@techflow.com', phone: '+1 415 555 0123', value: 8500, currency: 'USD', stage: 's2', source: 'Website', assignedTo: 'u_003', createdAt: '2025-01-08', followUp: false },
  { id: 'l3', name: 'Meera Joshi', company: 'Saffron Kitchen', email: 'meera@saffronkitchen.in', phone: '+91 87654 32109', value: 180000, currency: 'INR', stage: 's3', source: 'Referral', assignedTo: 'u_001', createdAt: '2025-01-05', followUp: true },
  { id: 'l4', name: 'James Wilson', company: 'Nordic Design Co', email: 'james@nordicdesign.co', phone: '+44 20 7946 0958', value: 12000, currency: 'USD', stage: 's4', source: 'Ads', assignedTo: 'u_003', createdAt: '2025-01-02', followUp: false },
  { id: 'l5', name: 'Kavita Reddy', company: 'FitLife Gym', email: 'kavita@fitlife.in', phone: '+91 76543 21098', value: 320000, currency: 'INR', stage: 's1', source: 'Cold Call', assignedTo: 'u_001', createdAt: '2025-01-12', followUp: true },
  { id: 'l6', name: 'Sarah Miller', company: 'GreenLeaf Organics', email: 'sarah@greenleaf.com', phone: '+1 212 555 0198', value: 6500, currency: 'USD', stage: 's5', source: 'Referral', assignedTo: 'u_001', createdAt: '2024-12-20', followUp: false, wonDate: '2025-01-06' },
  { id: 'l7', name: 'Rajesh Nair', company: 'CloudNine SaaS', email: 'rajesh@cloudnine.in', phone: '+91 99887 76655', value: 450000, currency: 'INR', stage: 's2', source: 'Website', assignedTo: 'u_003', createdAt: '2025-01-11', followUp: false },
  { id: 'l8', name: 'Emma Thompson', company: 'Artisan Bakery', email: 'emma@artisanbakery.co.uk', phone: '+44 20 1234 5678', value: 4200, currency: 'USD', stage: 's6', source: 'Instagram', assignedTo: 'u_001', createdAt: '2024-12-28', followUp: false, lostReason: 'Budget constraints' },
  { id: 'l9', name: 'Amit Patel', company: 'SwiftLogistics', email: 'amit@swiftlogistics.in', phone: '+91 88776 65544', value: 275000, currency: 'INR', stage: 's3', source: 'Ads', assignedTo: 'u_001', createdAt: '2025-01-09', followUp: true },
  { id: 'l10', name: 'Lisa Park', company: 'Zen Yoga Studio', email: 'lisa@zenyoga.com', phone: '+1 310 555 0147', value: 3800, currency: 'USD', stage: 's4', source: 'Website', assignedTo: 'u_003', createdAt: '2025-01-07', followUp: false },
];

export const clients = [
  { id: 'c1', name: 'GreenLeaf Organics', company: 'GreenLeaf Organics LLC', email: 'sarah@greenleaf.com', phone: '+1 212 555 0198', address: '456 Market St, San Francisco, CA', gstin: '', currency: 'USD', currencySymbol: '$', owner: 'u_001', portalEnabled: true, totalProjects: 3, totalInvoiced: 24500, totalPaid: 18000, outstanding: 6500, since: '2024-06-15' },
  { id: 'c2', name: 'TechVault Solutions', company: 'TechVault Solutions Pvt Ltd', email: 'contact@techvault.in', phone: '+91 80 4567 8901', address: '123 MG Road, Bangalore, KA 560001', gstin: '29AABCT1234K1ZP', currency: 'INR', currencySymbol: '₹', owner: 'u_001', portalEnabled: true, totalProjects: 5, totalInvoiced: 1850000, totalPaid: 1420000, outstanding: 430000, since: '2024-03-20' },
  { id: 'c3', name: 'Nordic Design Co', company: 'Nordic Design Co Ltd', email: 'hello@nordicdesign.co', phone: '+44 20 7946 0958', address: '78 Shoreditch High St, London E1', gstin: '', currency: 'USD', currencySymbol: '$', owner: 'u_003', portalEnabled: true, totalProjects: 2, totalInvoiced: 15000, totalPaid: 15000, outstanding: 0, since: '2024-09-10' },
  { id: 'c4', name: 'Saffron Kitchen', company: 'Saffron Kitchen LLP', email: 'meera@saffronkitchen.in', phone: '+91 22 3456 7890', address: '45 Linking Road, Mumbai, MH 400050', gstin: '27AABCS5678L1ZQ', currency: 'INR', currencySymbol: '₹', owner: 'u_001', portalEnabled: false, totalProjects: 1, totalInvoiced: 180000, totalPaid: 90000, outstanding: 90000, since: '2024-11-01' },
  { id: 'c5', name: 'CloudNine SaaS', company: 'CloudNine Technologies', email: 'rajesh@cloudnine.in', phone: '+91 98 1234 5678', address: 'Tower B, Cyber City, Gurugram, HR 122002', gstin: '06AABCC9012M1ZR', currency: 'INR', currencySymbol: '₹', owner: 'u_001', portalEnabled: true, totalProjects: 4, totalInvoiced: 2400000, totalPaid: 2100000, outstanding: 300000, since: '2024-01-15' },
  { id: 'c6', name: 'FitLife Gym', company: 'FitLife Fitness Pvt Ltd', email: 'kavita@fitlife.in', phone: '+91 40 2345 6789', address: 'Jubilee Hills, Hyderabad, TS 500033', gstin: '36AABCF3456N1ZS', currency: 'INR', currencySymbol: '₹', owner: 'u_003', portalEnabled: true, totalProjects: 2, totalInvoiced: 640000, totalPaid: 320000, outstanding: 320000, since: '2024-08-22' },
];

export const projects = [
  { id: 'p1', clientId: 'c1', name: 'E-commerce Redesign', type: 'one-off', budget: 8500, currency: 'USD', received: 6000, pending: 2500, status: 'ongoing', startDate: '2025-01-01', deadline: '2025-03-15', progress: 65, team: ['u_001', 'u_002'] },
  { id: 'p2', clientId: 'c2', name: 'Mobile App Development', type: 'one-off', budget: 850000, currency: 'INR', received: 425000, pending: 425000, status: 'ongoing', startDate: '2024-11-01', deadline: '2025-04-30', progress: 50, team: ['u_001', 'u_004', 'u_005'] },
  { id: 'p3', clientId: 'c2', name: 'Website Maintenance', type: 'retainer', budget: 45000, currency: 'INR', received: 135000, pending: 0, status: 'ongoing', startDate: '2024-06-01', deadline: '2025-05-31', progress: 75, team: ['u_004'] },
  { id: 'p4', clientId: 'c3', name: 'Brand Identity System', type: 'one-off', budget: 12000, currency: 'USD', received: 12000, pending: 0, status: 'completed', startDate: '2024-09-15', deadline: '2024-12-20', progress: 100, team: ['u_002', 'u_001'] },
  { id: 'p5', clientId: 'c5', name: 'SaaS Dashboard UI', type: 'one-off', budget: 650000, currency: 'INR', received: 325000, pending: 325000, status: 'ongoing', startDate: '2025-01-05', deadline: '2025-05-01', progress: 35, team: ['u_002', 'u_004'] },
  { id: 'p6', clientId: 'c4', name: 'Restaurant Website', type: 'one-off', budget: 180000, currency: 'INR', received: 90000, pending: 90000, status: 'ongoing', startDate: '2024-12-01', deadline: '2025-02-28', progress: 80, team: ['u_001', 'u_002'] },
  { id: 'p7', clientId: 'c6', name: 'Membership Portal', type: 'one-off', budget: 320000, currency: 'INR', received: 160000, pending: 160000, status: 'ongoing', startDate: '2025-01-10', deadline: '2025-04-15', progress: 25, team: ['u_001', 'u_005'] },
  { id: 'p8', clientId: 'c1', name: 'Monthly SEO Retainer', type: 'retainer', budget: 1200, currency: 'USD', received: 4800, pending: 0, status: 'ongoing', startDate: '2024-09-01', deadline: '2025-08-31', progress: 55, team: ['u_003'] },
];

export const invoices = [
  { id: 'inv_001', number: 'PC-2025-001', clientId: 'c2', projectId: 'p2', amount: 425000, currency: 'INR', status: 'paid', issuedDate: '2024-11-15', dueDate: '2024-12-15', paidDate: '2024-12-10', gst: 18, cgst: 0, sgst: 0, igst: 76500, type: 'inter-state' },
  { id: 'inv_002', number: 'PC-2025-002', clientId: 'c1', projectId: 'p1', amount: 4250, currency: 'USD', status: 'paid', issuedDate: '2025-01-01', dueDate: '2025-01-31', paidDate: '2025-01-20', gst: 0 },
  { id: 'inv_003', number: 'PC-2025-003', clientId: 'c5', projectId: 'p5', amount: 325000, currency: 'INR', status: 'sent', issuedDate: '2025-01-10', dueDate: '2025-02-10', gst: 18, cgst: 58500, sgst: 58500, igst: 0, type: 'intra-state' },
  { id: 'inv_004', number: 'PC-2025-004', clientId: 'c4', projectId: 'p6', amount: 90000, currency: 'INR', status: 'overdue', issuedDate: '2024-12-15', dueDate: '2025-01-15', gst: 18, cgst: 8100, sgst: 8100, igst: 0, type: 'intra-state' },
  { id: 'inv_005', number: 'PC-2025-005', clientId: 'c6', projectId: 'p7', amount: 160000, currency: 'INR', status: 'partially_paid', issuedDate: '2025-01-12', dueDate: '2025-02-12', paidAmount: 80000, gst: 18, cgst: 0, sgst: 0, igst: 28800, type: 'inter-state' },
  { id: 'inv_006', number: 'PC-2025-006', clientId: 'c2', projectId: 'p3', amount: 45000, currency: 'INR', status: 'paid', issuedDate: '2025-01-01', dueDate: '2025-01-05', paidDate: '2025-01-03', gst: 18, cgst: 4050, sgst: 4050, igst: 0, type: 'intra-state' },
  { id: 'inv_007', number: 'PC-2025-007', clientId: 'c1', projectId: 'p8', amount: 1200, currency: 'USD', status: 'sent', issuedDate: '2025-01-01', dueDate: '2025-01-05', gst: 0 },
];

export const payments = [
  { id: 'pay_001', invoiceId: 'inv_001', clientId: 'c2', amount: 425000, currency: 'INR', date: '2024-12-10', method: 'NEFT', reference: 'UTR123456789', projectId: 'p2' },
  { id: 'pay_002', invoiceId: 'inv_002', clientId: 'c1', amount: 4250, currency: 'USD', date: '2025-01-20', method: 'PayPal', reference: 'PP-789456123', projectId: 'p1' },
  { id: 'pay_003', invoiceId: 'inv_006', clientId: 'c2', amount: 45000, currency: 'INR', date: '2025-01-03', method: 'UPI', reference: 'UPI987654321', projectId: 'p3' },
  { id: 'pay_004', invoiceId: 'inv_005', clientId: 'c6', amount: 80000, currency: 'INR', date: '2025-01-15', method: 'NEFT', reference: 'UTR987654321', projectId: 'p7' },
];

export const expenses = [
  { id: 'exp_001', category: 'Team Payout', description: 'Priya - Design work (Jan)', amount: 85000, currency: 'INR', date: '2025-01-31', projectId: 'p2' },
  { id: 'exp_002', category: 'Software', description: 'Figma Team Plan', amount: 4500, currency: 'INR', date: '2025-01-01', projectId: null },
  { id: 'exp_003', category: 'Software', description: 'AWS Hosting', amount: 12000, currency: 'INR', date: '2025-01-05', projectId: null },
  { id: 'exp_004', category: 'Team Payout', description: 'Sneha - Frontend dev (Jan)', amount: 75000, currency: 'INR', date: '2025-01-31', projectId: 'p5' },
  { id: 'exp_005', category: 'Team Payout', description: 'Vikram - Backend dev (Jan)', amount: 80000, currency: 'INR', date: '2025-01-31', projectId: 'p2' },
];

export const retainers = [
  { id: 'ret_001', clientId: 'c2', projectId: 'p3', amount: 45000, currency: 'INR', billingDay: 1, status: 'active', startDate: '2024-06-01', endDate: '2025-05-31', scope: 'Monthly website maintenance, bug fixes, minor updates' },
  { id: 'ret_002', clientId: 'c1', projectId: 'p8', amount: 1200, currency: 'USD', billingDay: 1, status: 'active', startDate: '2024-09-01', endDate: '2025-08-31', scope: 'Monthly SEO optimization, content updates, analytics reporting' },
];

export const meetings = [
  { id: 'm1', title: 'GreenLeaf Kickoff Call', clientId: 'c1', date: '2025-01-20', time: '10:00', duration: 60, attendees: ['u_001', 'u_002'], status: 'completed', notes: 'Discussed project scope, timeline, and deliverables.' },
  { id: 'm2', title: 'TechVault Sprint Review', clientId: 'c2', date: '2025-01-22', time: '15:00', duration: 45, attendees: ['u_001', 'u_004', 'u_005'], status: 'upcoming', notes: '' },
  { id: 'm3', title: 'CloudNine Design Review', clientId: 'c5', date: '2025-01-23', time: '11:30', duration: 30, attendees: ['u_002', 'u_004'], status: 'upcoming', notes: '' },
  { id: 'm4', title: 'Saffron Kitchen Final Walkthrough', clientId: 'c4', date: '2025-01-25', time: '14:00', duration: 60, attendees: ['u_001'], status: 'upcoming', notes: '' },
];

export const tasks = [
  { id: 't1', title: 'Design homepage mockups', projectId: 'p1', assignee: 'u_002', status: 'in-progress', priority: 'high', dueDate: '2025-01-25' },
  { id: 't2', title: 'Set up API endpoints', projectId: 'p2', assignee: 'u_005', status: 'in-progress', priority: 'high', dueDate: '2025-01-28' },
  { id: 't3', title: 'Write product page copy', projectId: 'p1', assignee: 'u_003', status: 'todo', priority: 'medium', dueDate: '2025-01-30' },
  { id: 't4', title: 'Implement payment gateway', projectId: 'p2', assignee: 'u_004', status: 'todo', priority: 'high', dueDate: '2025-02-05' },
  { id: 't5', title: 'SEO audit report', projectId: 'p8', assignee: 'u_003', status: 'done', priority: 'medium', dueDate: '2025-01-15' },
  { id: 't6', title: 'Create dashboard components', projectId: 'p5', assignee: 'u_004', status: 'in-progress', priority: 'high', dueDate: '2025-02-01' },
  { id: 't7', title: 'Menu page design', projectId: 'p6', assignee: 'u_002', status: 'done', priority: 'medium', dueDate: '2025-01-18' },
  { id: 't8', title: 'User auth flow', projectId: 'p7', assignee: 'u_005', status: 'todo', priority: 'high', dueDate: '2025-02-10' },
];

export const documents = [
  { id: 'd1', title: 'GreenLeaf E-commerce Contract', type: 'contract', clientId: 'c1', status: 'signed', signedDate: '2024-12-28', version: 1 },
  { id: 'd2', title: 'TechVault App Development Proposal', type: 'proposal', clientId: 'c2', status: 'signed', signedDate: '2024-10-25', version: 2 },
  { id: 'd3', title: 'CloudNine SaaS Dashboard Quote', type: 'quotation', clientId: 'c5', status: 'sent', signedDate: null, version: 1 },
  { id: 'd4', title: 'NDA - Nordic Design Co', type: 'nda', clientId: 'c3', status: 'signed', signedDate: '2024-09-08', version: 1 },
  { id: 'd5', title: 'FitLife Portal Development Agreement', type: 'contract', clientId: 'c6', status: 'viewed', signedDate: null, version: 1 },
];

export const messages = [
  { id: 'msg1', threadId: 'th1', clientId: 'c1', sender: 'u_001', content: 'Hi Sarah, the homepage mockups are ready for review!', timestamp: '2025-01-19T14:30:00', read: true },
  { id: 'msg2', threadId: 'th1', clientId: 'c1', sender: 'c1', content: 'Looks great! Just a few notes on the hero section.', timestamp: '2025-01-19T15:45:00', read: true },
  { id: 'msg3', threadId: 'th2', clientId: 'c2', sender: 'u_001', content: 'Sprint 4 is complete. Sending the demo link now.', timestamp: '2025-01-20T09:00:00', read: true },
  { id: 'msg4', threadId: 'th2', clientId: 'c2', sender: 'c2', content: 'Thanks Arjun! We\'ll review and share feedback by EOD.', timestamp: '2025-01-20T10:15:00', read: false },
  { id: 'msg5', threadId: 'th3', clientId: 'c5', sender: 'u_002', content: 'The new dashboard designs are uploaded to the portal.', timestamp: '2025-01-20T11:30:00', read: false },
];

export const reviews = [
  { id: 'r1', clientId: 'c3', projectId: 'p4', rating: 5, text: 'Pixel & Code delivered an outstanding brand identity. Their attention to detail and creative vision exceeded our expectations. Highly recommend!', date: '2024-12-22', author: 'James Wilson', verified: true },
  { id: 'r2', clientId: 'c2', projectId: 'p_old1', rating: 5, text: 'Exceptional work on our CRM integration. The team was responsive, professional, and delivered ahead of schedule.', date: '2024-10-15', author: 'Vikram Malhotra', verified: true },
  { id: 'r3', clientId: 'c1', projectId: 'p_old2', rating: 4, text: 'Great design work and smooth collaboration. Would love to work together again on future projects.', date: '2024-08-20', author: 'Sarah Miller', verified: true },
];

export const notifications = [
  { id: 'n1', type: 'payment', title: 'Payment received', message: '₹45,000 from TechVault Solutions', time: '2 hours ago', read: false },
  { id: 'n2', type: 'message', title: 'New message', message: 'TechVault Solutions replied to your message', time: '3 hours ago', read: false },
  { id: 'n3', type: 'signature', title: 'Document viewed', message: 'FitLife Gym viewed the development agreement', time: '5 hours ago', read: false },
  { id: 'n4', type: 'meeting', title: 'Meeting reminder', message: 'TechVault Sprint Review in 2 hours', time: '6 hours ago', read: true },
  { id: 'n5', type: 'review', title: 'New review received', message: 'Sarah Miller left a 4-star review', time: '1 day ago', read: true },
];

export const revenueData = [
  { month: 'Aug', received: 285000, pending: 120000 },
  { month: 'Sep', received: 420000, pending: 180000 },
  { month: 'Oct', received: 380000, pending: 250000 },
  { month: 'Nov', received: 550000, pending: 320000 },
  { month: 'Dec', received: 480000, pending: 280000 },
  { month: 'Jan', received: 625000, pending: 430000 },
];

export const revenueByType = [
  { name: 'Freelance', value: 4200000, color: '#ea580c' },
  { name: 'Retainer', value: 1080000, color: '#3b82f6' },
];

export const leadsBySource = [
  { source: 'Website', count: 12, value: 850000 },
  { source: 'Instagram', count: 8, value: 420000 },
  { source: 'Referral', count: 6, value: 680000 },
  { source: 'Ads', count: 5, value: 350000 },
  { source: 'Cold Call', count: 3, value: 180000 },
];

export const plans = {
  free: {
    name: 'Free',
    priceUSD: 0,
    priceINR: 0,
    clients: 3,
    projects: 5,
    leads: 20,
    team: 1,
    portalClients: 1,
    aiQuota: 3,
    features: ['Clients, projects & tasks', 'Invoices in 30+ currencies', 'Lead pipeline', 'E-signed documents', 'Client portal (1 client)', 'Google Calendar & Meet sync', 'Android app', 'Verified reviews', 'Export anytime'],
  },
  pro: {
    name: 'Pro',
    priceUSD: 19,
    priceINR: 199,
    clients: 20,
    projects: 40,
    leads: 200,
    team: 5,
    portalClients: 'unlimited',
    aiQuota: 25,
    features: ['Everything in Free', 'Portal for every client (unbranded)', 'Auto-invoicing for retainers', 'Automatic lead reminders', '25 AI quotes/contracts per month', 'Priority email support'],
  },
  ultra: {
    name: 'Ultra',
    priceUSD: 39,
    priceINR: 799,
    clients: 'unlimited',
    projects: 'unlimited',
    leads: 'unlimited',
    team: 'unlimited',
    portalClients: 'unlimited',
    aiQuota: 100,
    features: ['Everything in Pro', 'Unlimited everything', 'Team payroll & payslips', 'White-label branding', 'Custom domain for portal', 'Lead integrations (Meta, Google Ads)', '100 AI quotes/month', 'Priority support'],
  },
};
