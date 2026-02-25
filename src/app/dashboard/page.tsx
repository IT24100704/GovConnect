'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockComplaints } from '@/data/mockData';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Filter complaints by department and status
  useEffect(() => {
    if (!user) return;
    
    let filtered = complaints;
    
    // Auto-filter by user's department
    filtered = filtered.filter(c => c.departmentId === user.departmentId);
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredComplaints(filtered);
  }, [statusFilter, complaints, user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'pending': 'badge-pending',
      'assigned': 'badge-assigned',
      'in-progress': 'badge-in-progress',
      'resolved': 'badge-resolved',
      'rejected': 'badge-rejected'
    };
    return `badge ${classes[status as keyof typeof classes] || ''}`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      'urgent': 'badge-urgent',
      'high': 'badge-high',
      'medium': 'badge-medium',
      'low': 'badge-low'
    };
    return `badge ${classes[priority as keyof typeof classes] || ''}`;
  };

  if (!user) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">GovConnect Authority Portal</div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <span style={{ 
            backgroundColor: '#1565c0', 
            padding: '4px 10px', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {user.department}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        {/* Department Header */}
        <div className="card">
          <h2>Complaints Dashboard</h2>
          <p>Showing complaints for: <strong>{user.department}</strong></p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Total complaints: {filteredComplaints.length}
          </p>
        </div>

        {/* Status Filter Only - Search Box Removed */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '200px' }}>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Complaints Table */}
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>
                    <span className={getStatusBadgeClass(complaint.status)}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    <span className={getPriorityBadgeClass(complaint.priority)}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '5px 10px' }}
                      onClick={() => router.push(`/complaint/${complaint.id}`)}
                    >
                      View & Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No complaints found for your department.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}