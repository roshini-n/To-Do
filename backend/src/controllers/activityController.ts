import { Request, Response } from 'express';
import {
  createActivity,
  getActivitiesByUserAndDate,
  getActivitiesByDateRange,
  getTotalStudyHours,
  getActivityStats,
} from '../models/Activity';

/**
 * Activity controller
 */

export const logActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { activity_type, title, duration_minutes, description, activity_date } = req.body;

    // Validate input
    if (!activity_type || !title) {
      return res.status(400).json({ message: 'Activity type and title are required' });
    }

    const validTypes = ['Study', 'Job Application', 'Interview', 'Leisure', 'Other'];
    if (!validTypes.includes(activity_type)) {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    const activity = await createActivity(userId!, {
      activity_type,
      title,
      duration_minutes,
      description,
      activity_date: activity_date ? new Date(activity_date) : new Date(),
    });

    res.status(201).json({
      message: 'Activity logged successfully',
      activity,
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ message: 'Failed to log activity' });
  }
};

export const getDailyActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { date } = req.query;

    const targetDate = date ? new Date(date as string) : new Date();
    const activities = await getActivitiesByUserAndDate(userId!, targetDate);

    // Calculate total time per activity type
    const typeBreakdown: { [key: string]: number } = {};
    activities.forEach((activity) => {
      typeBreakdown[activity.activity_type] = (typeBreakdown[activity.activity_type] || 0) + (activity.duration_minutes || 0);
    });

    res.status(200).json({
      message: 'Daily activities retrieved successfully',
      date: targetDate.toISOString().split('T')[0],
      activities,
      typeBreakdown,
      totalMinutes: Object.values(typeBreakdown).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    console.error('Get daily activities error:', error);
    res.status(500).json({ message: 'Failed to retrieve activities' });
  }
};

export const getActivityRange = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const activities = await getActivitiesByDateRange(userId!, new Date(startDate as string), new Date(endDate as string));

    res.status(200).json({
      message: 'Activities retrieved successfully',
      activities,
      count: activities.length,
    });
  } catch (error) {
    console.error('Get activity range error:', error);
    res.status(500).json({ message: 'Failed to retrieve activities' });
  }
};

export const getStudyStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { days } = req.query;

    const dayRange = days ? parseInt(days as string) : 7;
    const studyHours = await getTotalStudyHours(userId!, dayRange);
    const stats = await getActivityStats(userId!, dayRange);

    res.status(200).json({
      message: 'Study statistics retrieved successfully',
      studyHours,
      dayRange,
      activityBreakdown: stats,
    });
  } catch (error) {
    console.error('Get study stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve statistics' });
  }
};

export default {
  logActivity,
  getDailyActivities,
  getActivityRange,
  getStudyStats,
};
