import { Request, Response } from 'express';
import { validateJobApplication } from '../utils/validation';
import {
  getJobApplicationsByUserId,
  getJobApplicationById,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getApplicationStats,
} from '../models/JobApplication';

/**
 * Job Application controller
 */

export const createApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { company_name, job_role, platform, applied_date, status, recruiter_email, recruiter_name, application_link, notes } = req.body;

    // Validate input
    const validation = validateJobApplication({ company_name, job_role, platform, applied_date });
    if (!validation.valid) {
      return res.status(400).json({ message: 'Validation failed', errors: validation.errors });
    }

    // Create application
    const application = await createJobApplication(userId!, {
      company_name,
      job_role,
      platform,
      applied_date: new Date(applied_date),
      status: status || 'Applied',
      recruiter_email,
      recruiter_name,
      application_link,
      notes,
    });

    res.status(201).json({
      message: 'Job application created successfully',
      application,
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Failed to create application' });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const applications = await getJobApplicationsByUserId(userId!);

    res.status(200).json({
      message: 'Applications retrieved successfully',
      applications,
      count: applications.length,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Failed to retrieve applications' });
  }
};

export const getApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const application = await getJobApplicationById(userId!, parseInt(id));

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      message: 'Application retrieved successfully',
      application,
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Failed to retrieve application' });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { company_name, job_role, platform, status, recruiter_email, recruiter_name, application_link, notes } = req.body;

    // Check if application exists
    const existingApp = await getJobApplicationById(userId!, parseInt(id));
    if (!existingApp) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application
    const updates: any = {};
    if (company_name) updates.company_name = company_name;
    if (job_role) updates.job_role = job_role;
    if (platform) updates.platform = platform;
    if (status) updates.status = status;
    if (recruiter_email !== undefined) updates.recruiter_email = recruiter_email;
    if (recruiter_name !== undefined) updates.recruiter_name = recruiter_name;
    if (application_link !== undefined) updates.application_link = application_link;
    if (notes !== undefined) updates.notes = notes;

    const updatedApplication = await updateJobApplication(userId!, parseInt(id), updates);

    res.status(200).json({
      message: 'Application updated successfully',
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application' });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const deleted = await deleteJobApplication(userId!, parseInt(id));

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const stats = await getApplicationStats(userId!);

    res.status(200).json({
      message: 'Statistics retrieved successfully',
      stats: {
        totalApplications: parseInt(stats.total_applications),
        pending: parseInt(stats.pending) || 0,
        interviews: parseInt(stats.interviews) || 0,
        offers: parseInt(stats.offers) || 0,
        rejected: parseInt(stats.rejected) || 0,
        todayApplications: parseInt(stats.today_applications) || 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve statistics' });
  }
};

export default {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
  getStats,
};
