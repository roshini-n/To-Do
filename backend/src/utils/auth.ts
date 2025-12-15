import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Hash password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hash - Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token for user
 * @param userId - User ID
 * @returns JWT token
 */
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY 
  } as any);
};

/**
 * Verify and decode JWT token
 * @param token - JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    return null;
  }
};

export default {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
};
