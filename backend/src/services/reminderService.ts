import cron from 'node-cron';
import { createFollowUpReminders } from '../models/Reminder';
import pool from '../config/database';

/**
 * Reminder service for scheduled tasks
 * Handles automatic reminder creation and notifications
 */

/**
 * Start scheduled reminder tasks
 */
export const startReminderScheduler = () => {
  // Run every day at 8:00 AM to create follow-up reminders
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('⏰ Running scheduled reminder task...');
      await createFollowUpReminders();
      console.log('✅ Follow-up reminders created successfully');
    } catch (error) {
      console.error('❌ Error creating follow-up reminders:', error);
    }
  });

  // Run every hour to check for pending reminders
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await pool.query(`
        SELECT id, user_id, title, description 
        FROM reminders 
        WHERE is_notified = FALSE 
        AND scheduled_date <= NOW()
        LIMIT 100
      `);

      if (result.rows.length > 0) {
        console.log(`📢 Found ${result.rows.length} pending reminders to process`);
        // In production, here you would send notifications via:
        // - Browser Notifications API (for web)
        // - Email notifications
        // - Push notifications to mobile
      }
    } catch (error) {
      console.error('❌ Error checking pending reminders:', error);
    }
  });

  console.log('✅ Reminder scheduler started');
};

export default {
  startReminderScheduler,
};
