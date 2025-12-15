import { supabase } from '../config/supabase';

/**
 * Authentication service using Supabase Auth
 */

export const authService = {
  /**
   * Sign up new user
   */
  signup: async (email, password, fullName) => {
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signupError) throw signupError;

      // Also create a user record in public.users table
      // This is needed because job_applications has a foreign key to users table
      if (data.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              created_at: new Date().toISOString(),
            },
          ]);

        if (userError) {
          console.error('Error creating user record:', userError);
          // Don't throw - auth was successful, just log the error
          // The user can still use the app
        }
      }
      
      return { 
        success: true, 
        user: data.user,
        message: 'Signup successful! A confirmation email has been sent to ' + email 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get current user session
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session: data.session };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Listen to auth changes
   */
  onAuthChange: (callback) => {
    const { data } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
    return data;
  },

  /**
   * Send password reset email
   */
  resetPasswordEmail: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { 
        success: true, 
        message: 'Password reset email sent to ' + email 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update password with token
   */
  updatePassword: async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      return { 
        success: true, 
        message: 'Password updated successfully' 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
