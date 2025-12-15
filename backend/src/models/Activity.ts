import pool from '../config/database';

/**
 * Activity model for database operations
 */

export interface Activity {
  id: number;
  user_id: number;
  activity_type: 'Study' | 'Job Application' | 'Interview' | 'Leisure' | 'Other';
  title: string;
  duration_minutes?: number;
  description?: string;
  activity_date: Date;
  created_at: Date;
}

export const createActivity = async (
  userId: number,
  data: Omit<Activity, 'id' | 'user_id' | 'created_at'>
): Promise<Activity> => {
  const result = await pool.query(
    `INSERT INTO activities 
    (user_id, activity_type, title, duration_minutes, description, activity_date) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`,
    [userId, data.activity_type, data.title, data.duration_minutes || null, data.description || null, data.activity_date]
  );
  return result.rows[0];
};

export const getActivitiesByUserAndDate = async (userId: number, date: Date): Promise<Activity[]> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const result = await pool.query(
    `SELECT * FROM activities 
    WHERE user_id = $1 AND activity_date >= $2 AND activity_date <= $3
    ORDER BY activity_date ASC`,
    [userId, startOfDay, endOfDay]
  );
  return result.rows;
};

export const getActivitiesByDateRange = async (userId: number, startDate: Date, endDate: Date): Promise<Activity[]> => {
  const result = await pool.query(
    `SELECT * FROM activities 
    WHERE user_id = $1 AND activity_date >= $2 AND activity_date <= $3
    ORDER BY activity_date DESC`,
    [userId, startDate, endDate]
  );
  return result.rows;
};

export const getTotalStudyHours = async (userId: number, days: number = 7): Promise<number> => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes 
    FROM activities 
    WHERE user_id = $1 
    AND activity_type = 'Study'
    AND activity_date >= NOW() - INTERVAL '1 day' * $2`,
    [userId, days]
  );
  return Math.round(result.rows[0].total_minutes / 60 * 10) / 10; // Convert to hours, round to 1 decimal
};

export const getActivityStats = async (userId: number, days: number = 7) => {
  const result = await pool.query(
    `SELECT 
      activity_type,
      COUNT(*) as count,
      SUM(duration_minutes) as total_duration
    FROM activities 
    WHERE user_id = $1 
    AND activity_date >= NOW() - INTERVAL '1 day' * $2
    GROUP BY activity_type
    ORDER BY count DESC`,
    [userId, days]
  );
  return result.rows;
};

export default {
  createActivity,
  getActivitiesByUserAndDate,
  getActivitiesByDateRange,
  getTotalStudyHours,
  getActivityStats,
};
