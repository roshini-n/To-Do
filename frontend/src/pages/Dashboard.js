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
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user info
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(fullName);
      }
    };
    getUser();
    
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
    <div className="dashboard-wrapper">
      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome Back, {userName}</h1>
          <p className="hero-subtitle">Track your job search progress and stay productive</p>
        </div>
        <button className="btn btn-refresh" onClick={fetchDashboardData}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Main Grid Layout */}
      <div className="dashboard-container">
        {/* Left Column - Primary Stats */}
        <div className="dashboard-column-main">
          {/* Key Metrics */}
          <section className="metrics-section">
            <div className="section-header">
              <h2>Your Progress</h2>
              <span className="section-badge">{stats?.totalApplications || 0} Applications</span>
            </div>
            <div className="metrics-grid">
              {/* Primary KPI */}
              <div className="metric-card primary">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.totalApplications || 0}</div>
                  <div className="metric-label">Total Applications</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Success Stats */}
              <div className="metric-card success">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.offers || 0}</div>
                  <div className="metric-label">Offers</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill success" style={{ width: `${stats?.totalApplications ? (stats.offers / stats.totalApplications * 100) : 0}%` }}></div>
                </div>
              </div>

              {/* Interview Stats */}
              <div className="metric-card info">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.interviews || 0}</div>
                  <div className="metric-label">Interview Calls</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill info" style={{ width: `${stats?.totalApplications ? (stats.interviews / stats.totalApplications * 100) : 0}%` }}></div>
                </div>
              </div>

              {/* Status Overview */}
              <div className="metric-card warning">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.pending || 0}</div>
                  <div className="metric-label">Pending Response</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill warning" style={{ width: `${stats?.totalApplications ? (stats.pending / stats.totalApplications * 100) : 0}%` }}></div>
                </div>
              </div>

              {/* Rejection Stats */}
              <div className="metric-card danger">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.rejected || 0}</div>
                  <div className="metric-label">Rejections</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill danger" style={{ width: `${stats?.totalApplications ? (stats.rejected / stats.totalApplications * 100) : 0}%` }}></div>
                </div>
              </div>

              {/* Today Stats */}
              <div className="metric-card highlight">
                <div className="metric-icon"></div>
                <div className="metric-content">
                  <div className="metric-value">{stats?.todayApplications || 0}</div>
                  <div className="metric-label">Applied Today</div>
                </div>
                <div className="metric-bar">
                  <div className="bar-fill highlight" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Summary */}
          {activityStats && (
            <section className="activity-section card">
              <div className="section-header">
                <h2>Activity This Week</h2>
                <span className="section-badge">Last 7 days</span>
              </div>
              {activityStats.activityBreakdown && activityStats.activityBreakdown.length > 0 ? (
                <div className="activity-list">
                  {activityStats.activityBreakdown.map((activity) => (
                    <div key={activity.activity_type} className="activity-item">
                      <div className="activity-info">
                        <h3>{activity.activity_type}</h3>
                        <p>{activity.count} activities</p>
                      </div>
                      <div className="activity-stat">{Math.round(activity.total_duration / 60)}h</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No activities recorded this week</p>
              )}
            </section>
          )}
        </div>

        {/* Right Column - Reminders */}
        <div className="dashboard-column-side">
          <section className="reminders-section card">
            <div className="section-header">
              <h2>Upcoming Reminders</h2>
              {reminders.length > 0 && <span className="section-badge">{reminders.length}</span>}
            </div>
            {reminders && reminders.length > 0 ? (
              <div className="reminders-list">
                {reminders.slice(0, 5).map((reminder) => (
                  <div key={reminder.id} className="reminder-item">
                    <div className="reminder-dot"></div>
                    <div className="reminder-content">
                      <h4>{reminder.title}</h4>
                      <p>{new Date(reminder.reminder_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No upcoming reminders</p>
            )}
          </section>

          {/* Quick Stats */}
          <section className="quick-stats card">
            <h3>Success Rate</h3>
            <div className="success-rate">
              <div className="rate-value">{stats?.totalApplications > 0 ? ((stats?.offers / stats?.totalApplications) * 100).toFixed(1) : 0}%</div>
              <div className="rate-label">Offer Conversion</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
