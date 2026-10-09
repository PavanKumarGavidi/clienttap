import { supabase } from './supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'member';
  created_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo: string;
  currency: string;
  currency_symbol: string;
  timezone: string;
  gstin: string;
  plan: 'free' | 'pro' | 'ultra';
  created_at: string;
}

function getAvatarColor(name: string): string {
  const colors = ['#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#d97706', '#b45309'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export const auth = {
  // Sign up a new user
  async signup(
    name: string,
    email: string,
    password: string,
    workspaceName: string,
    slug: string,
    country: string = 'IN'
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, workspace_name: workspaceName, slug, country }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' };
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          avatar: getInitials(name),
          role: 'owner'
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          owner_id: authData.user.id,
          name: workspaceName || `${name}'s Agency`,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          logo: getInitials(name),
          currency: country === 'IN' ? 'INR' : 'USD',
          currency_symbol: country === 'IN' ? '₹' : '$',
          timezone: country === 'IN' ? 'Asia/Kolkata' : 'UTC',
          plan: 'free'
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('Workspace creation error:', workspaceError);
      }

      // Create membership
      if (workspace) {
        await supabase.from('memberships').insert({
          workspace_id: workspace.id,
          user_id: authData.user.id,
          role: 'owner'
        });

        // Create default pipeline stages
        const defaultStages = [
          { name: 'New', color: '#3b82f6', order_index: 0 },
          { name: 'Contacted', color: '#8b5cf6', order_index: 1 },
          { name: 'Qualified', color: '#f59e0b', order_index: 2 },
          { name: 'Won', color: '#22c55e', order_index: 3 },
          { name: 'Lost', color: '#ef4444', order_index: 4 }
        ];

        await supabase.from('pipeline_stages').insert(
          defaultStages.map(stage => ({
            workspace_id: workspace.id,
            ...stage
          }))
        );

        // Create usage counter
        await supabase.from('usage_counters').insert({
          workspace_id: workspace.id,
          ai_quotes_used: 0,
          storage_used_bytes: 0
        });
      }

      const user: User = {
        id: authData.user.id,
        name,
        email,
        avatar: getInitials(name),
        role: 'owner',
        created_at: new Date().toISOString()
      };

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Login
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' };
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        name: profile?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        avatar: profile?.avatar || getInitials(profile?.name || 'User'),
        role: profile?.role || 'owner',
        created_at: data.user.created_at || new Date().toISOString()
      };

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Google OAuth login
  async loginWithGoogle(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/#/app/dashboard'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current session
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      name: profile?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      avatar: profile?.avatar || getInitials(profile?.name || 'User'),
      role: profile?.role || 'owner',
      created_at: user.created_at || new Date().toISOString()
    };
  },

  // Get current workspace
  async getCurrentWorkspace(): Promise<Workspace | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Fetch workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    if (!workspace) return null;

    return {
      id: workspace.id,
      owner_id: workspace.owner_id,
      name: workspace.name,
      slug: workspace.slug,
      logo: workspace.logo,
      currency: workspace.currency,
      currency_symbol: workspace.currency_symbol,
      timezone: workspace.timezone,
      gstin: workspace.gstin || '',
      plan: workspace.plan,
      created_at: workspace.created_at
    };
  },

  // Logout
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Check if authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<void> {
    console.log('Updating profile:', userId, updates);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    console.log('Profile updated successfully:', data);
  },

  // Update workspace
  async updateWorkspace(workspaceId: string, updates: Partial<Workspace>): Promise<void> {
    console.log('Updating workspace:', workspaceId, updates);
    const { data, error } = await supabase
      .from('workspaces')
      .update(updates)
      .eq('id', workspaceId)
      .select();
    
    if (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
    console.log('Workspace updated successfully:', data);
  },

  // Forgot password
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
