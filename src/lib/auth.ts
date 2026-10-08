// Auth service - localStorage-based, structured for Supabase swap-in
// When user provides Supabase keys, replace the implementation but keep the interface

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In production: never store plain text; use Supabase Auth
  avatar: string;
  role: 'owner' | 'member';
  createdAt: string;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  gstin: string;
  plan: 'free' | 'pro' | 'ultra';
  createdAt: string;
}

export interface Session {
  userId: string;
  workspaceId: string;
  expiresAt: number;
}

const USERS_KEY = 'clienttap_users';
const WORKSPACES_KEY = 'clienttap_workspaces';
const SESSION_KEY = 'clienttap_session';

// Generate avatar initial color based on name
function getAvatarColor(name: string): string {
  const colors = ['#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#d97706', '#b45309'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const auth = {
  // Get all registered users
  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save users
  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Sign up a new user
  signup(name: string, email: string, password: string, workspaceName: string, slug: string, country: string = 'IN'): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create user
    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email: email.toLowerCase(),
      password, // In production: hash this or use Supabase Auth
      avatar: getInitials(name),
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    // Create workspace
    const workspace: Workspace = {
      id: `ws_${Date.now()}`,
      ownerId: user.id,
      name: workspaceName || `${name}'s Agency`,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      logo: getInitials(name),
      currency: country === 'IN' ? 'INR' : 'USD',
      currencySymbol: country === 'IN' ? '₹' : '$',
      timezone: country === 'IN' ? 'Asia/Kolkata' : 'UTC',
      gstin: '',
      plan: 'free',
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this.saveUsers(users);

    // Save workspace
    const workspaces = this.getWorkspaces();
    workspaces.push(workspace);
    this.saveWorkspaces(workspaces);

    // Create session
    this.createSession(user.id, workspace.id);

    return { success: true, user };
  },

  // Login
  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    // Get user's workspace
    const workspaces = this.getWorkspaces();
    const workspace = workspaces.find(w => w.ownerId === user.id);
    if (!workspace) {
      return { success: false, error: 'Workspace not found' };
    }

    this.createSession(user.id, workspace.id);
    return { success: true, user };
  },

  // Create session
  createSession(userId: string, workspaceId: string): void {
    const session: Session = {
      userId,
      workspaceId,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  // Get current session
  getSession(): Session | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    
    const session: Session = JSON.parse(data);
    if (session.expiresAt < Date.now()) {
      this.logout();
      return null;
    }
    return session;
  },

  // Get current user
  getCurrentUser(): User | null {
    const session = this.getSession();
    if (!session) return null;
    
    const users = this.getUsers();
    return users.find(u => u.id === session.userId) || null;
  },

  // Get current workspace
  getCurrentWorkspace(): Workspace | null {
    const session = this.getSession();
    if (!session) return null;
    
    const workspaces = this.getWorkspaces();
    return workspaces.find(w => w.id === session.workspaceId) || null;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  // Check if authenticated
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  // Update user
  updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index >= 0) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  },

  // Update workspace
  updateWorkspace(workspaceId: string, updates: Partial<Workspace>): void {
    const workspaces = this.getWorkspaces();
    const index = workspaces.findIndex(w => w.id === workspaceId);
    if (index >= 0) {
      workspaces[index] = { ...workspaces[index], ...updates };
      this.saveWorkspaces(workspaces);
    }
  },

  // Get all workspaces
  getWorkspaces(): Workspace[] {
    const data = localStorage.getItem(WORKSPACES_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save workspaces
  saveWorkspaces(workspaces: Workspace[]): void {
    localStorage.setItem(WORKSPACES_KEY, JSON.stringify(workspaces));
  },
};
