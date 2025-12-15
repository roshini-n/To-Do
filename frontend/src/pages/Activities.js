import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../services/api';
import './Activities.css';

/**
 * Activity Tracking page
 */
function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    activity_type: 'Study',
    title: '',
    duration_minutes: 0,
    description: '',
    activity_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDailyActivities();
  }, [selectedDate]);

  const fetchDailyActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getDailyActivities(selectedDate);
      setActivities(response.success ? response.data : []);
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await activitiesAPI.log(formData);
      await fetchDailyActivities();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to log activity');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      activity_type: 'Study',
      title: '',
      duration_minutes: 0,
      description: '',
      activity_date: new Date().toISOString().split('T')[0],
    });
  };

  const getActivityColor = (type) => {
    const colors = {
      'Study': '#3498db',
      'Job Application': '#2ecc71',
      'Interview': '#f39c12',
      'Leisure': '#9b59b6',
      'Other': '#95a5a6',
    };
    return colors[type] || '#95a5a6';
  };

  if (loading) {
    return <div className="container"><div className="loading"><div className="spinner"></div></div></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Activity Tracking</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Log Activity'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Date Selector */}
      <div className="date-selector">
        <label htmlFor="dateInput">Select Date:</label>
        <input
          id="dateInput"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Add Activity Form */}
      {showForm && (
        <div className="card form-card">
          <h2>Log Activity</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Activity Type *</label>
                <select name="activity_type" value={formData.activity_type} onChange={handleInputChange} required>
                  <option value="Study">Study</option>
                  <option value="Job Application">Job Application</option>
                  <option value="Interview">Interview</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., React Study Session"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="activity_date"
                  value={formData.activity_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Add any notes about this activity..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                Log Activity
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activities Timeline */}
      {activities.length > 0 ? (
        <div className="timeline">
          <h2>Activities for {new Date(selectedDate).toLocaleDateString()}</h2>
          {activities.map((activity) => (
            <div key={activity.id} className="timeline-item" style={{ borderLeftColor: getActivityColor(activity.activity_type) }}>
              <div className="timeline-marker" style={{ backgroundColor: getActivityColor(activity.activity_type) }}></div>
              <div className="timeline-content">
                <div className="activity-header">
                  <strong>{activity.title}</strong>
                  <span className="activity-type">{activity.activity_type}</span>
                </div>
                {activity.duration_minutes > 0 && (
                  <p className="activity-duration">Duration: {Math.floor(activity.duration_minutes / 60)}h {activity.duration_minutes % 60}m</p>
                )}
                {activity.description && <p className="activity-description">{activity.description}</p>}
                <small className="activity-time">{new Date(activity.activity_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p>No activities logged for {new Date(selectedDate).toLocaleDateString()}. Start by logging your first activity!</p>
        </div>
      )}
    </div>
  );
}

export default Activities;
