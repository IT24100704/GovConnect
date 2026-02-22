'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockComplaints, mockCurrentUser } from '@/data/mockData';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Filter complaints based on jurisdiction, status, and search
  useEffect(() => {
    let filtered = complaints;
    
    // Filter by jurisdiction (auto-filter)
    if (user?.jurisdiction) {
      filtered = filtered.filter(c => c.jurisdiction === user.jurisdiction);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredComplaints(filtered);
  }, [statusFilter, searchTerm, complaints, user]);

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-brand">GovConnect Authority Portal</div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <span style={{ fontSize: '14px' }}>({user.jurisdiction})</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <div className="card">
          <h2>Complaint Queue</h2>
          <p>Showing complaints from: <strong>{user.jurisdiction}</strong></p>
        </div>

        {/* Filters */}
        <div className="card">
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
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
                <th>Citizen</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(complaint => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.title}</td>
                  <td>{complaint.citizenName}</td>
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
                  <td>{complaint.assignedToName || 'Unassigned'}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '5px 10px' }}
                      onClick={() => router.push(`/complaint/${complaint.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              No complaints found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}