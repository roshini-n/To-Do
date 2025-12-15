import pool from '../config/database';

/**
 * User model for database operations
 */

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name?: string;
  created_at: Date;
  updated_at: Date;
}

export const getUserById = async (userId: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return result.rows[0] || null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

export const createUser = async (
  email: string,
  passwordHash: string,
  fullName?: string
): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at, updated_at',
    [email, passwordHash, fullName || null]
  );
  return result.rows[0];
};

export const updateUser = async (
  userId: number,
  updates: Partial<Omit<User, 'id' | 'created_at'>>
): Promise<User | null> => {
  const fields: string[] = [];
  const values: any[] = [];
  let paramCounter = 1;

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = $${paramCounter}`);
    values.push(value);
    paramCounter++;
  });

  if (fields.length === 0) return getUserById(userId);

  fields.push(`updated_at = $${paramCounter}`);
  values.push(new Date());
  values.push(userId);

  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCounter + 1} RETURNING *`,
    values
  );

  return result.rows[0] || null;
};

export default {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
};
