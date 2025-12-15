/**
 * Database initialization and schema creation
 * Creates tables for users, job applications, activities, and reminders
 */

import pool from './database';

export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create job applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        company_name VARCHAR(255) NOT NULL,
        job_role VARCHAR(255) NOT NULL,
        platform VARCHAR(100),
        applied_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'Applied',
        recruiter_email VARCHAR(255),
        recruiter_name VARCHAR(255),
        application_link TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_status CHECK (status IN ('Applied', 'Interview', 'Rejected', 'Offer', 'No Response'))
      );
    `);

    // Create activity tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        duration_minutes INTEGER,
        description TEXT,
        activity_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_activity_type CHECK (activity_type IN ('Study', 'Job Application', 'Interview', 'Leisure', 'Other'))
      );
    `);

    // Create reminders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
        reminder_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        scheduled_date TIMESTAMP NOT NULL,
        is_notified BOOLEAN DEFAULT FALSE,
        notified_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_reminder_type CHECK (reminder_type IN ('Follow-up', 'Study Goal', 'Application Goal', 'Custom'))
      );
    `);

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_date ON reminders(scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date ON job_applications(applied_date);
    `);

    console.log('✅ Database tables initialized successfully');
    client.release();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export default initializeDatabase;
