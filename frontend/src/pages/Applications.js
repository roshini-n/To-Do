import React, { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';
import './Applications.css';

/**
 * Job Applications page
 */
function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    platform: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    recruiterEmail: '',
    recruiterContact: '',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getAll();
      const data = response.success ? response.data : [];
      // Sort by creation date or application date, most recent first
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.created_at || a.applicationDate);
        const dateB = new Date(b.created_at || b.applicationDate);
        return dateB - dateA; // Most recent first
      });
      setApplications(sorted);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      console.log('Submitting form data:', formData);
      
      let result;
      if (editingId) {
        console.log('Updating application:', editingId);
        result = await applicationsAPI.update(editingId, formData);
      } else {
        console.log('Creating new application');
        result = await applicationsAPI.create(formData);
      }
      
      console.log('Submit result:', result);
      
      if (!result.success) {
        const errorMsg = result.error || (editingId ? 'Failed to update application' : 'Failed to create application');
        setError(errorMsg);
        console.error('Submit error:', errorMsg);
        return;
      }
      
      console.log('Submit successful, refreshing list...');
      await fetchApplications();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError('Failed to save application: ' + err.message);
      console.error('Save error:', err);
    }
  };

  const handleEdit = (app) => {
    setFormData({
      companyName: app.company_name,
      jobRole: app.job_role,
      platform: app.platform,
      applicationDate: new Date(app.application_date).toISOString().split('T')[0],
      status: app.status,
      recruiterEmail: app.recruiter_email,
      recruiterContact: app.recruiter_contact,
    });
    setEditingId(app.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationsAPI.delete(id);
        await fetchApplications();
      } catch (err) {
        setError('Failed to delete application');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      jobRole: '',
      platform: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      recruiterEmail: '',
      recruiterContact: '',
    });
    setEditingId(null);
  };

  const getStatusClass = (status) => {
    const baseClass = 'app-status status-';
    switch (status) {
      case 'Interview':
        return baseClass + 'interview';
      case 'Offer':
        return baseClass + 'offer';
      case 'Rejected':
        return baseClass + 'rejected';
      case 'No Response':
        return baseClass + 'no-response';
      default:
        return baseClass + 'applied';
    }
  };

  if (loading) {
    return <div className="container"><div className="loading"><div className="spinner"></div></div></div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Job Applications</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card form-card">
          <h2>{editingId ? 'Edit Application' : 'Add New Application'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Job Role *</label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Platform *</label>
                <select name="platform" value={formData.platform} onChange={handleInputChange} required>
                  <option value="">Select Platform</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Dice">Dice</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Glassdoor">Glassdoor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Applied Date *</label>
                <input
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="No Response">No Response</option>
                </select>
              </div>
              <div className="form-group">
                <label>Recruiter Email</label>
                <input
                  type="email"
                  name="recruiterEmail"
                  value={formData.recruiterEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Recruiter Contact</label>
              <input
                type="text"
                name="recruiterContact"
                value={formData.recruiterContact}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update' : 'Save'} Application
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

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="app-header">
                <div className="app-title">
                  <h3>{app.company_name}</h3>
                  <p>{app.job_role}</p>
                </div>
                <span className={getStatusClass(app.status)}>{app.status}</span>
              </div>

              <div className="app-details">
                <div className="detail-item">
                  <span className="detail-label">Platform</span>
                  <span className="detail-value">{app.platform}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied Date</span>
                  <span className="detail-value">{new Date(app.application_date).toLocaleDateString()}</span>
                </div>
                {app.recruiter_email && (
                  <div className="detail-item">
                    <span className="detail-label">Recruiter Email</span>
                    <span className="detail-value">{app.recruiter_email}</span>
                  </div>
                )}
                {app.recruiter_contact && (
                  <div className="detail-item">
                    <span className="detail-label">Recruiter Contact</span>
                    <span className="detail-value">{app.recruiter_contact}</span>
                  </div>
                )}
              </div>

              <div className="app-actions">
                <button className="btn-edit" onClick={() => handleEdit(app)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(app.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No applications yet</h3>
          <p>Start tracking your job search by adding your first application</p>
        </div>
      )}
    </div>
  );
}

export default Applications;
