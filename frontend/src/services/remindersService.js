import { supabase } from '../config/supabase';

/**
 * Reminders service using Supabase
 */

export const remindersService = {
  /**
   * Create a new reminder
   */
  create: async (reminder) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reminders')
        .insert([
          {
            user_id: user.id,
            application_id: reminder.applicationId || null,
            reminder_text: reminder.reminderText,
            reminder_date: reminder.reminderDate,
            is_notified: false,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get pending reminders (not yet notified)
   */
  getPending: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reminders')
        .select(
          `
          *,
          job_applications(id, company_name, job_role, application_date)
        `
        )
        .eq('user_id', user.id)
        .eq('is_notified', false)
        .lte('reminder_date', today)
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get upcoming reminders
   */
  getUpcoming: async (days = 7) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      const futureDateStr = futureDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('reminders')
        .select(
          `
          *,
          job_applications(id, company_name, job_role, application_date)
        `
        )
        .eq('user_id', user.id)
        .gte('reminder_date', today)
        .lte('reminder_date', futureDateStr)
        .order('reminder_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Mark reminder as notified
   */
  markNotified: async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('reminders')
        .update({
          is_notified: true,
          notified_at: new Date().toISOString(),
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
   * Auto-create 7-day follow-up reminders (to be called periodically)
   */
  autoCreateFollowUpReminders: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get applications from 7 days ago with no reminder yet
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

      const { data: applications, error: appError } = await supabase
        .from('job_applications')
        .select('id, company_name, job_role')
        .eq('user_id', user.id)
        .eq('application_date', sevenDaysAgoStr)
        .eq('status', 'Applied');

      if (appError) throw appError;

      // Create reminders for these applications
      const remindersToCreate = applications.map((app) => ({
        user_id: user.id,
        application_id: app.id,
        reminder_text: `Follow up on ${app.company_name} - ${app.job_role}`,
        reminder_date: new Date().toISOString().split('T')[0],
        is_notified: false,
        created_at: new Date().toISOString(),
      }));

      if (remindersToCreate.length > 0) {
        const { error: reminderError } = await supabase
          .from('reminders')
          .insert(remindersToCreate);

        if (reminderError) throw reminderError;
      }

      return { success: true, created: remindersToCreate.length };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
