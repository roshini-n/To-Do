import { Request, Response } from 'express';
import {
  createReminder,
  getPendingReminders,
  getUpcomingReminders,
  markReminderAsNotified,
} from '../models/Reminder';

/**
 * Reminder controller
 */

export const createNewReminder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { job_application_id, reminder_type, title, description, scheduled_date } = req.body;

    // Validate input
    if (!reminder_type || !title || !scheduled_date) {
      return res.status(400).json({ message: 'Reminder type, title, and scheduled date are required' });
    }

    const validTypes = ['Follow-up', 'Study Goal', 'Application Goal', 'Custom'];
    if (!validTypes.includes(reminder_type)) {
      return res.status(400).json({ message: 'Invalid reminder type' });
    }

    const reminder = await createReminder(userId!, {
      job_application_id,
      reminder_type,
      title,
      description,
      scheduled_date: new Date(scheduled_date),
    });

    res.status(201).json({
      message: 'Reminder created successfully',
      reminder,
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
};

export const getPending = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const reminders = await getPendingReminders(userId!);

    res.status(200).json({
      message: 'Pending reminders retrieved successfully',
      reminders,
      count: reminders.length,
    });
  } catch (error) {
    console.error('Get pending reminders error:', error);
    res.status(500).json({ message: 'Failed to retrieve reminders' });
  }
};

export const getUpcoming = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { days } = req.query;

    const dayRange = days ? parseInt(days as string) : 7;
    const reminders = await getUpcomingReminders(userId!, dayRange);

    res.status(200).json({
      message: 'Upcoming reminders retrieved successfully',
      reminders,
      dayRange,
      count: reminders.length,
    });
  } catch (error) {
    console.error('Get upcoming reminders error:', error);
    res.status(500).json({ message: 'Failed to retrieve reminders' });
  }
};

export const markNotified = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reminder = await markReminderAsNotified(parseInt(id));

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.status(200).json({
      message: 'Reminder marked as notified',
      reminder,
    });
  } catch (error) {
    console.error('Mark notified error:', error);
    res.status(500).json({ message: 'Failed to mark reminder' });
  }
};

export default {
  createNewReminder,
  getPending,
  getUpcoming,
  markNotified,
};
