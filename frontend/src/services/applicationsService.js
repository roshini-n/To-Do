import { supabase } from '../config/supabase';

/**
 * Job Applications service using Supabase
 */

export const applicationsService = {
  /**
   * Create new job application
   */
  create: async (application) => {
    try {
      console.log('applicationsService.create called with:', application);
      
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id);
      if (!user) throw new Error('User not authenticated');

      const payload = {
        user_id: user.id,
        company_name: application.companyName,
        job_role: application.jobRole,
        platform: application.platform,
        application_date: application.applicationDate,
        status: application.status || 'Applied',
        recruiter_email: application.recruiterEmail || null,
        recruiter_contact: application.recruiterContact || null,
        created_at: new Date().toISOString(),
      };
      
      console.log('Inserting payload:', payload);

      const { data, error } = await supabase
        .from('job_applications')
        .insert([payload])
        .select();

      console.log('Insert response:', { data, error });
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('applicationsService.create error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all applications for current user
   */
  getAll: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('application_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get single application by ID
   */
  getById: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Update application
   */
  update: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .update({
          company_name: updates.companyName,
          job_role: updates.jobRole,
          platform: updates.platform,
          status: updates.status,
          recruiter_email: updates.recruiterEmail,
          recruiter_contact: updates.recruiterContact,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete application
   */
  delete: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get application statistics
   */
  getStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .select('status, application_date')
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Raw applications data:', data);

      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      
      const stats = {
        totalApplications: data.length,
        interviews: data.filter((app) => app.status === 'Interview').length,
        offers: data.filter((app) => app.status === 'Offer').length,
        pending: data.filter((app) => app.status === 'Applied' || app.status === 'No Response').length,
        rejected: data.filter((app) => app.status === 'Rejected').length,
        todayApplications: data.filter(
          (app) => app.application_date === today
        ).length,
      };

      console.log('Calculated stats:', stats, 'Today is:', today);
      return { success: true, data: { stats } };
    } catch (error) {
      console.error('getStats error:', error);
      return { success: false, error: error.message };
    }
  },
};
