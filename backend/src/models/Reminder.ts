import pool from '../config/database';

/**
 * Reminder model for database operations
 */

export interface Reminder {
  id: number;
  user_id: number;
  job_application_id?: number;
  reminder_type: 'Follow-up' | 'Study Goal' | 'Application Goal' | 'Custom';
  title: string;
  description?: string;
  scheduled_date: Date;
  is_notified: boolean;
  notified_at?: Date;
  created_at: Date;
}

export const createReminder = async (
  userId: number,
  data: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'is_notified' | 'notified_at'>
): Promise<Reminder> => {
  const result = await pool.query(
    `INSERT INTO reminders 
    (user_id, job_application_id, reminder_type, title, description, scheduled_date) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING *`,
    [
      userId,
      data.job_application_id || null,
      data.reminder_type,
      data.title,
      data.description || null,
      data.scheduled_date,
    ]
  );
  return result.rows[0];
};

export const getPendingReminders = async (userId: number): Promise<Reminder[]> => {
  const result = await pool.query(
    `SELECT * FROM reminders 
    WHERE user_id = $1 
    AND is_notified = FALSE 
    AND scheduled_date <= NOW()
    ORDER BY scheduled_date ASC`,
    [userId]
  );
  return result.rows;
};

export const getUpcomingReminders = async (userId: number, days: number = 7): Promise<Reminder[]> => {
  const result = await pool.query(
    `SELECT * FROM reminders 
    WHERE user_id = $1 
    AND scheduled_date >= NOW()
    AND scheduled_date <= NOW() + INTERVAL '1 day' * $2
    ORDER BY scheduled_date ASC`,
    [userId, days]
  );
  return result.rows;
};

export const markReminderAsNotified = async (reminderId: number): Promise<Reminder | null> => {
  const result = await pool.query(
    `UPDATE reminders 
    SET is_notified = TRUE, notified_at = NOW() 
    WHERE id = $1 
    RETURNING *`,
    [reminderId]
  );
  return result.rows[0] || null;
};

export const createFollowUpReminders = async (): Promise<void> => {
  // Automatically create reminders for applications that haven't had activity in 7 days
  await pool.query(`
    INSERT INTO reminders (user_id, job_application_id, reminder_type, title, description, scheduled_date)
    SELECT 
      ja.user_id,
      ja.id,
      'Follow-up',
      'Follow up: ' || ja.company_name,
      'You applied to ' || ja.company_name || ' for ' || ja.job_role || ' 7 days ago. Consider sending a follow-up email.',
      NOW()
    FROM job_applications ja
    WHERE ja.status = 'Applied'
    AND ja.applied_date = CURRENT_DATE - INTERVAL '7 days'
    AND NOT EXISTS (
      SELECT 1 FROM reminders 
      WHERE job_application_id = ja.id 
      AND reminder_type = 'Follow-up'
      AND DATE(scheduled_date) = CURRENT_DATE
    )
  `);
};

export default {
  createReminder,
  getPendingReminders,
  getUpcomingReminders,
  markReminderAsNotified,
  createFollowUpReminders,
};
