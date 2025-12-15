import pool from '../config/database';

/**
 * Job Application model for database operations
 */

export interface JobApplication {
  id: number;
  user_id: number;
  company_name: string;
  job_role: string;
  platform: string;
  applied_date: Date;
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer' | 'No Response';
  recruiter_email?: string;
  recruiter_name?: string;
  application_link?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export const getJobApplicationsByUserId = async (userId: number): Promise<JobApplication[]> => {
  const result = await pool.query(
    'SELECT * FROM job_applications WHERE user_id = $1 ORDER BY applied_date DESC',
    [userId]
  );
  return result.rows;
};

export const getJobApplicationById = async (userId: number, applicationId: number): Promise<JobApplication | null> => {
  const result = await pool.query(
    'SELECT * FROM job_applications WHERE id = $1 AND user_id = $2',
    [applicationId, userId]
  );
  return result.rows[0] || null;
};

export const createJobApplication = async (
  userId: number,
  data: Omit<JobApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<JobApplication> => {
  const result = await pool.query(
    `INSERT INTO job_applications 
    (user_id, company_name, job_role, platform, applied_date, status, recruiter_email, recruiter_name, application_link, notes) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING *`,
    [
      userId,
      data.company_name,
      data.job_role,
      data.platform,
      data.applied_date,
      data.status || 'Applied',
      data.recruiter_email || null,
      data.recruiter_name || null,
      data.application_link || null,
      data.notes || null,
    ]
  );
  return result.rows[0];
};

export const updateJobApplication = async (
  userId: number,
  applicationId: number,
  updates: Partial<Omit<JobApplication, 'id' | 'user_id' | 'created_at'>>
): Promise<JobApplication | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCounter = 1;

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCounter}`);
    values.push(value);
    paramCounter++;
  });

  if (fields.length === 0) return getJobApplicationById(userId, applicationId);

  fields.push(`updated_at = $${paramCounter}`);
  values.push(new Date());
  values.push(applicationId);
  values.push(userId);

  const result = await pool.query(
    `UPDATE job_applications SET ${fields.join(', ')} WHERE id = $${paramCounter + 1} AND user_id = $${paramCounter + 2} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export const deleteJobApplication = async (userId: number, applicationId: number): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM job_applications WHERE id = $1 AND user_id = $2',
    [applicationId, userId]
  );
  return result.rowCount! > 0;
};

/**
 * Get application statistics for user
 */
export const getApplicationStats = async (userId: number) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_applications,
      SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) as interviews,
      SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END) as offers,
      SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN applied_date::date = CURRENT_DATE THEN 1 ELSE 0 END) as today_applications
    FROM job_applications 
    WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

export default {
  getJobApplicationsByUserId,
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getApplicationStats,
};
