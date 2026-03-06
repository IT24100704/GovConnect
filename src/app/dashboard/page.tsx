'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockComplaints } from '@/data/mockData';

export default function AuthorityDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'assignments', 'resolved'

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [router]);

  // Filter complaints by department, status, and side-tab
  useEffect(() => {
    if (!user) return;
    
    let filtered = complaints.filter(c => c.departmentId === user.departmentId);
    
    // Side tab primary filtering
    if (activeTab === 'assignments') {
      filtered = filtered.filter(c => c.status !== 'resolved' && c.status !== 'rejected');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(c => c.status === 'resolved');
    }
    
    // Status filter overlay (from dropdown)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    setFilteredComplaints(filtered);
  }, [statusFilter, complaints, user, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return <div style={{ padding: '20px' }}>Loading...</div>;

  const stats = [
    { label: 'Pending', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'pending').length, color: '#eb7400', icon: '⏳' },
    { label: 'In Progress', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'in-progress').length, color: '#00534e', icon: '⚙️' },
    { label: 'Resolved', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'resolved').length, color: '#4caf50', icon: '✅' },
    { label: 'Total Assigned', count: complaints.filter(c => c.departmentId === user.departmentId).length, color: '#8d153a', icon: '📂' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url("/sl-admin-bg.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#8d153a', color: 'white', padding: '25px 0', position: 'fixed', height: '100vh', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '22px', margin: 0, color: '#ffbe29' }}>GovConnect</h2>
          <p style={{ fontSize: '12px', margin: '5px 0 0', opacity: 0.8, color: '#eb7400', fontWeight: 'bold' }}>AUTHORITY PORTAL</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div 
            onClick={() => setActiveTab('overview')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              backgroundColor: activeTab === 'overview' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'overview' ? '4px solid #ffbe29' : 'none'
            }}
          >
            Dashboard Overview
          </div>
          <div 
            onClick={() => setActiveTab('assignments')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              backgroundColor: activeTab === 'assignments' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'assignments' ? '4px solid #ffbe29' : 'none'
            }}
            onMouseOver={(e) => activeTab !== 'assignments' && (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => activeTab !== 'assignments' && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            My Assignments
          </div>
          <div 
            onClick={() => setActiveTab('resolved')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              backgroundColor: activeTab === 'resolved' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'resolved' ? '4px solid #ffbe29' : 'none'
            }}
            onMouseOver={(e) => activeTab !== 'resolved' && (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => activeTab !== 'resolved' && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Resolved Cases
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', width: '260px', padding: '0 25px' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>
              {activeTab === 'overview' ? 'Officer Dashboard' : 
               activeTab === 'assignments' ? 'Active Case Assignments' : 'Resolved Case Archive'}
            </h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>{user.department} | {user.role}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #ffbe29' }}>
            <div style={{ width: '35px', height: '35px', backgroundColor: '#eb7400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {user.name.charAt(0)}
            </div>
            <span style={{ fontWeight: '700', color: '#8d153a' }}>{user.name}</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (stat.label === 'Resolved') setActiveTab('resolved');
                else if (stat.label === 'Total Assigned') setActiveTab('overview');
                else {
                  setActiveTab('assignments');
                  setStatusFilter(stat.label.toLowerCase().replace(' ', '-'));
                }
              }}
              style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `4px solid ${stat.color}`, cursor: 'pointer', transition: '0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '24px', backgroundColor: `${stat.color}15`, padding: '12px', borderRadius: '10px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600' }}>{stat.label}</p>
                <h3 style={{ margin: '3px 0 0', fontSize: '22px', color: stat.color }}>{stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Complaints Table Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #ffbe29', overflow: 'hidden' }}>
          <div style={{ padding: '20px 25px', borderBottom: '2px solid #ffbe29', backgroundColor: '#fdf4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#8d153a', fontSize: '18px', fontWeight: '800' }}>INCOMING COMPLAINTS</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#8d153a', fontWeight: '700', outline: 'none' }}
            >
              <option value="all">View All Status</option>
              <option value="pending">Pending Only</option>
              <option value="in-progress">Under Investigation</option>
              <option value="resolved">Resolved Cases</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>CASE DETAILS</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>STATUS</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>PRIORITY</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>SUBMITTED</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                      No complaints found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map(complaint => (
                    <tr key={complaint.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '18px 25px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{complaint.title}</div>
                        <div style={{ fontSize: '13px', color: '#8d153a', fontWeight: '600' }}>ID: {complaint.id}</div>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <span style={{ 
                          backgroundColor: complaint.status === 'pending' ? '#eb740015' : complaint.status === 'resolved' ? '#4caf5015' : '#00534e15',
                          color: complaint.status === 'pending' ? '#eb7400' : complaint.status === 'resolved' ? '#4caf50' : '#00534e',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800',
                          textTransform: 'uppercase'
                        }}>
                          {complaint.status}
                        </span>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <span style={{ 
                          color: complaint.priority === 'urgent' ? '#d32f2f' : complaint.priority === 'high' ? '#eb7400' : '#475569',
                          fontWeight: '700',
                          fontSize: '13px'
                        }}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '18px 25px', color: '#64748b', fontSize: '14px' }}>
                        {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '18px 25px', textAlign: 'center' }}>
                        <button
                          onClick={() => router.push(`/complaint/${complaint.id}`)}
                          style={{ backgroundColor: '#8d153a', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
                        >
                          PROCESS CASE
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}