/**
 * Unified API service for Supabase backend
 * This service wraps all Supabase services for easy access
 */

import { authService } from './authService';
import { applicationsService } from './applicationsService';
import { activitiesService } from './activitiesService';
import { remindersService } from './remindersService';

// Authentication endpoints
export const authAPI = {
  signup: (email, password, fullName) =>
    authService.signup(email, password, fullName),
  login: (email, password) =>
    authService.login(email, password),
  logout: () =>
    authService.logout(),
  getCurrentSession: () =>
    authService.getCurrentSession(),
  onAuthChange: (callback) =>
    authService.onAuthChange(callback),
  resetPasswordEmail: (email) =>
    authService.resetPasswordEmail(email),
  updatePassword: (password) =>
    authService.updatePassword(password),
};

// Job Applications endpoints
export const applicationsAPI = {
  create: (data) => applicationsService.create(data),
  getAll: () => applicationsService.getAll(),
  getById: (id) => applicationsService.getById(id),
  update: (id, data) => applicationsService.update(id, data),
  delete: (id) => applicationsService.delete(id),
  getStats: () => applicationsService.getStats(),
};

// Activities endpoints
export const activitiesAPI = {
  log: (data) => activitiesService.log(data),
  getDailyActivities: (date) => activitiesService.getDailyActivities(date),
  getActivityRange: (startDate, endDate) =>
    activitiesService.getActivityRange(startDate, endDate),
  getStats: (days) => activitiesService.getStats(days),
};

// Reminders endpoints
export const remindersAPI = {
  create: (data) => remindersService.create(data),
  getPending: () => remindersService.getPending(),
  getUpcoming: (days) => remindersService.getUpcoming(days),
  markNotified: (id) => remindersService.markNotified(id),
  autoCreateFollowUpReminders: () =>
    remindersService.autoCreateFollowUpReminders(),
};

export default {
  authAPI,
  applicationsAPI,
  activitiesAPI,
  remindersAPI,
};
