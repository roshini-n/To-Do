import { supabase } from '../config/supabase';

/**
 * Activities service using Supabase
 */

export const activitiesService = {
  /**
   * Log new activity
   */
  log: async (activity) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Logging activity:', activity);

      const { data, error } = await supabase
        .from('activities')
        .insert([
          {
            user_id: user.id,
            activity_type: activity.activity_type,
            description: activity.description || null,
            duration_minutes: activity.duration_minutes,
            date: activity.activity_date || new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      console.log('Activity logged successfully:', data);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Log activity error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get daily activities for a specific date
   */
  getDailyActivities: async (date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get activities within a date range
   */
  getActivityRange: async (startDate, endDate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Get activity statistics
   */
  getStats: async (days = 7) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .order('date', { ascending: false });

      if (error) throw error;

      // Calculate statistics
      const stats = {
        totalActivities: data.length,
        studyHours: data
          .filter((a) => a.activity_type === 'Study')
          .reduce((sum, a) => sum + a.duration_minutes, 0) / 60,
        applicationCount: data.filter(
          (a) => a.activity_type === 'Job Application'
        ).length,
        leisureHours: data
          .filter((a) => a.activity_type === 'Leisure')
          .reduce((sum, a) => sum + a.duration_minutes, 0) / 60,
        byType: {
          study: data.filter((a) => a.activity_type === 'Study').length,
          applications: data.filter(
            (a) => a.activity_type === 'Job Application'
          ).length,
          leisure: data.filter((a) => a.activity_type === 'Leisure').length,
        },
        dailyBreakdown: data.reduce((acc, activity) => {
          const date = activity.date;
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += activity.duration_minutes / 60;
          return acc;
        }, {}),
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete an activity
   */
  delete: async (activityId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
