/**
 * Validation utility functions for request data
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateJobApplication = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.company_name || data.company_name.trim() === '') {
    errors.push('Company name is required');
  }
  if (!data.job_role || data.job_role.trim() === '') {
    errors.push('Job role is required');
  }
  if (!data.platform || data.platform.trim() === '') {
    errors.push('Platform is required');
  }
  if (!data.applied_date) {
    errors.push('Applied date is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validateJobApplication,
};
