import React, { useState, useEffect } from 'react';
import { applicationsAPI, activitiesAPI, remindersAPI } from '../services/api';
import { supabase } from '../config/supabase';
import './Dashboard.css';

/**
 * Dashboard page with statistics and overview
 */
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();

    // Subscribe to real-time changes in job_applications table
    const channel = supabase
      .channel('job_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        (payload) => {
          console.log('Job applications changed:', payload);
          // Refresh stats when applications change
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      setLoading(true);
      const [appStats, actStats, upcomingReminders] = await Promise.all([
        applicationsAPI.getStats(),
        activitiesAPI.getStats(7),
        remindersAPI.getUpcoming(7),
      ]);

      console.log('Dashboard data fetched:', { appStats, actStats, upcomingReminders });
      setStats(appStats.data?.stats || appStats.data || {});
      setActivityStats(actStats.data || {});
      setReminders(upcomingReminders.data?.reminders || []);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading"><div className="spinner"></div></div></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Refresh Stats
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Statistics Cards */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalApplications || 0}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.interviews || 0}</div>
          <div className="stat-label">Interviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.offers || 0}</div>
          <div className="stat-label">Offers</div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-number">{stats?.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.rejected || 0}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.todayApplications || 0}</div>
          <div className="stat-label">Today's Applications</div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="card">
        <h2>Activity Summary (Last 7 Days)</h2>
        {activityStats?.activityBreakdown && activityStats.activityBreakdown.length > 0 ? (
          <div className="activity-breakdown">
            <p>Study Hours: <strong>{activityStats.studyHours}h</strong></p>
            <ul>
              {activityStats.activityBreakdown.map((activity) => (
                <li key={activity.activity_type}>
                  {activity.activity_type}: {Math.round(activity.total_duration / 60)}h ({activity.count} entries)
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No activities recorded yet.</p>
        )}
      </div>

      {/* Upcoming Reminders */}
      <div className="card">
        <h2>Upcoming Reminders</h2>
        {reminders && reminders.length > 0 ? (
          <div className="reminders-list">
            {reminders.slice(0, 5).map((reminder) => (
              <div key={reminder.id} className="reminder-item">
                <strong>{reminder.title}</strong>
                <p>{reminder.description}</p>
                <small>{new Date(reminder.scheduled_date).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming reminders.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
