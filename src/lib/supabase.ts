import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get the user's profile from the users table
  const { data: profile } = await supabase
    .from('users')
    .select('*, role:roles(*)')
    .eq('id', user.id)
    .single();
    
  return { ...user, profile };
};

// Helper function to get user permissions
export const getUserPermissions = async (userId: string) => {
  const { data: userWithRole } = await supabase
    .from('users')
    .select('role_id')
    .eq('id', userId)
    .single();
    
  if (!userWithRole?.role_id) return [];
  
  const { data: permissions } = await supabase
    .from('role_permissions')
    .select('permission:permissions(*)')
    .eq('role_id', userWithRole.role_id);
    
  return permissions?.map(p => p.permission) || [];
};

// Helper function to check if user has a specific permission
export const hasPermission = async (userId: string, resource: string, action: string) => {
  const permissions = await getUserPermissions(userId);
  return permissions.some(p => p.resource === resource && p.action === action);
};